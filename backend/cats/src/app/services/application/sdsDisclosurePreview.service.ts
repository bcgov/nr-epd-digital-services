import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../../entities/application.entity';
import { ApplicationSubmission } from '../../entities/applicationSubmission.entity';
import { LoggerService } from '../../logger/logger.service';
import { SdsDisclosurePreviewDto } from '../../dto/application/sdsDisclosurePreview.dto';
import { SdsDisclosure, mapSdsToSiteDisclosure } from './sdsDisclosure.mapper';
import { readSdsDisclosureLastPush } from './sdsDisclosureLastPush';

const SDS_APP_TYPE_ABBREV = 'SDS';
const SDS_APP_TYPE_DESCRIPTION = 'Site Disclosure Statement';

const EMPTY_DISCLOSURE: SdsDisclosure = {
  siteRegDateRecd: null,
  dateCompleted: null,
  localAuthDateRecd: null,
  rwmDateDecision: null,
  siteRegDateEntered: null,
  schedule2References: [],
  plannedActivityComment: null,
  siteDisclosureComment: null,
  govDocumentsComment: null,
};

/**
 * Read-only SITE-shaped projection of an SDS application for the Application
 * tab preview. Reads and maps only; never writes to CATS or SITE and never
 * depends on a linked site.
 */
@Injectable()
export class SdsDisclosurePreviewService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(ApplicationSubmission)
    private readonly submissionRepository: Repository<ApplicationSubmission>,
    private readonly loggerService: LoggerService,
  ) {}

  async getSdsDisclosurePreview(
    applicationId: number,
  ): Promise<SdsDisclosurePreviewDto> {
    this.loggerService.log(
      'SdsDisclosurePreviewService.getSdsDisclosurePreview() start',
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
        'The site disclosure preview is only available for Site Disclosure Statement applications',
      );
    }

    const lastPush = readSdsDisclosureLastPush(
      application.applicationSpecificData,
    );

    const submission = await this.submissionRepository.findOne({
      where: { applicationId },
    });

    if (!submission?.formData) {
      this.loggerService.log(
        'SdsDisclosurePreviewService.getSdsDisclosurePreview() no submission',
      );
      return {
        disclosure: { ...EMPTY_DISCLOSURE },
        siteId: application.siteId ?? null,
        lastPushedSiteId: lastPush?.siteId ?? null,
        lastPushedAt: lastPush?.lastPushedAt ?? null,
      };
    }

    const mapped = mapSdsToSiteDisclosure(submission.formData);

    this.loggerService.log(
      'SdsDisclosurePreviewService.getSdsDisclosurePreview() end',
    );

    return {
      disclosure: mapped,
      siteId: application.siteId ?? null,
      lastPushedSiteId: lastPush?.siteId ?? null,
      lastPushedAt: lastPush?.lastPushedAt ?? null,
    };
  }

  private isSdsApplication(application: Application): boolean {
    const abbrev = application.appType?.abbrev?.trim().toUpperCase();
    if (abbrev === SDS_APP_TYPE_ABBREV) {
      return true;
    }

    const description = application.appType?.description?.trim().toUpperCase();
    return description === SDS_APP_TYPE_DESCRIPTION.toUpperCase();
  }
}
