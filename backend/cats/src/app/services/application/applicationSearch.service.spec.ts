import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationSearchService } from './applicationSearch.service';
import { Application } from '../../entities/application.entity';
import { LoggerService } from '../../logger/logger.service';
import { Filter } from '../../utilities/enums/application/filter.enum';
import { ApplicationSearchResult } from '../../dto/response/applicationSearchResponse';
import { SortByField } from '../../utilities/enums/application/sortByField.enum';
import { SortByDirection } from '../../utilities/enums/application/sortByDirection.enum';

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
            error: jest.fn(),
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
    const filter = Filter.UNASSIGNED;
    const sortBy = SortByField.ID;
    const sortByDir = SortByDirection.ASC;

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
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockApplication], 1]),
    } as any);

    const result = await service.searchApplications(
      searchParam,
      page,
      pageSize,
      filter,
      sortBy,
      sortByDir,
    );

    expect(result).toBeInstanceOf(ApplicationSearchResult);
    expect(result.applications.length).toBe(1);
    expect(result.count).toBe(1);
    expect(loggerService.log).toHaveBeenNthCalledWith(
      1,
      `ApplicationSearchService: searchParam: ${searchParam}, page: ${page}, pageSize: ${pageSize}, filter: ${filter}, sortBy: ${sortBy}, sortByDir: ${sortByDir}.`,
    );
    expect(loggerService.log).toHaveBeenNthCalledWith(
      2,
      'ApplicationSearchService: 1 applications found.',
    );
  });

  it('should throw an error if search fails', async () => {
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      }),
    } as any);

    const result = await service.searchApplications(
      'test query',
      1,
      10,
      Filter.ALL,
      SortByField.ID,
      SortByDirection.ASC,
    );
    expect(result).toBeInstanceOf(ApplicationSearchResult);
    expect(result.error).toBe('Test error');
  });
});
