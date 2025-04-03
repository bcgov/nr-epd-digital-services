import { ApplicationService } from './application.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { Application } from '../../entities/application.entity';
import { AppTypeService } from '../appType/appType.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ApplicationService', () => {
  let applicationService: ApplicationService;
  let applicationRepository: Repository<Application>;
  let loggerService: LoggerService;
  let appTypeService: AppTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        {
          provide: AppTypeService,
          useValue: {
            getAppTypeByDescription: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Application), // ✅ Correctly mock Repository<Application>
          useClass: Repository,  // ✅ This ensures it's treated as a repository
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    applicationService = module.get<ApplicationService>(ApplicationService);
    appTypeService = module.get<AppTypeService>(AppTypeService);
    applicationRepository = module.get<Repository<Application>>(getRepositoryToken(Application)); // ✅ Correctly get repository
    loggerService = module.get<LoggerService>(LoggerService);
  });


  describe('createApplication', () => {
    it('should create an application successfully', async () => {
      const mockCreateApplication = {
        srsApplicationId: 12345,
        siteId: 67890,
        appType: 'CSR',
        receivedDate: new Date(),
      };

      const mockAppType = { id: 1 };
      const mockNewApplication = { id: 1 };

      appTypeService.getAppTypeByDescription = jest.fn().mockResolvedValue(mockAppType);
      applicationRepository.create = jest.fn().mockReturnValue(mockNewApplication);
      applicationRepository.save = jest.fn().mockResolvedValue(mockNewApplication);

      const result = await applicationService.createApplication(mockCreateApplication);

      expect(appTypeService.getAppTypeByDescription).toHaveBeenCalledWith('CSR');
      expect(applicationRepository.create).toHaveBeenCalled();
      expect(applicationRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ id: 1 });
    });
  });
});
