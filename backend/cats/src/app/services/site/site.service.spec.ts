import { Test, TestingModule } from '@nestjs/testing';
import { SiteService } from './site.service';
import { LoggerService } from '../../logger/logger.service';
import { GraphQLClient } from 'graphql-request';
import axios, { AxiosError } from 'axios';
import { getSdk } from './graphql/Site.generated';

jest.mock('axios');
jest.mock('graphql-request', () => {
  return {
    GraphQLClient: jest.fn().mockImplementation(() => ({
      request: jest.fn(),
    })),
  };
});

const mockFindSiteBySiteIdLoggedInUser = jest.fn();
const mockFindSiteBySiteIdForService = jest.fn();

jest.mock('./graphql/Site.generated', () => ({
  getSdk: jest.fn(() => ({
    findSiteBySiteIdLoggedInUser: mockFindSiteBySiteIdLoggedInUser,
    findSiteBySiteIdForService: mockFindSiteBySiteIdForService,
  })),
}));

describe('SiteService', () => {
  let service: SiteService;

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    // Set required environment variables
    process.env.KEYCLOAK_TOKEN_URL = 'http://keycloak/token';
    process.env.KEYCLOAK_SITE_SERVICE_CLIENT_ID = 'test-client-id';
    process.env.KEYCLOAK_SITE_SERVICE_CLIENT_SECRET = 'test-client-secret';
    process.env.SITE_SERVICE_URL = 'http://site/graphql';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SiteService,
        {
          provide: LoggerService,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<SiteService>(SiteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSiteById', () => {
    it('should fetch site data successfully', async () => {
      const mockSiteId = '12345';
      const mockToken = 'fake-jwt-token';

      // Mock token fetch from Keycloak
      (axios.post as jest.Mock).mockResolvedValue({
        data: {
          access_token: mockToken,
          expires_in: 3600,
        },
      });

      const mockResponse = {
        findSiteBySiteIdLoggedInUser: {
          id: mockSiteId,
          name: 'Test Site',
          address: '123 Test St',
        },
      };

      mockFindSiteBySiteIdLoggedInUser.mockResolvedValue(mockResponse);

      const result = await service.getSiteById(mockSiteId);

      expect(axios.post).toHaveBeenCalledWith(
        'http://keycloak/token',
        expect.any(String),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );
      expect(mockFindSiteBySiteIdLoggedInUser).toHaveBeenCalledWith({
        siteId: mockSiteId,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when GraphQL call fails', async () => {
      const mockSiteId = '12345';
      const mockToken = 'fake-jwt-token';

      (axios.post as jest.Mock).mockResolvedValue({
        data: {
          access_token: mockToken,
          expires_in: 3600,
        },
      });

      const mockError = new Error('GraphQL Error');
      mockFindSiteBySiteIdLoggedInUser.mockRejectedValue(mockError);

      await expect(service.getSiteById(mockSiteId)).rejects.toThrow(mockError);
    });
  });

  describe('getSiteByIdForService', () => {
    it('should fetch site data via the service query', async () => {
      const mockSiteId = '12345';
      const mockToken = 'fake-jwt-token';

      (axios.post as jest.Mock).mockResolvedValue({
        data: {
          access_token: mockToken,
          expires_in: 3600,
        },
      });

      const mockResponse = {
        findSiteBySiteIdForService: {
          data: {
            id: mockSiteId,
            name: 'Test Site',
          },
        },
      };

      mockFindSiteBySiteIdForService.mockResolvedValue(mockResponse);

      const result = await service.getSiteByIdForService(mockSiteId);

      expect(mockFindSiteBySiteIdForService).toHaveBeenCalledWith({
        siteId: mockSiteId,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when the service GraphQL call fails', async () => {
      const mockSiteId = '12345';

      (axios.post as jest.Mock).mockResolvedValue({
        data: {
          access_token: 'fake-jwt-token',
          expires_in: 3600,
        },
      });

      const mockError = new Error('GraphQL Error');
      mockFindSiteBySiteIdForService.mockRejectedValue(mockError);

      await expect(service.getSiteByIdForService(mockSiteId)).rejects.toThrow(
        mockError,
      );
    });
  });

  describe('getSiteByIdForServiceWithUserToken', () => {
    it('calls SITE with the provided user token and does not fetch client credentials', async () => {
      const mockSiteId = '12345';
      const mockResponse = {
        findSiteBySiteIdForService: { data: { id: mockSiteId } },
      };
      mockFindSiteBySiteIdForService.mockResolvedValue(mockResponse);

      const result = await service.getSiteByIdForServiceWithUserToken(
        mockSiteId,
        'user-jwt',
      );

      expect(axios.post).not.toHaveBeenCalled();
      expect(GraphQLClient).toHaveBeenCalledWith('http://site/graphql', {
        headers: { Authorization: 'Bearer user-jwt' },
      });
      expect(mockFindSiteBySiteIdForService).toHaveBeenCalledWith({
        siteId: mockSiteId,
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
