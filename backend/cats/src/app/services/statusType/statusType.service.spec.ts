import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { StatusType } from '../../entities/statusType.entity';
import { LoggerService } from '../../logger/logger.service';
import { StatusTypeService } from './statusType.service';

describe('StatusTypeService', () => {
  let service: StatusTypeService;
  let repository: Repository<StatusType>;
  let loggerService: LoggerService;

  beforeEach(() => {
    repository = {
      findOne: jest.fn(),
      find: jest.fn(),
    } as unknown as Repository<StatusType>;
    loggerService = {
      log: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as LoggerService;

    service = new StatusTypeService(repository, loggerService);
  });

  describe('getAllStatusTypes', () => {
    it('should return only active status types ordered by display order', async () => {
      const mockStatusTypes = [
        {
          id: 1,
          abbrev: 'Received',
          description: 'Received',
          isActive: true,
          displayOrder: 1,
          externalDescription: 'Submitted',
          externalDisplayOrder: 1,
        },
        {
          id: 18,
          abbrev: 'QUE',
          description: 'Queued',
          isActive: true,
          displayOrder: 2,
          externalDescription: 'Accepted',
          externalDisplayOrder: 2,
        },
      ];
      repository.find = jest.fn().mockResolvedValue(mockStatusTypes);

      const result = await service.getAllStatusTypes();

      expect(repository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        order: {
          displayOrder: 'ASC',
          description: 'ASC',
        },
      });
      expect(result).toEqual([
        {
          id: 1,
          abbrev: 'Received',
          description: 'Received',
          displayOrder: 1,
          externalDescription: 'Submitted',
          externalDisplayOrder: 1,
        },
        {
          id: 18,
          abbrev: 'QUE',
          description: 'Queued',
          displayOrder: 2,
          externalDescription: 'Accepted',
          externalDisplayOrder: 2,
        },
      ]);
    });

    it('should throw when repository find fails', async () => {
      repository.find = jest.fn().mockRejectedValue(new Error('db error'));

      await expect(service.getAllStatusTypes()).rejects.toThrow(
        new HttpException(
          'Failed to fetch status types',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('getExternalStatusTrackerSteps', () => {
    it('should return distinct external steps ordered by external display order', async () => {
      repository.find = jest.fn().mockResolvedValue([
        {
          id: 1,
          abbrev: 'Received',
          description: 'Received',
          externalDescription: 'Submitted',
          externalDisplayOrder: 1,
        },
        {
          id: 2,
          abbrev: 'QUE',
          description: 'Queued',
          externalDescription: 'Accepted',
          externalDisplayOrder: 2,
        },
        {
          id: 6,
          abbrev: 'TBA',
          description: 'To be Assigned',
          externalDescription: 'Accepted',
          externalDisplayOrder: 2,
        },
        {
          id: 7,
          abbrev: 'IP-CW',
          description: 'Review in Progress: Caseworker',
          externalDescription: 'Review',
          externalDisplayOrder: 5,
        },
      ]);

      const result = await service.getExternalStatusTrackerSteps();

      expect(repository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        order: {
          externalDisplayOrder: 'ASC',
          displayOrder: 'ASC',
        },
      });
      expect(result).toEqual([
        { id: 1, description: 'Submitted', displayOrder: 1 },
        { id: 2, description: 'Accepted', displayOrder: 2 },
        { id: 7, description: 'Review', displayOrder: 5 },
      ]);
    });
  });

  describe('getStatusTypeById', () => {
    it('should return an active status type by id', async () => {
      repository.findOne = jest.fn().mockResolvedValue({
        id: 7,
        isActive: true,
        abbrev: 'TBA',
        description: 'To be Assigned',
        displayOrder: 6,
        externalDescription: 'Accepted',
        externalDisplayOrder: 2,
      });

      const result = await service.getStatusTypeById(7);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 7, isActive: true },
      });
      expect(result).toEqual({
        id: 7,
        abbrev: 'TBA',
        description: 'To be Assigned',
        displayOrder: 6,
        externalDescription: 'Accepted',
        externalDisplayOrder: 2,
      });
    });

    it('should return null when status type is missing or inactive', async () => {
      repository.findOne = jest.fn().mockResolvedValue(null);

      const result = await service.getStatusTypeById(4);

      expect(result).toBeNull();
    });
  });
});
