import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationSearchResolver } from './applicationSearch.resolver';
import { ApplicationSearchService } from '../services/applicationSearch.service';
import { ApplicationSearchResponse } from '../dto/response/applicationSearchResponse';
import { ApplicationFilter } from '../utilities/enums/applicationFilter.enum';

describe('ApplicationSearchResolver', () => {
  let resolver: ApplicationSearchResolver;
  let service: ApplicationSearchService;

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
      ],
    }).compile();

    resolver = module.get<ApplicationSearchResolver>(ApplicationSearchResolver);
    service = module.get<ApplicationSearchService>(ApplicationSearchService);
  });

  describe('searchApplications', () => {
    it('should return ApplicationSearchResponse', async () => {
      const searchParam = 'test';
      const page = 1;
      const pageSize = 10;
      const filter = ApplicationFilter.ALL;
      const result: ApplicationSearchResponse = {
        applications: [],
        count: 0,
        page: 1,
        pageSize: 10,
      };

      jest.spyOn(service, 'searchApplications').mockResolvedValue(result);

      expect(
        await resolver.searchApplications(searchParam, page, pageSize, filter),
      ).toBe(result);
      expect(service.searchApplications).toHaveBeenCalledWith(
        searchParam,
        page,
        pageSize,
        filter,
      );
    });
  });
});
