import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationSearchResolver } from './applicationSearch.resolver';
import { ApplicationSearchService } from '../../services/application/applicationSearch.service';
import { ApplicationSearchResult } from '../../dto/response/applicationSearchResponse';
import { ApplicationFilter } from '../../utilities/enums/applicationFilter.enum';
import { LoggerService } from '../../logger/logger.service';

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
      const filter = ApplicationFilter.ALL;
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
        searchParam,
        page,
        pageSize,
        filter,
      );

      expect(response).toStrictEqual(expectedResponse);
      expect(service.searchApplications).toHaveBeenCalledWith(
        searchParam,
        page,
        pageSize,
        filter,
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        `ApplicationSearchResolver: searchParam: ${searchParam}, page: ${page}, pageSize: ${pageSize}, filter: ${filter}.`,
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        `ApplicationSearchResolver: ${result.count} applications found.`,
      );
    });

    it('should log an error if searchApplications fails', async () => {
      const searchParam = 'test';
      const page = 1;
      const pageSize = 10;
      const filter = ApplicationFilter.ALL;
      const errorResult: ApplicationSearchResult = {
        error: 'Some error',
        applications: [],
        count: 0,
        page: 0,
        pageSize: 0,
      };

      jest.spyOn(service, 'searchApplications').mockResolvedValue(errorResult);

      const response = await resolver.searchApplications(
        searchParam,
        page,
        pageSize,
        filter,
      );

      expect(response.success).toBe(false);
      expect(response.message).toBe('Some error');
      expect(loggerService.error).toHaveBeenCalledWith(
        `ApplicationSearchResolver: searchApplications: Some error.`,
        null,
      );
    });
  });
});
