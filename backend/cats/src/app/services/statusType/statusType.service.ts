import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusType } from '../../entities/statusType.entity';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class StatusTypeService {
  constructor(
    @InjectRepository(StatusType)
    private readonly statusTypeRepository: Repository<StatusType>,
    private readonly loggerService: LoggerService,
  ) { }

  async getStatusTypeByAbbrev(statusTypeAbbrev: string) {
    this.loggerService.log('StatusTypeService.getStatusTypeByAbbrev() start'); // Log the start of the method

    try {
      // Log the input parameters for better traceability
      this.loggerService.debug(
        `Fetching status type with abbrev: ${statusTypeAbbrev}`,
      );

      const statusType = await this.statusTypeRepository.findOne({
        where: { abbrev: statusTypeAbbrev }
      });

      if (statusType) {
        this.loggerService.log(
          `Status type found with ID: ${statusType.id}`,
        );
        return {
          id: statusType.id,
        };
      } else {
        this.loggerService.warn(
          'Status type not found',
        );
        return null;
      }
    } catch (err) {
      // Log the error with the exception details
      this.loggerService.error(
        'Exception occurred in StatusTypeService.getStatusTypeByAbbrev()',
        JSON.stringify(err),
      );
      throw new HttpException('Failed to fetch status type', HttpStatus.BAD_REQUEST);
    } finally {
      // Log the end of the method
      this.loggerService.log('StatusTypeService.getStatusTypeByAbbrev() end');
    }
  }
}
