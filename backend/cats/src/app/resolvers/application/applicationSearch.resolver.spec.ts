import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationSearchResolver } from './applicationSearch.resolver';
import { ApplicationSearchService } from '../../services/application/applicationSearch.service';
import { ApplicationSearchResult } from '../../dto/response/applicationSearchResponse';
import { Filter } from '../../utilities/enums/application/filter.enum';
import { LoggerService } from '../../logger/logger.service';
import { SortByDirection } from '../../utilities/enums/application/sortByDirection.enum';
import { SortByField } from '../../utilities/enums/application/sortByField.enum';

describe('ApplicationSearchResolver', () => {
  let resolver: ApplicationSearchResolver;
  let service: ApplicationSearchService;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationSearchResolver,
        {
          provide: ApplicationSearchService,
          useValue: {
            searchApplications: jest.fn(),
            searchApplicationsById: jest.fn(),
          },
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

    resolver = module.get<ApplicationSearchResolver>(ApplicationSearchResolver);
    service = module.get<ApplicationSearchService>(ApplicationSearchService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  describe('searchApplications', () => {
    it('should return ApplicationSearchResponse', async () => {
      const searchParam = 'test';
      const page = 1;
      const pageSize = 10;
      const filter = Filter.ALL;
      const sortBy = SortByField.ID;
      const sortByDir = SortByDirection.ASC;
      const result: ApplicationSearchResult = {
        applications: [],
        count: 4,
        page: 1,
        pageSize: 10,
      };
      const expectedResponse = {
        applications: [],
        count: 4,
        httpStatusCode: 200,
        message: '',
        page: 1,
        pageSize: 10,
        success: true,
        timestamp: expect.any(String),
      };

      jest.spyOn(service, 'searchApplications').mockResolvedValue(result);

      const response = await resolver.searchApplications(
        null,
        searchParam,
        page,
        pageSize,
        filter,
        sortBy,
        sortByDir,
      );

      expect(response).toStrictEqual(expectedResponse);
      expect(service.searchApplications).toHaveBeenCalledWith(
        searchParam,
        page,
        pageSize,
        filter,
        sortBy,
        sortByDir,
        null,
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        `ApplicationSearchResolver: searchParam: ${searchParam}, page: ${page}, pageSize: ${pageSize}, filter: ${filter}, sortBy: ${sortBy}, sortByDir: ${sortByDir}.`,
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        `ApplicationSearchResolver: ${result.count} applications found.`,
      );
    });

    it('should log an error if searchApplications fails', async () => {
      const searchParam = 'test';
      const page = 1;
      const pageSize = 10;
      const filter = Filter.ALL;
      const sortBy = SortByField.ID;
      const sortByDir = SortByDirection.ASC;
      const errorResult: ApplicationSearchResult = {
        error: 'Some error',
        applications: [],
        count: 0,
        page: 0,
        pageSize: 0,
      };

      jest.spyOn(service, 'searchApplications').mockResolvedValue(errorResult);

      const response = await resolver.searchApplications(
        null,
        searchParam,
        page,
        pageSize,
        filter,
        sortBy,
        sortByDir,
      );

      expect(response.success).toBe(false);
      expect(response.message).toBe('Some error');
      expect(loggerService.error).toHaveBeenCalledWith(
        `ApplicationSearchResolver: searchApplications: Some error.`,
        null,
      );
    });
  });

  describe('searchApplicationsById', () => {
    it('should return ApplicationSearchResponse', async () => {
      const query = '12345';
      const result: ApplicationSearchResult = {
        applications: [],
        count: 1,
        page: 1,
        pageSize: 10,
      };
      const expectedResponse = {
        applications: [],
        count: 1,
        httpStatusCode: 200,
        message: '',
        page: 1,
        pageSize: 10,
        success: true,
        timestamp: expect.any(String),
      };

      jest.spyOn(service, 'searchApplicationsById').mockResolvedValue(result);

      const response = await resolver.searchApplicationsById(query);

      expect(response).toStrictEqual(expectedResponse);
      expect(service.searchApplicationsById).toHaveBeenCalledWith(query);
    });

    it('should log an error if searchApplicationsById fails', async () => {
      const query = '12345';
      const errorResult: ApplicationSearchResult = {
        error: 'Application not found',
        applications: [],
        count: 0,
        page: 0,
        pageSize: 0,
      };

      jest
        .spyOn(service, 'searchApplicationsById')
        .mockResolvedValue(errorResult);

      const response = await resolver.searchApplicationsById(query);

      expect(response).toStrictEqual({
        applications: [],
        count: 0,
        httpStatusCode: 200,
        message: '',
        page: 0,
        pageSize: 0,
        success: true,
        timestamp: expect.any(String),
      });
      expect(loggerService.error).toHaveBeenCalledWith(
        'ApplicationSearchResolver.searchApplicationsById: Application not found.',
        null,
      );
    });
  });
});
