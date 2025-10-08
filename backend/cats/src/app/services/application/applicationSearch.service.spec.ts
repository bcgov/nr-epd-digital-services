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
      null,
    );

    expect(result).toBeInstanceOf(ApplicationSearchResult);
    expect(result.applications.length).toBe(1);
    expect(result.count).toBe(1);
    expect(loggerService.log).toHaveBeenNthCalledWith(
      1,
      `ApplicationSearchService: searchParam: ${searchParam}, page: ${page}, pageSize: ${pageSize}, filter: ${filter}, sortBy: ${sortBy}, sortByDir: ${sortByDir}.`,
    );
    expect(loggerService.log).toHaveBeenNthCalledWith(
      3,
      'ApplicationSearchService: 1 applications found.',
    );
  });

  it('should filter applications by MY_ASSIGNED filter with user email', async () => {
    const searchParam = 'test';
    const page = 1;
    const pageSize = 10;
    const filter = Filter.MY_ASSIGNED;
    const sortBy = SortByField.ID;
    const sortByDir = SortByDirection.ASC;
    const user = { email: 'test@example.com' };

    const mockApplication = new Application();
    mockApplication.id = 1;
    mockApplication.siteId = 1;
    mockApplication.updatedDateTime = new Date();
    mockApplication.appParticipants = [];
    mockApplication.appPriorities = [];

    const queryBuilderMock = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockApplication], 1]),
    };

    jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValue(queryBuilderMock as any);

    const result = await service.searchApplications(
      searchParam,
      page,
      pageSize,
      filter,
      sortBy,
      sortByDir,
      user,
    );

    expect(result).toBeInstanceOf(ApplicationSearchResult);
    expect(result.applications.length).toBe(1);
    expect(result.count).toBe(1);

    // Verify that the user email filter was applied
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'person.email = :email',
      { email: 'test@example.com' },
    );

    // Verify the user email log was called
    expect(loggerService.log).toHaveBeenNthCalledWith(
      2,
      'ApplicationSearchService: Logged in user email: test@example.com.',
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
      null,
    );
    expect(result).toBeInstanceOf(ApplicationSearchResult);
    expect(result.error).toBe('Test error');
  });

  describe('searchApplicationsById', () => {
    it('should search applications by ID with default pagination', async () => {
      const applicationId = '123';
      const mockApplication = new Application();
      mockApplication.id = 123;
      mockApplication.siteId = 1;
      mockApplication.updatedDateTime = new Date();
      mockApplication.appParticipants = [];
      mockApplication.appPriorities = [];

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockApplication]),
      } as any);

      const result = await service.searchApplicationsById(applicationId);

      expect(result).toBeInstanceOf(ApplicationSearchResult);
      expect(result.applications.length).toBe(1);
      expect(result.applications[0].id).toBe('123');
    });

    it('should search applications by ID with custom pagination', async () => {
      const applicationId = '123';
      const page = 2;
      const pageSize = 5;
      const mockApplication = new Application();
      mockApplication.id = 123;
      mockApplication.siteId = 1;
      mockApplication.updatedDateTime = new Date();
      mockApplication.appParticipants = [];
      mockApplication.appPriorities = [];

      const queryBuilderMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockApplication]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      const result = await service.searchApplicationsById(
        applicationId,
        page,
        pageSize,
      );

      expect(result).toBeInstanceOf(ApplicationSearchResult);
      expect(queryBuilderMock.skip).toHaveBeenCalledWith((page - 1) * pageSize);
      expect(queryBuilderMock.take).toHaveBeenCalledWith(pageSize);
    });

    it('should return empty result when no applications found', async () => {
      const applicationId = '999';

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      } as any);

      const result = await service.searchApplicationsById(applicationId);

      expect(result).toBeInstanceOf(ApplicationSearchResult);
      expect(result.applications).toHaveLength(0);
    });
  });
});
