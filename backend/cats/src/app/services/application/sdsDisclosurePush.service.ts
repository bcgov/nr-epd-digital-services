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
import { withSdsDisclosureLastPush } from './sdsDisclosureLastPush';

const SDS_APP_TYPE_ABBREV = 'SDS';
const SDS_APP_TYPE_DESCRIPTION = 'Site Disclosure Statement';
const SYSTEM_ACTOR = 'CATS';
const ACTOR_MAX_LENGTH = 20;

/**
 * SITE returns this code when the unique `(site_id, date_completed)` index is
 * violated. CATS surfaces it distinctly and never rewrites the date to retry.
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
 * under the application's application-specific JSON.
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

    const siteResponse = await this.saveToSite(siteId, {
      dateCompleted: disclosure.dateCompleted ?? this.today(),
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

    const lastPushedAt = new Date().toISOString();
    const actor = this.resolveActor(user);

    await this.applicationRepository.update(application.id, {
      applicationSpecificData: withSdsDisclosureLastPush(
        application.applicationSpecificData,
        { siteId, lastPushedAt },
      ),
      updatedBy: actor,
      updatedDateTime: new Date(),
    });

    this.loggerService.log('SdsDisclosurePushService.pushSiteDisclosure() end');

    return { siteId, lastPushedAt };
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
