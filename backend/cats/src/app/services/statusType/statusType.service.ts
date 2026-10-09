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
  ) {}

  async getStatusTypeByAbbrev(statusTypeAbbrev: string) {
    this.loggerService.log('StatusTypeService.getStatusTypeByAbbrev() start'); // Log the start of the method

    try {
      // Log the input parameters for better traceability
      this.loggerService.debug(
        `Fetching status type with abbrev: ${statusTypeAbbrev}`,
      );
      const statusType = await this.statusTypeRepository.findOne({
        where: { abbrev: statusTypeAbbrev },
      });

      if (statusType) {
        this.loggerService.log(`Status type found with ID: ${statusType.id}`);
        return {
          id: statusType.id,
        };
      } else {
        this.loggerService.warn('Status type not found');
        return null;
      }
    } catch (err) {
      // Log the error with the exception details
      this.loggerService.error(
        'Exception occurred in StatusTypeService.getStatusTypeByAbbrev()',
        JSON.stringify(err),
      );
      throw new HttpException(
        'Failed to fetch status type',
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      // Log the end of the method
      this.loggerService.log('StatusTypeService.getStatusTypeByAbbrev() end');
    }
  }

  async getStatusTypeById(statusTypeId: number) {
    this.loggerService.log('StatusTypeService.getStatusTypeById() start');

    try {
      this.loggerService.debug(`Fetching status type with ID: ${statusTypeId}`);
      // Only active statuses can be assigned via the status dropdown/API.
      const statusType = await this.statusTypeRepository.findOne({
        where: { id: statusTypeId, isActive: true },
      });

      if (statusType) {
        this.loggerService.log(`Status type found with ID: ${statusType.id}`);
        return this.toStatusTypeDto(statusType);
      }

      this.loggerService.warn('Status type not found');
      return null;
    } catch (err) {
      this.loggerService.error(
        'Exception occurred in StatusTypeService.getStatusTypeById()',
        JSON.stringify(err),
      );
      throw new HttpException(
        'Failed to fetch status type',
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      this.loggerService.log('StatusTypeService.getStatusTypeById() end');
    }
  }

  /** Lookup by id regardless of is_active — for audit/history/email labels. */
  async getStatusTypeByIdAny(statusTypeId: number) {
    const statusType = await this.statusTypeRepository.findOne({
      where: { id: statusTypeId },
    });

    if (!statusType) {
      return null;
    }

    return {
      ...this.toStatusTypeDto(statusType),
      isActive: statusType.isActive,
    };
  }

  async getAllStatusTypes() {
    this.loggerService.log('StatusTypeService.getAllStatusTypes() start');

    try {
      // Curated dropdown list: active statuses only, in product display order.
      const statusTypes = await this.statusTypeRepository.find({
        where: { isActive: true },
        order: {
          displayOrder: 'ASC',
          description: 'ASC',
        },
      });

      this.loggerService.log(`Found ${statusTypes.length} status types`);

      return statusTypes.map((status) => this.toStatusTypeDto(status));
    } catch (err) {
      this.loggerService.error(
        'Exception occurred in StatusTypeService.getAllStatusTypes()',
        JSON.stringify(err),
      );
      throw new HttpException(
        'Failed to fetch status types',
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      this.loggerService.log('StatusTypeService.getAllStatusTypes() end');
    }
  }

  /**
   * Distinct client-facing status steps for the submitter email tracker,
   * ordered by external_display_order. Callers filter to assigned steps
   * (history + current) because application paths are non-linear.
   */
  async getExternalStatusTrackerSteps(): Promise<
    Array<{ id: number; description: string; displayOrder: number }>
  > {
    this.loggerService.log(
      'StatusTypeService.getExternalStatusTrackerSteps() start',
    );

    try {
      const statusTypes = await this.statusTypeRepository.find({
        where: { isActive: true },
        order: {
          externalDisplayOrder: 'ASC',
          displayOrder: 'ASC',
        },
      });

      const seenOrders = new Set<number>();
      const steps: Array<{
        id: number;
        description: string;
        displayOrder: number;
      }> = [];

      for (const status of statusTypes) {
        const order = status.externalDisplayOrder;
        const description = status.externalDescription?.trim();
        if (order == null || !description || seenOrders.has(order)) {
          continue;
        }
        seenOrders.add(order);
        steps.push({
          id: status.id,
          description,
          displayOrder: order,
        });
      }

      this.loggerService.log(`Found ${steps.length} external tracker steps`);
      return steps;
    } catch (err) {
      this.loggerService.error(
        'Exception occurred in StatusTypeService.getExternalStatusTrackerSteps()',
        JSON.stringify(err),
      );
      throw new HttpException(
        'Failed to fetch external status tracker steps',
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      this.loggerService.log(
        'StatusTypeService.getExternalStatusTrackerSteps() end',
      );
    }
  }

  private toStatusTypeDto(statusType: StatusType) {
    return {
      id: statusType.id,
      abbrev: statusType.abbrev,
      description: statusType.description,
      displayOrder: statusType.displayOrder,
      externalDescription: statusType.externalDescription,
      externalDisplayOrder: statusType.externalDisplayOrder,
    };
  }
}
