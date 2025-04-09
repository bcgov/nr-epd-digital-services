import { AppTypeService } from './appType.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { AppType } from '../../entities/appType.entity';

describe('AppTypeService', () => {
  let service: AppTypeService;
  let repository: Repository<AppType>;
  let loggerService: LoggerService;

  beforeEach(() => {
    repository = {
      findOne: jest.fn(),
      findBy: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    } as unknown as Repository<AppType>;
    loggerService = {
      log: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as LoggerService;

    service = new AppTypeService(repository, loggerService);
  });

  describe('getAppTypeByDescription', () => {
    it('should fetch app type successfully for valid abbrev', async () => {
      const appTypeAbbrev = 'CSR';
      const mockAppType = { id: 1 };
      repository.findOne = jest.fn().mockResolvedValue(mockAppType);

      const result = await service.getAppTypeByAbbrev(appTypeAbbrev);
      expect(result).toEqual({ id: 1, });
    });

    it('should return empty array if no app type found', async () => {
      const appTypeAbbrev = 'TEST';
      repository.findOne = jest.fn().mockResolvedValue([]);

      const result = await service.getAppTypeByAbbrev(appTypeAbbrev);
      expect(result).toEqual({ "id": undefined });
    });
  });
});
