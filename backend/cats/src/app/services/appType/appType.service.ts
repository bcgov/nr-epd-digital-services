import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppType } from '../../entities/appType.entity';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class AppTypeService {
  constructor(
    @InjectRepository(AppType)
    private readonly appTypeRepository: Repository<AppType>,
    private readonly loggerService: LoggerService,
  ) { }

  async getAppTypeByDescription(appTypeDescription: string) {
    this.loggerService.log('AppTypeService.getAppTypeByDescription() start'); // Log the start of the method

    try {
      // Log the input parameters for better traceability
      this.loggerService.debug(
        `Fetching application type with description: ${appTypeDescription}`,
      );

      const appType = await this.appTypeRepository.findOne({
        where: { abbrev: appTypeDescription }
      });

      if (appType) {
        this.loggerService.log(
          `Application type found with ID: ${appType.id}`,
        );
        return {
          id: appType.id,
        };
      } else {
        this.loggerService.warn(
          '`Application type not found',
        );
        return null;
      }
    } catch (err) {
      // Log the error with the exception details
      this.loggerService.error(
        'Exception occurred in AppTypeService.getAppTypeByDescription()',
        JSON.stringify(err),
      );
      throw new HttpException('Failed to fetch application type', HttpStatus.BAD_REQUEST);
    } finally {
      // Log the end of the method
      this.loggerService.log('AppTypeService.getAppTypeByDescription() end');
    }
  }
}
