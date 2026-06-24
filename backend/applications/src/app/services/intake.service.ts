import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { FormService } from './form.service';
import { CatsService } from './cats.service';
import { ChefsService, CHEFS_FORM_NAME_TO_APP_TYPE } from './chefs.service';
import ApplicationType from '../constants/applicationType';
import { ChefsWebhookDto } from '../dto/chefs-webhook.dto';
import { SubmissionResponse } from '../dto/submissionResponse.dto';
import { Form } from '../entities/form.entity';

/** NOM pilot form on submit.digital.gov.bc.ca */
export const CHEFS_NOM_FORM_ID_DEFAULT =
  '94fa90d0-645f-42ca-bf07-2d7b6184d472';

export type ChefsWebhookResult =
  | IntakeSubmitResult
  | { ignored: true; reason: string };

export interface IntakeSubmitResult {
  submission: SubmissionResponse;
  catsApplicationId: number | null;
  catsIntegrated: boolean;
  message: string;
}

@Injectable()
export class IntakeService {
  private readonly logger = new Logger(IntakeService.name);

  constructor(
    private readonly formService: FormService,
    private readonly catsService: CatsService,
    private readonly chefsService: ChefsService,
  ) {}

  isCatsIntegrationEnabled(): boolean {
    return process.env.CATS_INTEGRATION_ENABLED === 'true';
  }

  transformResult(savedSubmission: Form): SubmissionResponse {
    const submissionResponse = new SubmissionResponse();
    submissionResponse._id = savedSubmission.id;
    submissionResponse.form = savedSubmission.formId;
    submissionResponse.data = savedSubmission.formData;
    submissionResponse.created = savedSubmission.createdDate;
    submissionResponse.modified = savedSubmission.modifiedDate;
    return submissionResponse;
  }

  /**
   * Core intake path: persist submission and optionally create CATS application.
   */
  async submitToIntake(
    formId: string,
    data: Record<string, unknown>,
    meta?: { chefsSubmissionId?: string; chefsFormId?: string },
  ): Promise<IntakeSubmitResult> {
    const payload = meta?.chefsSubmissionId
      ? {
          ...data,
          _intake: {
            chefsSubmissionId: meta.chefsSubmissionId,
            chefsFormId: meta.chefsFormId ?? formId,
          },
        }
      : data;

    if (meta?.chefsSubmissionId) {
      const existing = await this.formService.findByChefsSubmissionId(
        meta.chefsSubmissionId,
      );
      if (existing) {
        const merged = this.mergeIntakeMetadata(
          payload as Record<string, unknown>,
          existing.formData as unknown as Record<string, unknown>,
        );
        return this.syncExistingToCats(existing, merged);
      }
    }

    const saved = await this.formService.create(formId, payload as any);
    return this.pushToCats(saved, payload as Record<string, unknown>);
  }

  getNomFormId(): string {
    return process.env.CHEFS_NOM_FORM_ID ?? CHEFS_NOM_FORM_ID_DEFAULT;
  }

  getNomApiKey(): string | undefined {
    return process.env.CHEFS_NOM_API_KEY;
  }

  /**
   * Handle CHEFS Event Subscription webhook (metadata only — fetches full submission via API).
   * Pilot scope: NOM form only.
   */
  async handleChefsWebhook(body: ChefsWebhookDto): Promise<ChefsWebhookResult> {
    if (body.subscriptionEvent !== 'eventSubmission') {
      return {
        ignored: true,
        reason: `Unhandled subscription event: ${body.subscriptionEvent}`,
      };
    }

    if (!body.submissionId) {
      throw new BadRequestException(
        'CHEFS webhook missing submissionId for eventSubmission',
      );
    }

    const nomFormId = this.getNomFormId();
    if (body.formId !== nomFormId) {
      throw new BadRequestException(
        `Unsupported form ${body.formId}. Pilot webhook accepts NOM only (${nomFormId}).`,
      );
    }

    const apiKey = this.getNomApiKey();
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'CHEFS_NOM_API_KEY is not configured on the intake adapter',
      );
    }

    return this.submitFromChefs(body.formId, body.submissionId, apiKey);
  }

  async submitFromChefs(
    chefsFormId: string,
    chefsSubmissionId: string,
    apiKey: string,
  ): Promise<IntakeSubmitResult> {
    try {
      const chefsPayload = await this.chefsService.getSubmission(
        chefsFormId,
        chefsSubmissionId,
        apiKey,
      );

      const data = this.withResolvedAppType(chefsPayload);

      return this.submitToIntake(chefsFormId, data, {
        chefsSubmissionId,
        chefsFormId,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('CHEFS fetch failed', error?.response?.data ?? error);
      throw new ServiceUnavailableException(
        'Could not fetch submission from CHEFS. Check form ID, submission ID, API key, and CHEFS_API_URL.',
      );
    }
  }

  async updateStatus(
    formId: string,
    submissionId: string,
    statusTypeAbbrev: string,
    formsflowAppId = 0,
  ) {
    if (!this.isCatsIntegrationEnabled()) {
      throw new ServiceUnavailableException('CATS integration is disabled');
    }

    return this.catsService.updateCatsApplication(submissionId, formId, {
      applicationStatus: statusTypeAbbrev,
      applicationId: formsflowAppId,
    });
  }

  async getChefsFormSchema(formId: string) {
    const apiKey = this.resolveChefsApiKey();
    try {
      return await this.chefsService.getPublishedFormSchema(formId, apiKey);
    } catch (error) {
      this.logger.error(
        'CHEFS form schema fetch failed',
        error?.response?.data ?? error,
      );
      throw new ServiceUnavailableException(
        'Could not fetch form schema from CHEFS. Check CHEFS_NOM_API_KEY and form ID.',
      );
    }
  }

  resolveChefsApiKey(override?: string): string {
    const apiKey = override?.trim() || this.getNomApiKey();
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'CHEFS API key required: set CHEFS_NOM_API_KEY on the intake adapter.',
      );
    }
    return apiKey;
  }

  async listNomChefsSubmissions(limit = 10, apiKeyOverride?: string) {
    const apiKey = this.resolveChefsApiKey(apiKeyOverride);
    const formId = this.getNomFormId();
    try {
      const submissions = await this.chefsService.listSubmissions(
        formId,
        apiKey,
        limit,
      );
      return { formId, submissions };
    } catch (error) {
      this.logger.error('CHEFS list failed', error?.response?.data ?? error);
      throw new ServiceUnavailableException(
        'Could not list CHEFS submissions. Check CHEFS_NOM_API_KEY and network access to CHEFS.',
      );
    }
  }

  async ingestLatestChefsSubmission(apiKeyOverride?: string) {
    const { formId, submissions } = await this.listNomChefsSubmissions(
      1,
      apiKeyOverride,
    );
    const latest = submissions[0];
    if (!latest) {
      throw new BadRequestException(
        'No CHEFS submissions found for the NOM form. Submit the form in CHEFS first (step 1).',
      );
    }
    const apiKey = this.resolveChefsApiKey(apiKeyOverride);
    return this.submitFromChefs(formId, latest.submissionId, apiKey);
  }

  private withResolvedAppType(
    chefsPayload: { data: Record<string, unknown>; formName?: string; formId: string },
  ): Record<string, unknown> {
    const existing = chefsPayload.data?.hdnAppType;
    if (existing != null && String(existing).trim() !== '') {
      return chefsPayload.data;
    }

    const fromFormName = chefsPayload.formName
      ? CHEFS_FORM_NAME_TO_APP_TYPE[chefsPayload.formName.toUpperCase()]
      : undefined;

    if (fromFormName) {
      this.logger.log(
        `Derived hdnAppType=${fromFormName} from CHEFS form.name="${chefsPayload.formName}"`,
      );
      return { ...chefsPayload.data, hdnAppType: fromFormName };
    }

    if (chefsPayload.formId === this.getNomFormId()) {
      this.logger.log(
        `Derived hdnAppType=${ApplicationType.NOM} from NOM pilot formId`,
      );
      return { ...chefsPayload.data, hdnAppType: ApplicationType.NOM };
    }

    throw new BadRequestException(
      'CHEFS submission is missing hdnAppType and form.name could not be mapped — add a hidden hdnAppType field or use a recognized CHEFS form name (e.g. NOM).',
    );
  }

  private getStoredCatsApplicationId(
    data: Record<string, unknown>,
  ): number | null {
    const intake = data?._intake;
    if (!intake || typeof intake !== 'object') {
      return null;
    }
    const id = (intake as Record<string, unknown>).catsApplicationId;
    return typeof id === 'number' ? id : null;
  }

  private withCatsApplicationIdInIntake(
    data: Record<string, unknown>,
    catsApplicationId: number,
  ): Record<string, unknown> {
    const intake =
      data._intake && typeof data._intake === 'object'
        ? { ...(data._intake as Record<string, unknown>) }
        : {};
    return {
      ...data,
      _intake: { ...intake, catsApplicationId },
    };
  }

  /** Proponent-visible submission fields only (exclude adapter `_intake`). */
  private stripIntakeForCompare(
    data: Record<string, unknown>,
  ): Record<string, unknown> {
    const { _intake: _ignored, ...fields } = data;
    return fields;
  }

  private stableJson(value: unknown): string {
    const normalize = (input: unknown): unknown => {
      if (input === null || typeof input !== 'object') {
        return input;
      }
      if (Array.isArray(input)) {
        return input.map(normalize);
      }
      const record = input as Record<string, unknown>;
      return Object.keys(record)
        .sort()
        .reduce<Record<string, unknown>>((acc, key) => {
          acc[key] = normalize(record[key]);
          return acc;
        }, {});
    };
    return JSON.stringify(normalize(value));
  }

  private proponentFieldsEqual(
    existing: Record<string, unknown>,
    incoming: Record<string, unknown>,
  ): boolean {
    return (
      this.stableJson(this.stripIntakeForCompare(existing)) ===
      this.stableJson(this.stripIntakeForCompare(incoming))
    );
  }

  private intakeMetadataEqual(
    existing: Record<string, unknown>,
    incoming: Record<string, unknown>,
  ): boolean {
    return (
      this.stableJson(existing._intake ?? {}) ===
      this.stableJson(incoming._intake ?? {})
    );
  }

  private mergeIntakeMetadata(
    incoming: Record<string, unknown>,
    existingFormData: Record<string, unknown>,
  ): Record<string, unknown> {
    const existingIntake =
      existingFormData?._intake && typeof existingFormData._intake === 'object'
        ? (existingFormData._intake as Record<string, unknown>)
        : {};
    const incomingIntake =
      incoming?._intake && typeof incoming._intake === 'object'
        ? (incoming._intake as Record<string, unknown>)
        : {};

    return {
      ...incoming,
      _intake: {
        ...existingIntake,
        ...incomingIntake,
        catsApplicationId:
          incomingIntake.catsApplicationId ?? existingIntake.catsApplicationId,
      },
    };
  }

  private async syncExistingToCats(
    existing: Form,
    data: Record<string, unknown>,
  ): Promise<IntakeSubmitResult> {
    let existingCatsId = this.getStoredCatsApplicationId(
      existing.formData as unknown as Record<string, unknown>,
    );

    let dataToSave = data;

    if (existingCatsId == null) {
      const fromCats =
        await this.formService.findCatsApplicationIdByFormSubmission(
          existing.formId,
          existing.id,
        );
      if (fromCats != null) {
        existingCatsId = fromCats;
        dataToSave = this.withCatsApplicationIdInIntake(data, fromCats);
        this.logger.log(
          `Recovered CATS application ${fromCats} for CHEFS submission via app_status lookup`,
        );
      }
    }

    const existingData = existing.formData as unknown as Record<string, unknown>;
    const proponentUnchanged = this.proponentFieldsEqual(
      existingData,
      dataToSave,
    );
    const intakeUnchanged = this.intakeMetadataEqual(existingData, dataToSave);

    if (proponentUnchanged && intakeUnchanged) {
      if (existingCatsId != null) {
        return {
          submission: this.transformResult(existing),
          catsApplicationId: existingCatsId,
          catsIntegrated: this.isCatsIntegrationEnabled(),
          message: `No changes since last ingest. CATS application ${existingCatsId} unchanged.`,
        };
      }
    }

    await this.formService.update(existing.id, existing.formId, dataToSave as any);
    const refreshed = await this.formService.findOne(existing.id, existing.formId);

    if (existingCatsId != null) {
      if (!proponentUnchanged) {
        await this.syncSitesToCatsIfPresent(
          dataToSave,
          existing.id,
          existing.formId,
        );
      }
      const submission = this.transformResult(refreshed);
      const siteIds = this.catsService.getSiteIdsFromFormData(dataToSave);
      const siteNote =
        siteIds.length > 0 && !proponentUnchanged
          ? ` Site ID(s): ${siteIds.join(', ')}.`
          : '';
      const message = proponentUnchanged
        ? `CATS application ${existingCatsId} link restored in submission mirror.`
        : `CHEFS resubmission received. CATS application ${existingCatsId} unchanged; submission mirror updated from CHEFS.${siteNote}`;
      return {
        submission,
        catsApplicationId: existingCatsId,
        catsIntegrated: this.isCatsIntegrationEnabled(),
        message,
      };
    }

    return this.pushToCats(refreshed, dataToSave, { reIngest: true });
  }

  private async syncSitesToCatsIfPresent(
    data: Record<string, unknown>,
    adapterSubmissionId: string,
    formId: string,
  ): Promise<void> {
    if (!this.isCatsIntegrationEnabled()) {
      return;
    }
    const siteIds = this.catsService.getSiteIdsFromFormData(data);
    if (siteIds.length === 0) {
      return;
    }
    const current = await this.formService.findCatsApplicationCurrentStatus(
      formId,
      adapterSubmissionId,
    );
    await this.catsService.syncApplicationSites(
      data,
      adapterSubmissionId,
      formId,
      current?.statusTypeAbbrev ?? 'New',
    );
  }

  private async pushToCats(
    saved: Form,
    data: Record<string, unknown>,
    options?: { reIngest?: boolean },
  ): Promise<IntakeSubmitResult> {
    const submission = this.transformResult(saved);

    if (!this.isCatsIntegrationEnabled()) {
      return {
        submission,
        catsApplicationId: null,
        catsIntegrated: false,
        message: 'Submission saved. CATS integration disabled (set CATS_INTEGRATION_ENABLED=true).',
      };
    }

    const catsApplicationId = await this.catsService.submitToCats(
      data,
      saved.id,
      saved.formId,
    );

    if (catsApplicationId != null) {
      const dataWithCatsId = this.withCatsApplicationIdInIntake(
        data,
        catsApplicationId,
      );
      await this.formService.update(
        saved.id,
        saved.formId,
        dataWithCatsId as any,
      );
      const refreshed = await this.formService.findOne(saved.id, saved.formId);
      const siteIds = this.catsService.getSiteIdsFromFormData(data);
      const siteNote =
        siteIds.length > 0 ? ` Site ID(s): ${siteIds.join(', ')}.` : '';
      return {
        submission: this.transformResult(refreshed),
        catsApplicationId,
        catsIntegrated: true,
        message: options?.reIngest
          ? `CATS application ${catsApplicationId} created for CHEFS submission already in adapter.${siteNote}`
          : `Submission saved and CATS application ${catsApplicationId} created.${siteNote}`,
      };
    }

    const failureDetail =
      'CATS application creation failed — check CATS_API, app type, and status seeds.';
    return {
      submission,
      catsApplicationId: null,
      catsIntegrated: true,
      message: options?.reIngest
        ? `CHEFS submission already in adapter (mirror refreshed). ${failureDetail}`
        : `Submission saved but ${failureDetail}`,
    };
  }
}
