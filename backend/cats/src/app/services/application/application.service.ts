import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppParticipant } from '../../entities/appParticipant.entity';
import { LoggerService } from '../../logger/logger.service';
import { Application } from '../../entities/application.entity';
import { CreateApplication } from '../../dto/application/createApplication.dto';
import { ViewApplicationDetails } from '../../dto/application/viewApplicationDetails.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly loggerService: LoggerService,
  ) {}

  async createApplication(createApplication: CreateApplication) {
    this.loggerService.log('ApplicationService.createApplication() start'); // Log the start of the method

    try {
      // Log the input parameters for better traceability
      this.loggerService.debug(
        `Attempting to create application with srs app id: ${createApplication?.srsApplicationId}`,
      );

      const newApplication = await this.applicationRepository.create({
        siteId: createApplication.siteId,
        srsApplicationId: createApplication.srsApplicationId,
        appTypeId: createApplication.appTypeId,
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
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: [
        'appType',
        'outcome',
        'reviewProcess',
        'siteType',
        'appStatuses',
        'appStatuses.statusType',
        'appPriorities',
        'appPriorities.priority',
        'housingApplicationXrefs',
      ],
    });

    if (!application) {
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

    return {
      id: application.id,
      csapRefNumber: application.csapRefNumber,
      receivedDate: new Date(application.receivedDate),
      endDate: application.endDate ? new Date(application.endDate) : null,
      queuedDate: queuedStatus?.createdDateTime,
      outcome: application.outcome,
      appType: application.appType,
      currentStatus: currentStatus?.statusType,
      siteType: application.siteType,
      reviewProcess: application.reviewProcess,
      priority: currentPriority || null,

      // TODO
      isHousing: application.housingApplicationXrefs?.length > 0, // TODO: Making an assumption here. Needs to be confirmed.
      isTaxExempt: false, // TODO: Confirm where this should be coming from.
    };
  }
}
