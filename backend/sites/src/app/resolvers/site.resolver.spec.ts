import { Test, TestingModule } from '@nestjs/testing';
import { SiteResolver } from './site.resolver';
import { SiteService } from '../services/site.service';
import { Sites } from '../entities/sites.entity';
import { FetchSiteResponse } from '../dto/response/fetchSiteResponse';
import { sampleSites } from '../mockData/site.mockData';

describe('SiteResolver', () => {
  let siteResolver: SiteResolver;
  let siteService: SiteService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SiteResolver,
        {
          provide: SiteService,
          useValue: {
            findAll: jest.fn(() => {
              const result = new FetchSiteResponse();
              result.httpStatusCode = 200;
              result.data = sampleSites;
              return result;
            }),
            searchSites: jest.fn(),
          },
        },
      ],
    }).compile();

    siteResolver = module.get<SiteResolver>(SiteResolver);
    siteService = module.get<SiteService>(SiteService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call siteService.findAll() and return the result', async () => {
    // Act
    const sites = await siteResolver.findAll();
    // Assert
    expect(sites.data.length).toBe(2);
    expect(sites.httpStatusCode).toBe(200);
    expect(siteService.findAll).toHaveBeenCalled();
  });

  it('should call siteService.searchSites with the provided searchParam', () => {
    const searchParam = 'example';
    siteResolver.searchSites(searchParam);
    expect(siteService.searchSites).toHaveBeenCalledWith(searchParam);
  });

  it('site search matches a search parameter', async () => {
    const searchParam = '123';
    const expectedFilteredSites = [sampleSites[0]]; // Only Site 1 matches the searchParam
    (siteService.searchSites as jest.Mock).mockResolvedValue(expectedFilteredSites);

    const result: Sites[] = await siteResolver.searchSites(searchParam);

    expect(siteService.searchSites).toHaveBeenCalledWith(searchParam);
    expect(result).toEqual(expectedFilteredSites);
  });

  it('site search has no matches with the search parameter', async () => {
    const searchParam = 'example';
    const expectedFilteredSites: Sites[] = [];
    (siteService.searchSites as jest.Mock).mockResolvedValue(expectedFilteredSites);

    const result: Sites[] = await siteResolver.searchSites(searchParam);

    expect(siteService.searchSites).toHaveBeenCalledWith(searchParam);
    expect(result).toEqual(expectedFilteredSites);
  });
});