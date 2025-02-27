import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationSearchService } from './applicationSearch.service';
import { Application } from '../entities/application.entity';
import { LoggerService } from '../logger/logger.service';
import { ApplicationFilter } from '../dto/applicationFilter.enum';
import { ApplicationSearchResponse } from '../dto/reponse/applicationSearchResponse';

describe('ApplicationSearchService', () => {
  let service: ApplicationSearchService;
  let repository: Repository<Application>;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationSearchService,
        {
          provide: getRepositoryToken(Application),
          useClass: Repository,
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ApplicationSearchService>(ApplicationSearchService);
    repository = module.get<Repository<Application>>(
      getRepositoryToken(Application),
    );
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should search applications with given parameters', async () => {
    const searchParam = 'test';
    const page = 1;
    const pageSize = 10;
    const filter = ApplicationFilter.UNASSIGNED;

    const mockApplication = new Application();
    mockApplication.id = 1;
    mockApplication.siteId = 1;
    mockApplication.updatedDateTime = new Date();
    mockApplication.appParticipants = [];
    mockApplication.appPriorities = [];

    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockApplication], 1]),
    } as any);

    const result = await service.searchApplications(
      searchParam,
      page,
      pageSize,
      filter,
    );

    expect(result).toBeInstanceOf(ApplicationSearchResponse);
    expect(result.applications.length).toBe(1);
    expect(result.count).toBe(1);
    expect(loggerService.log).toHaveBeenCalledWith(
      `Searching applications with param: ${searchParam}, page: ${page}, pageSize: ${pageSize}, filter: ${filter}`,
    );
    expect(loggerService.log).toHaveBeenCalledWith(
      'Application search completed',
    );
  });

  it('should throw an error if search fails', async () => {
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockRejectedValue(new Error('Test error')),
    } as any);

    await expect(
      service.searchApplications('test', 1, 10, ApplicationFilter.UNASSIGNED),
    ).rejects.toThrow('Failed to search applications: Test error');
  });
});
