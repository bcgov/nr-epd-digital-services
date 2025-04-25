import { Test, TestingModule } from '@nestjs/testing';
import { SiteService } from './site.service';
import { LoggerService } from '../../logger/logger.service';
import { GraphQLClient } from 'graphql-request';
import { getSdk } from './graphql/Site.generated';

jest.mock('graphql-request', () => ({
  GraphQLClient: jest.fn().mockImplementation(() => ({
    request: jest.fn(),
  })),
}));

jest.mock('./graphql/Site.generated', () => ({
  getSdk: jest.fn().mockReturnValue({
    findSiteBySiteId: jest.fn(),
  }),
}));

describe('SiteService', () => {
  let service: SiteService;
  let siteSdk: ReturnType<typeof getSdk>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SiteService,
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SiteService>(SiteService);
    siteSdk = getSdk(new GraphQLClient(''));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSiteById', () => {
    it('should fetch site data successfully', async () => {
      const mockSiteId = '12345';
      const mockResponse = {
        findSiteBySiteId: {
          data: {
            id: mockSiteId,
            name: 'Test Site',
            address: '123 Test St',
          },
        },
      };

      (siteSdk.findSiteBySiteId as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.getSiteById(mockSiteId);
      expect(siteSdk.findSiteBySiteId).toHaveBeenCalledWith({
        siteId: mockSiteId,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when fetching site data', async () => {
      const mockSiteId = '12345';
      const error = new Error('GraphQL Error');

      (siteSdk.findSiteBySiteId as jest.Mock).mockRejectedValue(error);

      await expect(service.getSiteById(mockSiteId)).rejects.toThrow(error);
    });
  });
});
