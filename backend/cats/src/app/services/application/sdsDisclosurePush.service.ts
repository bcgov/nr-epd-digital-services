import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../../entities/application.entity';
import { ApplicationSubmission } from '../../entities/applicationSubmission.entity';
import { PushedSiteDisclosureDto } from '../../dto/application/sdsDisclosurePush.dto';
import { LoggerService } from '../../logger/logger.service';
import { SiteService } from '../site/site.service';
import { mapSdsToSiteDisclosure } from './sdsDisclosure.mapper';
import {
  isSameSdsDisclosurePushAttempt,
  readSdsDisclosurePushAttempt,
  SdsDisclosurePushAttempt,
  withSdsDisclosureLastPush,
  withSdsDisclosurePushAttempt,
  withoutSdsDisclosurePushAttempt,
} from './sdsDisclosureLastPush';

const SDS_APP_TYPE_ABBREV = 'SDS';
const SDS_APP_TYPE_DESCRIPTION = 'Site Disclosure Statement';
const SYSTEM_ACTOR = 'CATS';
const ACTOR_MAX_LENGTH = 20;

/**
 * SITE returns this code when the unique `(site_id, date_completed)` index is
 * violated. CATS surfaces it distinctly and never rewrites the date to retry.
 *
 * A duplicate is last-push bookkeeping only when this application already has
 * a pending attempt for that same site and date. That attempt is written
 * before the SITE call, so a commit whose last-push update then failed can be
 * repaired on retry. Any other duplicate stays a conflict: SITE may already
 * hold someone else's disclosure for that date.
 */
export const SDS_PUSH_DUPLICATE_DATE_COMPLETED = 'DUPLICATE_DATE_COMPLETED';

export class SdsDisclosureDuplicateException extends ConflictException {
  readonly errorCode = SDS_PUSH_DUPLICATE_DATE_COMPLETED;

  constructor(
    message = 'A site disclosure already exists for this site and date completed.',
  ) {
    super(message);
  }
}

/**
 * Pushes an SDS application's mapped disclosure into Site Registry as a new
 * SITE disclosure.
 *
 * Always-add: existing SITE disclosures are never updated or deleted. The
 * mapped payload is the same one the preview shows; a missing signature date
 * is filled with `now()` at send time only. On success the last push is stored
 * under the application's application-specific JSON, and the pending attempt
 * is cleared in that same update.
 */
@Injectable()
export class SdsDisclosurePushService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(ApplicationSubmission)
    private readonly submissionRepository: Repository<ApplicationSubmission>,
    private readonly siteService: SiteService,
    private readonly loggerService: LoggerService,
  ) {}

  async pushSiteDisclosure(
    applicationId: number,
    user?: any,
  ): Promise<PushedSiteDisclosureDto> {
    this.loggerService.log(
      'SdsDisclosurePushService.pushSiteDisclosure() start',
    );

    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['appType'],
    });

    if (!application) {
      throw new NotFoundException(`Application ${applicationId} not found`);
    }

    if (!this.isSdsApplication(application)) {
      throw new BadRequestException(
        'Pushing to Site Registry is only available for Site Disclosure Statement applications',
      );
    }

    if (application.siteId == null) {
      throw new BadRequestException(
        'Link a Site ID before pushing this disclosure to Site Registry',
      );
    }

    const siteId = application.siteId;

    const submission = await this.submissionRepository.findOne({
      where: { applicationId },
    });

    if (!submission?.formData) {
      throw new BadRequestException(
        'The SDS submission could not be found for this application',
      );
    }

    const disclosure = mapSdsToSiteDisclosure(submission.formData);
    const dateCompleted = disclosure.dateCompleted ?? this.today();
    const actor = this.resolveActor(user);
    const priorAttempt = readSdsDisclosurePushAttempt(
      application.applicationSpecificData,
    );

    await this.rememberPushAttempt(application.id, {
      siteId,
      dateCompleted,
      attemptedAt: new Date().toISOString(),
    });

    try {
      await this.saveToSite(siteId, {
        dateCompleted,
        siteRegDateRecd: disclosure.siteRegDateRecd,
        localAuthDateRecd: disclosure.localAuthDateRecd,
        rwmDateDecision: disclosure.rwmDateDecision,
        schedule2ReferenceCodes: disclosure.schedule2References.map(
          (reference) => reference.code,
        ),
        plannedActivityComment: disclosure.plannedActivityComment,
        siteDisclosureComment: disclosure.siteDisclosureComment,
        govDocumentsComment: disclosure.govDocumentsComment,
      });
    } catch (error) {
      if (
        error instanceof SdsDisclosureDuplicateException &&
        isSameSdsDisclosurePushAttempt(priorAttempt, siteId, dateCompleted)
      ) {
        this.loggerService.log(
          'SdsDisclosurePushService.pushSiteDisclosure() SITE already has this disclosure; recording last push',
        );
        return this.recordLastPush(application.id, siteId, actor);
      }

      if (
        error instanceof SdsDisclosureDuplicateException ||
        error instanceof BadRequestException
      ) {
        await this.forgetPushAttempt(application.id);
      }

      throw error;
    }

    const result = await this.recordLastPush(application.id, siteId, actor);

    this.loggerService.log('SdsDisclosurePushService.pushSiteDisclosure() end');

    return result;
  }

  /**
   * Persist the attempt before SITE is called. A failure here means SITE was
   * not contacted, so there is nothing to reconcile.
   */
  private async rememberPushAttempt(
    applicationId: number,
    attempt: SdsDisclosurePushAttempt,
  ): Promise<void> {
    await this.patchSpecificData(applicationId, (current) =>
      withSdsDisclosurePushAttempt(current, attempt),
    );
  }

  private async recordLastPush(
    applicationId: number,
    siteId: number,
    actor: string,
  ): Promise<PushedSiteDisclosureDto> {
    const lastPushedAt = new Date().toISOString();

    await this.patchSpecificData(
      applicationId,
      (current) =>
        withSdsDisclosureLastPush(withoutSdsDisclosurePushAttempt(current), {
          siteId,
          lastPushedAt,
        }),
      actor,
    );

    return { siteId, lastPushedAt };
  }

  /**
   * Drop the attempt after a definitive SITE rejection. Leaving it in place
   * would make the next duplicate look like a lost last-push update.
   * A failed clear is logged and swallowed so the SITE outcome still reaches
   * the caller; the next retry can then be misread as a recovery.
   */
  private async forgetPushAttempt(applicationId: number): Promise<void> {
    try {
      await this.patchSpecificData(applicationId, (current) =>
        withoutSdsDisclosurePushAttempt(current),
      );
    } catch (error) {
      this.loggerService.error(
        'SdsDisclosurePushService.forgetPushAttempt() could not clear the pending attempt',
        error,
      );
    }
  }

  /**
   * Re-read immediately before writing so a post-SITE update does not replace
   * `application_specific_data` with the snapshot from the start of the push.
   */
  private async patchSpecificData(
    applicationId: number,
    mutate: (
      current: Record<string, any> | null | undefined,
    ) => Record<string, any>,
    actor?: string,
  ): Promise<void> {
    const current = await this.applicationRepository.findOne({
      where: { id: applicationId },
    });

    if (!current) {
      throw new NotFoundException(`Application ${applicationId} not found`);
    }

    await this.applicationRepository.update(applicationId, {
      applicationSpecificData: mutate(current.applicationSpecificData),
      ...(actor ? { updatedBy: actor, updatedDateTime: new Date() } : {}),
    });
  }

  private async saveToSite(
    siteId: number,
    input: {
      dateCompleted: string;
      siteRegDateRecd: string | null;
      localAuthDateRecd: string | null;
      rwmDateDecision: string | null;
      schedule2ReferenceCodes: string[];
      plannedActivityComment: string | null;
      siteDisclosureComment: string | null;
      govDocumentsComment: string | null;
    },
  ) {
    let result: Awaited<
      ReturnType<SiteService['saveSiteDisclosureForService']>
    >;

    try {
      result = await this.siteService.saveSiteDisclosureForService(
        String(siteId),
        input,
      );
    } catch (error) {
      this.loggerService.error(
        'SdsDisclosurePushService.saveToSite() SITE call failed',
        error,
      );
      throw new InternalServerErrorException(
        'Unable to push the disclosure to Site Registry. Please try again.',
      );
    }

    const response = result?.saveSiteDisclosureForService;

    if (!response) {
      throw new InternalServerErrorException(
        'Site Registry did not return a response',
      );
    }

    if (!response.success) {
      if (response.errorCode === SDS_PUSH_DUPLICATE_DATE_COMPLETED) {
        this.loggerService.log(
          'SdsDisclosurePushService.saveToSite() duplicate disclosure',
        );
        throw new SdsDisclosureDuplicateException(
          response.message ?? undefined,
        );
      }

      throw new BadRequestException(
        response.message || 'Site Registry rejected the disclosure',
      );
    }

    return response;
  }

  private isSdsApplication(application: Application): boolean {
    const abbrev = application.appType?.abbrev?.trim().toUpperCase();
    if (abbrev === SDS_APP_TYPE_ABBREV) {
      return true;
    }

    const description = application.appType?.description?.trim().toUpperCase();
    return description === SDS_APP_TYPE_DESCRIPTION.toUpperCase();
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private resolveActor(user?: any): string {
    const name =
      user?.name ||
      user?.preferred_username ||
      user?.given_name ||
      SYSTEM_ACTOR;

    return String(name).slice(0, ACTOR_MAX_LENGTH);
  }
}
