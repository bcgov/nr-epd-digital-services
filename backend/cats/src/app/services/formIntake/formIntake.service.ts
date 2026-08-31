import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { LoggerService } from '../../logger/logger.service';
import { ApplicationSubmissionService } from '../applicationSubmission/applicationSubmission.service';
import { ApplicationService } from '../application/application.service';
import {
  getFormConfigByAppType,
  getFormConfigByFormName,
} from './formIntake.constants';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable()
export class FormIntakeService {
  constructor(
    private readonly applicationSubmissionService: ApplicationSubmissionService,
    private readonly applicationService: ApplicationService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {}

  async fetchAndProcessSubmission(
    appTypeAbbrev: string,
    chefsSubmissionId: string,
    user: string = 'SYSTEM',
  ) {
    if (!UUID_PATTERN.test(chefsSubmissionId ?? '')) {
      throw new Error(`Invalid CHEFS submission ID: ${chefsSubmissionId}`);
    }

    const formConfig = getFormConfigByAppType(appTypeAbbrev);
    if (!formConfig) {
      throw new Error(
        `No form configuration found for appType: ${appTypeAbbrev}`,
      );
    }

    const chefsBaseUrl = this.configService.get<string>('CHEFS_API_URL');
    if (!chefsBaseUrl) {
      throw new Error('CHEFS_API_URL is not configured');
    }

    const chefsFormId = this.configService.get<string>(
      formConfig.chefsFormIdEnvKey,
    );
    if (!chefsFormId) {
      throw new Error(
        `CHEFS form ID not configured for appType ${appTypeAbbrev} (${formConfig.chefsFormIdEnvKey})`,
      );
    }

    const apiKey = this.configService.get<string>(formConfig.apiKeyEnvKey);
    if (!apiKey) {
      throw new Error(
        `CHEFS API key not configured for appType ${appTypeAbbrev} (${formConfig.apiKeyEnvKey})`,
      );
    }

    this.loggerService.log(
      `Fetching CHEFS submission ${chefsSubmissionId} for appType ${appTypeAbbrev}`,
    );

    const auth = Buffer.from(`${chefsFormId}:${apiKey}`).toString('base64');
    const response = await firstValueFrom(
      this.httpService.get(`${chefsBaseUrl}/submissions/${chefsSubmissionId}`, {
        headers: { Authorization: `Basic ${auth}` },
      }),
    );

    const returnedFormId = response.data?.form?.id;
    if (returnedFormId && returnedFormId !== chefsFormId) {
      throw new Error(
        `Submission ${chefsSubmissionId} belongs to form ${returnedFormId}, not the selected form`,
      );
    }

    if (this.isDraftSubmission(response.data)) {
      this.loggerService.log(
        `CHEFS submission ${chefsSubmissionId} is a draft, skipping processing`,
      );
      return null;
    }

    const rawFormData = this.mapApiSubmissionToWebhookPayload(response.data);

    return this.processWebhookSubmission(
      rawFormData,
      chefsSubmissionId,
      chefsFormId,
      user,
    );
  }

  private isDraftSubmission(data: Record<string, any>): boolean {
    const status = data?.submission?.status ?? data?.submission?.statusType;
    return typeof status === 'string' && status.toLowerCase() === 'draft';
  }

  // CHEFS GET /submissions/{id} nests the answers differently than the webhook payload.
  private mapApiSubmissionToWebhookPayload(
    data: Record<string, any>,
  ): Record<string, any> {
    const submission = data?.submission;
    const answers = submission?.submission?.data ?? {};

    return {
      ...answers,
      form: {
        id: data?.form?.id,
        formName: data?.form?.name,
        version: data?.version?.version,
        submissionId: submission?.id,
        confirmationId: submission?.confirmationId,
        submittedAt: submission?.createdAt,
      },
    };
  }

  async processWebhookSubmission(
    rawFormData: Record<string, any>,
    chefsSubmissionId: string,
    chefsFormId: string,
    user: string = 'SYSTEM',
  ) {
    try {
      this.loggerService.log(
        `Processing webhook submission for chefsSubmissionId ${chefsSubmissionId}`,
      );

      const chefsConfirmationId = this.extractConfirmationId(rawFormData);
      const linkedConfirmationIds =
        this.extractLinkedConfirmationIds(rawFormData);
      const chefsFormVersionNumber = this.extractFormVersionNumber(rawFormData);
      const receivedAt = this.extractSubmittedAt(rawFormData);

      const submission =
        await this.applicationSubmissionService.upsertSubmissionByChefsSubmissionId(
          {
            chefsFormId,
            chefsSubmissionId,
            chefsFormVersionNumber,
            chefsConfirmationId,
            linkedConfirmationIds,
            formData: JSON.stringify(rawFormData),
            receivedAt,
          },
          user,
        );

      if (!submission.applicationId) {
        const application = await this.createApplicationFromSubmission(
          rawFormData,
          chefsFormId,
          chefsSubmissionId,
        );

        if (application?.id) {
          await this.applicationSubmissionService.updateSubmission(
            {
              id: submission.id,
              applicationId: application.id,
            },
            user,
          );
          submission.applicationId = application.id;
        }
      }

      this.loggerService.log(
        `Webhook submission processed successfully for chefsSubmissionId ${chefsSubmissionId}`,
      );
      return submission;
    } catch (error: any) {
      this.loggerService.error(
        `Failed to process webhook submission for chefsSubmissionId ${chefsSubmissionId}: ${error.message}`,
        null,
      );
      throw new Error(
        `Failed to process webhook submission for chefsSubmissionId ${chefsSubmissionId}: ${error.message}`,
      );
    }
  }

  private async createApplicationFromSubmission(
    rawFormData: Record<string, any>,
    chefsFormId: string,
    chefsSubmissionId: string,
  ) {
    const formName = rawFormData?.form?.formName;
    const formConfig = getFormConfigByFormName(formName);

    if (!formConfig) {
      this.loggerService.error(
        `No form configuration found for form name: "${formName}"`,
        null,
      );
      throw new Error(`No form configuration found for form: "${formName}"`);
    }

    const siteIds = this.extractSiteIds(rawFormData, formConfig.siteIdField);
    const receivedDate = this.extractSubmittedAt(rawFormData) || new Date();

    return this.applicationService.createApplication({
      appTypeAbbrev: formConfig.appTypeAbbrev,
      siteIds,
      receivedDate,
      applicationStatus: [
        {
          applicationId: 0,
          statusTypeAbbrev: 'Received',
          isCurrent: true,
          formId: chefsFormId,
          submissionId: chefsSubmissionId,
          formsflowAppId: 0,
        },
      ],
    });
  }

  private extractSiteIds(
    rawFormData: Record<string, any>,
    siteIdField: string,
  ): number[] {
    const value = rawFormData?.[siteIdField];
    if (!value) return [];

    if (typeof value === 'number') return [value];

    if (typeof value === 'string') {
      return value
        .split(',')
        .map((id) => parseInt(id.trim(), 10))
        .filter((id) => !isNaN(id));
    }

    if (Array.isArray(value)) {
      return value
        .map((id) =>
          typeof id === 'number' ? id : parseInt(String(id).trim(), 10),
        )
        .filter((id) => !isNaN(id));
    }

    return [];
  }

  private extractConfirmationId(
    rawFormData: Record<string, any>,
  ): string | null {
    return rawFormData?.form?.confirmationId ?? null;
  }

  private extractLinkedConfirmationIds(
    rawFormData: Record<string, any>,
  ): string[] | null {
    const ids = rawFormData?.confirmationId;
    if (!ids) return null;
    if (Array.isArray(ids)) return ids;
    if (typeof ids === 'string') return [ids];
    return null;
  }

  private extractFormVersionNumber(
    rawFormData: Record<string, any>,
  ): string | null {
    const version = rawFormData?.form?.version;
    return version != null ? String(version) : null;
  }

  private extractSubmittedAt(rawFormData: Record<string, any>): Date | null {
    const submittedAt = rawFormData?.form?.submittedAt;
    if (!submittedAt) return null;
    const date = new Date(submittedAt);
    return isNaN(date.getTime()) ? null : date;
  }
}
