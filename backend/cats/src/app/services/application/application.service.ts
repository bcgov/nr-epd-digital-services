import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { Application } from '../../entities/application.entity';
import { CreateApplication } from '../../dto/application/createApplication.dto';
import { ViewApplicationDetails } from '../../dto/application/viewApplicationDetails.dto';
import { AppTypeService } from '../appType/appType.service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly loggerService: LoggerService,
    private readonly appTypeService: AppTypeService,
  ) { }

  async createApplication(createApplication: CreateApplication) {
    this.loggerService.log('ApplicationService.createApplication() start'); // Log the start of the method

    try {
      // Log the input parameters for better traceability
      this.loggerService.debug(
        `Attempting to create application with SRS form id: ${createApplication?.formId} ' and submission id: ${createApplication?.formId}`,
      );

      const appType = await this.appTypeService.getAppTypeByAbbrev(
        createApplication.appTypeAbbrev,
      );

      const newApplication = await this.applicationRepository.create({
        siteId: createApplication.siteId,
        formId: createApplication.formId,
        submissionId: createApplication.submissionId,
        appTypeId: appType?.id,
        rowVersionCount: 1,
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
        createdDateTime: new Date(),
        updatedDateTime: new Date(),
        receivedDate: createApplication.receivedDate.toISOString(),
      });

      // Save the new application
      const savedApplication = await this.applicationRepository.save(
        newApplication,
      );

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

  async findApplicationDetailsById(
    id: number,
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

      return {
        id: application.id,
        siteId: application.siteId,
        siteAddress: application.site.address,
        siteCity: application.site.city,
        formId: application.formId,
        submissionId: application.submissionId,
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
