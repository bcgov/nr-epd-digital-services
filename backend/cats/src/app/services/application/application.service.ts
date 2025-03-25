import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppParticipant } from '../../entities/appParticipant.entity';
import { LoggerService } from '../../logger/logger.service';
import { Application } from '../../entities/application.entity';
import { CreateApplication } from '../../dto/application/createApplication.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly loggerService: LoggerService,
  ) { }

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
        receivedDate: createApplication.receivedDate.toISOString()
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
      throw new HttpException('Failed to create application', HttpStatus.BAD_REQUEST);
    } finally {
      // Log the end of the method
      this.loggerService.log('ApplicationService.createApplication() end');
    }
  }
}
