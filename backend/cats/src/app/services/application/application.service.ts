import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { Application } from '../../entities/application.entity';
import { CreateApplication } from '../../dto/application/createApplication.dto';
import { ViewApplicationDetails } from '../../dto/application/viewApplicationDetails.dto';
import { AppTypeService } from '../appType/appType.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { AppStatus } from '../../entities/appStatus.entity';
import { StatusTypeService } from '../statusType/statusType.service';
import { UpdateApplicationStatusDto } from '../../dto/application/updateApplicationStatus.dto';
import { ApplicationSite } from '../../entities/applicationSite.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(AppStatus)
    private readonly appStatusRepository: Repository<AppStatus>,
    @InjectRepository(ApplicationSite)
    private readonly applicationSiteRepository: Repository<ApplicationSite>,
    private readonly loggerService: LoggerService,
    private readonly appTypeService: AppTypeService,
    private readonly dashboardService: DashboardService,
    private readonly statusTypeService: StatusTypeService,
  ) { }

  // this method will be called from formsflow when an application is submitted
  async createApplication(createApplication: CreateApplication) {
    this.loggerService.log('ApplicationService.createApplication() start'); // Log the start of the method

    try {
      // Log the input parameters for better traceability
      this.loggerService.debug(
        `Attempting to create a new application with SRS form id: ${createApplication?.applicationStatus[0].formId} ' and submission id: ${createApplication?.applicationStatus[0].formId}`,
      );

      const { applicationStatus, appTypeAbbrev, siteIds, receivedDate } = createApplication;

      const appType = await this.appTypeService.getAppTypeByAbbrev(appTypeAbbrev);

      const newApplication = this.applicationRepository.create({
        siteId: createApplication.siteIds[0],// in case the application has mutliple site, we store the first site id for consistency
        appTypeId: appType?.id,
        isMultiSite: siteIds.length == 0 ? false : true,
        rowVersionCount: 1,
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
        createdDateTime: new Date(),
        updatedDateTime: new Date(),
        receivedDate: receivedDate.toISOString(),
      });

      // Save the new application
      const savedApplication = await this.applicationRepository.save(newApplication);

      // Insert siteIds into application_site table (assuming you have such a repository/service)
      if (Array.isArray(siteIds) && siteIds.length > 0) {
        const applicationSiteEntities = siteIds.map(siteId => this.applicationSiteRepository.create({
          applicationId: savedApplication.id,
          siteId: siteId,
          createdBy: 'SYSTEM',
          updatedBy: 'SYSTEM',
          createdDateTime: new Date(),
          updatedDateTime: new Date(),
        }));

        await this.applicationSiteRepository.save(applicationSiteEntities);
      }

      // Resolve each statusTypeId from statusTypeAbbrev
      const appStatuses = await Promise.all(
        applicationStatus.map(async (statusDto) => {
          const statusType = await this.statusTypeService.getStatusTypeByAbbrev(statusDto.statusTypeAbbrev);
          return this.appStatusRepository.create({
            application: savedApplication,
            isCurrent: statusDto.isCurrent,
            formId: statusDto.formId,
            submissionId: statusDto.submissionId,
            statusTypeId: statusType.id,
            comment: '',
            rowVersionCount: 1,
            ts: Buffer.from(new Date().toISOString()),
            createdBy: 'SYSTEM',
            updatedBy: 'SYSTEM',
            createdDateTime: new Date(),
            updatedDateTime: new Date(),
          });
        }),
      );


      // Save all appStatuses
      await this.appStatusRepository.save(appStatuses);

      if (savedApplication) {
        this.loggerService.log(
          `Application created successfully with ID: ${savedApplication.id}`,
        );
        return {
          id: savedApplication.id,
        };
      } else {
        this.loggerService.warn(
          'Application creation failed, no data returned from save operation',
        );
        return null;
      }
    } catch (err) {
      // Log the error with the exception details
      this.loggerService.error(
        'Exception occurred in ApplicationService.createApplication()',
        JSON.stringify(err),
      );
      throw new HttpException(
        'Failed to create application',
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      // Log the end of the method
      this.loggerService.log('ApplicationService.createApplication() end');
    }
  }

  // this method will be called from formsflow after an application is submitted to update the formsflow app id
  async updateFormsflowAppId(appStatusInput: UpdateApplicationStatusDto) {
    this.loggerService.log('ApplicationService.updateFormsflowAppId() start'); // Log the start of the method

    try {
      const { formId, submissionId, formsflowAppId, statusTypeAbbrev, siteIds } = appStatusInput;

      let appStatus = await this.appStatusRepository.findOne({
        where: { formId, submissionId },
      });

      console.log('statusTypeAbbrev---', statusTypeAbbrev);
      const statusType = await this.statusTypeService.getStatusTypeByAbbrev(statusTypeAbbrev);
      let applicationId: number;

      if (!appStatus) {

        const existingAppStatus = await this.appStatusRepository.findOne({
          where: { formsflowAppId },
        });

        applicationId = existingAppStatus?.applicationId;

        appStatus = this.appStatusRepository.create({
          applicationId,
          formId,
          submissionId,
          formsflowAppId,
          statusTypeId: statusType.id,
          isCurrent: true,
          rowVersionCount: 1,
          ts: Buffer.from(new Date().toISOString()),
          createdBy: 'SYSTEM',
          createdDateTime: new Date(),
          updatedBy: 'SYSTEM',
          updatedDateTime: new Date(),
        });

        appStatus = await this.appStatusRepository.save(appStatus);
      } else {

        appStatus.formsflowAppId = formsflowAppId;
        appStatus.updatedBy = 'SYSTEM';
        appStatus.updatedDateTime = new Date();
        appStatus.isCurrent = true;
        appStatus.statusTypeId = statusType.id;

        await this.appStatusRepository.save(appStatus);
        applicationId = appStatus.applicationId;
      }

      // Set isCurrent as false for all other entries with the same formsflowAppId but different formId/submissionId
      await this.appStatusRepository
        .createQueryBuilder()
        .update()
        .set({ isCurrent: false })
        .where('formsflowAppId = :formsflowAppId', { formsflowAppId })
        .andWhere('NOT (formId = :formId AND submissionId = :submissionId)', { formId, submissionId })
        .execute();

      // Update application_site table if siteIds are provided
      if (siteIds && siteIds.length > 0 && applicationId) {
        // Remove existing mappings
        await this.applicationSiteRepository.delete({ applicationId });

        // Insert new mappings
        const applicationSites = siteIds.map(siteId =>
          this.applicationSiteRepository.create({
            applicationId,
            siteId,
            createdBy: 'SYSTEM',
            updatedBy: 'SYSTEM',
            createdDateTime: new Date(),
            updatedDateTime: new Date(),
          })
        );

        await this.applicationSiteRepository.save(applicationSites);
      }

      // Log success
      this.loggerService.log(`App Status successfully with Formsflow App ID: ${formsflowAppId}`);

      return { success: true, message: `Updated successfully for id=${appStatus.id}`, formsflowAppId: formsflowAppId };
    } catch (err) {
      // Log the error with the exception details
      this.loggerService.error(
        'Exception occurred in ApplicationService.updateFormsflowAppId()',
        JSON.stringify(err),
      );
      throw new HttpException(
        'Failed to update  Formsflow App ID',
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      // Log the end of the method
      this.loggerService.log('ApplicationService.updateFormsflowAppId() end');
    }
  }


  async findApplicationDetailsById(
    id: number,
    userInfo: any
  ): Promise<ViewApplicationDetails> {
    this.loggerService.log(
      'ApplicationService.findApplicationDetailsById() start',
    );

    try {
      this.loggerService.debug(`Fetching application details for ID: ${id}`);

      const application = await this.applicationRepository.findOne({
        where: { id },
        relations: [
          'appType',
          'outcome',
          'reviewProcess',
          'siteType',
          'site',
          'appStatuses',
          'appStatuses.statusType',
          'appPriorities',
          'appPriorities.priority',
          'housingApplicationXrefs',
          'appParticipants',
          'appParticipants.organization',
        ],
      });

      if (!application) {
        this.loggerService.warn(`No application found with ID: ${id}`);
        return null;
      }

      const currentPriority = application.appPriorities?.find(
        (ap) => ap.isCurrent,
      )?.priority;

      const queuedStatus = application.appStatuses?.find(
        (status) => status.statusType.abbrev === 'QUE',
      );

      const currentStatus = application.appStatuses?.find(
        (status) => status.isCurrent,
      );

      const isTaxExempt =
        application.appParticipants?.some(
          (participant) =>
            participant.isMainParticipant &&
            participant.organization.isTaxExempt,
        ) ?? false;

      this.loggerService.log(
        `Application details fetched successfully for ID: ${id}`,
      );

      await this.dashboardService.createRecentViewedApplication(application, userInfo);
      return {
        id: application.id,
        siteId: application.siteId,
        siteAddress: application.site.address,
        siteCity: application.site.city,
        formId: application.appStatuses?.find((status) => status.isCurrent)?.formId,
        submissionId: application?.appStatuses?.find((status) => status.isCurrent)?.submissionId,
        csapRefNumber: application.csapRefNumber,
        receivedDate: new Date(application.receivedDate),
        endDate: application.endDate ? new Date(application.endDate) : null,
        queuedDate: queuedStatus?.createdDateTime
          ? new Date(queuedStatus.createdDateTime)
          : null,
        outcome: application.outcome,
        appType: application.appType,
        currentStatus: currentStatus?.statusType,
        siteType: application.siteType,
        reviewProcess: application.reviewProcess,
        priority: currentPriority || null,
        isHousing: application.housingApplicationXrefs?.length > 0,
        isTaxExempt: isTaxExempt,
      };
    } catch (err) {
      this.loggerService.error(
        'Exception occurred in ApplicationService.findApplicationDetailsById()',
        JSON.stringify(err),
      );
      throw new HttpException(
        'Failed to fetch application details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.loggerService.log(
        'ApplicationService.findApplicationDetailsById() end',
      );
    }
  }
}
