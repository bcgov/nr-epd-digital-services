import { ApplicationService } from './application.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { Application } from '../../entities/application.entity';

describe('ApplicationService', () => {
  let service: ApplicationService;
  let repository: Repository<Application>;
  let loggerService: LoggerService;

  beforeEach(() => {
    repository = {
      findOne: jest.fn(),
      findBy: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    } as unknown as Repository<Application>;
    loggerService = {
      log: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as LoggerService;

    service = new ApplicationService(repository, loggerService);
  });


  describe('createApplication', () => {
    it('should create an application', async () => {
      const createApplication = {
        applicationId: 1,
        srsApplicationId: 11,
        siteId: 123,
        appTypeId: 2,
        receivedDate: new Date()
      };

      // Mock repository methods with the correct types
      const savedApplication = {
        id: 1,
      };

      jest.spyOn(repository, 'create').mockReturnValue(savedApplication as any);
      jest.spyOn(repository, 'save').mockResolvedValue(savedApplication as any);

      const result = await service.createApplication(createApplication);

      expect(result).toBeDefined();
      expect(result.id).toBe(savedApplication.id);
    });
  });
});
