import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../../entities/application.entity';
import { ApplicationSite } from '../../entities/applicationSite.entity';
import { LinkedApplicationSiteDto } from '../../dto/application/linkApplicationSiteId.dto';
import { LoggerService } from '../../logger/logger.service';
import { SiteService } from '../site/site.service';

const SDS_APP_TYPE_ABBREV = 'SDS';
const SDS_APP_TYPE_DESCRIPTION = 'Site Disclosure Statement';
const NUMERIC_SITE_ID = /^\d+$/;
const MAX_STORABLE_SITE_ID = 2147483647;
const SYSTEM_ACTOR = 'SYSTEM';
const ACTOR_MAX_LENGTH = 20;

/**
 * Links an SDS application to a Site Registry site by its Site ID.
 *
 * Empty input unlinks. Otherwise the ID is validated locally, verified
 * against SITE through the service-account gateway, and only then persisted
 * as the application's primary site (mirroring the application/site join
 * rows). A SITE miss or failure never changes the stored Site ID, and SITE
 * records are never modified.
 */
@Injectable()
export class ApplicationSiteLinkService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(ApplicationSite)
    private readonly applicationSiteRepository: Repository<ApplicationSite>,
    private readonly siteService: SiteService,
    private readonly loggerService: LoggerService,
  ) {}

  async linkApplicationSiteId(
    applicationId: number,
    siteId: string | null,
    user?: any,
  ): Promise<LinkedApplicationSiteDto> {
    this.loggerService.log(
      'ApplicationSiteLinkService.linkApplicationSiteId() start',
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
        'Site linking is only available for Site Disclosure Statement applications',
      );
    }

    const normalized = (siteId ?? '').trim();
    const actor = this.resolveActor(user);

    if (!normalized) {
      await this.unlink(application, actor);
      this.loggerService.log(
        'ApplicationSiteLinkService.linkApplicationSiteId() unlinked',
      );
      return { siteId: null, siteAddress: null, siteCity: null };
    }

    const numericSiteId = this.parseSiteId(normalized);
    const site = await this.verifySiteExists(numericSiteId);

    await this.persistLink(application, numericSiteId, actor);

    this.loggerService.log(
      'ApplicationSiteLinkService.linkApplicationSiteId() linked',
    );

    return {
      siteId: numericSiteId,
      siteAddress: this.formatAddress(site),
      siteCity: site.city ?? null,
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

  private parseSiteId(value: string): number {
    if (!NUMERIC_SITE_ID.test(value)) {
      throw new BadRequestException('Site ID must be a number');
    }

    const numericSiteId = Number(value);
    if (
      !Number.isSafeInteger(numericSiteId) ||
      numericSiteId < 1 ||
      numericSiteId > MAX_STORABLE_SITE_ID
    ) {
      throw new BadRequestException(
        `Site ID must be a whole number between 1 and ${MAX_STORABLE_SITE_ID}`,
      );
    }

    return numericSiteId;
  }

  private async verifySiteExists(siteId: number) {
    let result: Awaited<ReturnType<SiteService['getSiteByIdForService']>>;

    try {
      result = await this.siteService.getSiteByIdForService(String(siteId));
    } catch (error) {
      this.loggerService.error(
        'ApplicationSiteLinkService.verifySiteExists() SITE lookup failed',
        error,
      );
      throw new InternalServerErrorException(
        'Unable to verify Site ID with Site Registry. Please try again.',
      );
    }

    const site = result?.findSiteBySiteIdForService?.data;
    if (!site) {
      throw new NotFoundException('Site ID was not found in Site Registry');
    }

    return site;
  }

  private async persistLink(
    application: Application,
    siteId: number,
    actor: string,
  ): Promise<void> {
    await this.applicationRepository.update(application.id, {
      siteId,
      updatedBy: actor,
      updatedDateTime: new Date(),
    });

    await this.applicationSiteRepository.delete({
      applicationId: application.id,
    });

    const applicationSite = this.applicationSiteRepository.create({
      applicationId: application.id,
      siteId,
      createdBy: actor,
      updatedBy: actor,
      createdDateTime: new Date(),
      updatedDateTime: new Date(),
    });
    await this.applicationSiteRepository.save(applicationSite);
  }

  private async unlink(application: Application, actor: string): Promise<void> {
    await this.applicationRepository.update(application.id, {
      siteId: null,
      updatedBy: actor,
      updatedDateTime: new Date(),
    });

    await this.applicationSiteRepository.delete({
      applicationId: application.id,
    });
  }

  private formatAddress(site: {
    addrLine_1?: string | null;
    addrLine_2?: string | null;
    addrLine_3?: string | null;
    addrLine_4?: string | null;
  }): string | null {
    const parts = [
      site.addrLine_1,
      site.addrLine_2,
      site.addrLine_3,
      site.addrLine_4,
    ]
      .map((line) => (line ?? '').trim())
      .filter(Boolean);

    return parts.length ? parts.join(' ') : null;
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
