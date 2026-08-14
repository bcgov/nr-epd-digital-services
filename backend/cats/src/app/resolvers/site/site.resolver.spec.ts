import { Test, TestingModule } from '@nestjs/testing';
import { SiteResolver } from './site.resolver';
import { SiteService } from '../../services/site/site.service';
import { LoggerService } from '../../logger/logger.service';
import { SiteDetailsResponse } from '../../dto/siteDetails.dto';

describe('SiteResolver', () => {
  let resolver: SiteResolver;
  let siteService: SiteService;
  let siteDetailsResponse: SiteDetailsResponse;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SiteResolver,
        {
          provide: SiteService,
          useValue: {
            getSiteById: jest.fn(),
            getSiteByIdForService: jest.fn(),
            getSiteByIdForServiceWithUserToken: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: SiteDetailsResponse,
          useValue: {
            createResponse: jest
              .fn()
              .mockImplementation((message, statusCode, success, data) => ({
                message,
                statusCode,
                success,
                data,
              })),
          },
        },
      ],
    }).compile();

    resolver = module.get<SiteResolver>(SiteResolver);
    siteService = module.get<SiteService>(SiteService);
    siteDetailsResponse = module.get<SiteDetailsResponse>(SiteDetailsResponse);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getSiteDetailsBySiteId', () => {
    it('should return site details when found', async () => {
      const mockSiteId = '12345';
      const mockSiteData = {
        id: mockSiteId,
        name: 'Test Site',
        address: '123 Test St',
      };

      siteService.getSiteById = jest.fn().mockResolvedValue({
        findSiteBySiteIdLoggedInUser: {
          data: mockSiteData,
        },
      });

      const result = await resolver.getSiteDetailsBySiteId(mockSiteId);

      expect(siteService.getSiteById).toHaveBeenCalledWith(mockSiteId);

      expect(result).toEqual({
        message: 'Site details retrieved successfully',
        httpStatusCode: 200,
        success: true,
        data: mockSiteData,
        timestamp: expect.any(String),
      });
    });

    it('should return not found response when site does not exist', async () => {
      const mockSiteId = '12345';

      siteService.getSiteById = jest.fn().mockResolvedValue({
        findSiteBySiteId: {
          data: null,
        },
      });

      const result = await resolver.getSiteDetailsBySiteId(mockSiteId);

      expect(siteService.getSiteById).toHaveBeenCalledWith(mockSiteId);
      expect(result).toEqual({
        message: 'Site not found',
        httpStatusCode: 404,
        success: false,
        data: null,
        timestamp: expect.any(String),
      });
    });

    it('should handle errors and return error response', async () => {
      const mockSiteId = '12345';
      const error = new Error('GraphQL Error');

      siteService.getSiteById = jest.fn().mockRejectedValue(error);

      const result = await resolver.getSiteDetailsBySiteId(mockSiteId);

      expect(siteService.getSiteById).toHaveBeenCalledWith(mockSiteId);
      expect(result).toEqual({
        message: 'Error retrieving site details',
        httpStatusCode: 500,
        success: false,
        data: null,
        timestamp: expect.any(String),
      });
    });
  });

  describe('getSiteByIdForService', () => {
    it('should return site details when found', async () => {
      const mockSiteId = '12345';
      const mockSiteData = {
        id: mockSiteId,
        name: 'Test Site',
        address: '123 Test St',
      };

      siteService.getSiteByIdForService = jest.fn().mockResolvedValue({
        findSiteBySiteIdForService: {
          data: mockSiteData,
        },
      });

      const result = await resolver.getSiteByIdForService(mockSiteId);

      expect(siteService.getSiteByIdForService).toHaveBeenCalledWith(
        mockSiteId,
      );
      expect(result).toEqual({
        message: 'Site details retrieved successfully',
        httpStatusCode: 200,
        success: true,
        data: mockSiteData,
        timestamp: expect.any(String),
      });
    });

    it('should return not found response when site does not exist', async () => {
      const mockSiteId = '12345';

      siteService.getSiteByIdForService = jest.fn().mockResolvedValue({
        findSiteBySiteIdForService: {
          data: null,
        },
      });

      const result = await resolver.getSiteByIdForService(mockSiteId);

      expect(result).toEqual({
        message: 'Site not found',
        httpStatusCode: 404,
        success: false,
        data: null,
        timestamp: expect.any(String),
      });
    });

    it('should handle errors and return error response', async () => {
      const mockSiteId = '12345';
      const error = new Error('GraphQL Error');

      siteService.getSiteByIdForService = jest.fn().mockRejectedValue(error);

      const result = await resolver.getSiteByIdForService(mockSiteId);

      expect(result).toEqual({
        message: 'Error retrieving site details',
        httpStatusCode: 500,
        success: false,
        data: null,
        timestamp: expect.any(String),
      });
    });
  });

  describe('getSiteByIdForServiceAsUser', () => {
    const context = {
      req: { headers: { authorization: 'Bearer user-jwt' } },
    };

    it('forwards the caller JWT to SITE', async () => {
      const mockSiteId = '12345';
      const mockSiteData = { id: mockSiteId };

      siteService.getSiteByIdForServiceWithUserToken = jest
        .fn()
        .mockResolvedValue({
          findSiteBySiteIdForService: { data: mockSiteData },
        });

      const result = await resolver.getSiteByIdForServiceAsUser(
        mockSiteId,
        context,
      );

      expect(siteService.getSiteByIdForServiceWithUserToken).toHaveBeenCalledWith(
        mockSiteId,
        'user-jwt',
      );
      expect(result).toEqual({
        message: 'Site details retrieved successfully',
        httpStatusCode: 200,
        success: true,
        data: mockSiteData,
        timestamp: expect.any(String),
      });
    });

    it('returns 403 when SITE rejects the user token', async () => {
      siteService.getSiteByIdForServiceWithUserToken = jest
        .fn()
        .mockRejectedValue({
          response: {
            status: 403,
            errors: [{ message: 'Forbidden resource' }],
          },
        });

      const result = await resolver.getSiteByIdForServiceAsUser(
        '12345',
        context,
      );

      expect(result).toEqual({
        message: 'Forbidden resource',
        httpStatusCode: 403,
        success: false,
        data: null,
        timestamp: expect.any(String),
      });
    });

    it('returns 403 when SITE wraps the denial as an empty payload', async () => {
      siteService.getSiteByIdForServiceWithUserToken = jest
        .fn()
        .mockResolvedValue({
          findSiteBySiteIdForService: {
            message: 'Forbidden resource',
            httpStatusCode: 403,
            success: false,
            data: null,
          },
        });

      const result = await resolver.getSiteByIdForServiceAsUser(
        '12345',
        context,
      );

      expect(result).toEqual({
        message: 'Forbidden resource',
        httpStatusCode: 403,
        success: false,
        data: null,
        timestamp: expect.any(String),
      });
    });
  });
});
