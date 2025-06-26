import { Test, TestingModule } from '@nestjs/testing';
import { DashboardResolver } from './dashboard.resolver';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { RecentViewedApplication } from '../../entities/recentViewedApplication.entity';
import { HttpStatus } from '@nestjs/common';
import { Application } from '../../entities/application.entity';
import { ViewDashboard } from '../../dto/dashboard/viewDashboard.dto';

const mockRecentViewedApplications: RecentViewedApplication[] = [
  {
    id: 1,
    userId: 'user-123',
    applicationId: 101,
    siteId: 201,
    address: '123 Main St',
    applicationType: 'Type A',
    visitedBy: 'user-123',
    visitedDateTime: new Date('2024-01-01T10:00:00Z'),
    application: {
      id: 101,
      siteId: 201,
      appTypeId: 1,
      outcomeId: null,
      reviewProcessId: null,
      riskId: null,
      receivedDate: '2024-01-01',
      endDate: null,
      appDescription: 'Sample app description',
      rowVersionCount: 1,
      createdBy: 'system',
      createdDateTime: new Date('2024-01-01T09:00:00Z'),
      updatedBy: 'system',
      updatedDateTime: new Date('2024-01-01T09:00:00Z'),
      ts: Buffer.from([]),
      csapRefNumber: null,
      formId: null,
      submissionId: null,
    } as Application,
  },
  {
    id: 2,
    userId: 'user-456',
    applicationId: 102,
    siteId: 202,
    address: '456 Elm St',
    applicationType: 'Type B',
    visitedBy: 'user-456',
    visitedDateTime: new Date('2024-02-01T10:00:00Z'),
    application: {
      id: 102,
      siteId: 202,
      appTypeId: 2,
      outcomeId: null,
      reviewProcessId: null,
      riskId: null,
      receivedDate: '2024-02-01',
      endDate: null,
      appDescription: 'Another app description',
      rowVersionCount: 1,
      createdBy: 'system',
      createdDateTime: new Date('2024-02-01T09:00:00Z'),
      updatedBy: 'system',
      updatedDateTime: new Date('2024-02-01T09:00:00Z'),
      ts: Buffer.from([]),
      csapRefNumber: null,
    } as Application,
  },
];


describe('DashboardResolver', () => {
  let resolver: DashboardResolver;
  let dashboardService: DashboardService;
  let loggerService: LoggerService;
  let dashboardResponse: GenericResponseProvider<ViewDashboard[]>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardResolver,
        {
          provide: DashboardService,
          useValue: {
            getRecentViewedApplications: jest.fn(),
            getApplications: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
        {
          provide: GenericResponseProvider,
          useValue: {
            createResponse: jest.fn().mockImplementation((message, status, success, data) => ({
              message,
              httpStatusCode: status,
              success,
              data,
              timestamp: expect.any(String),
            })),
          },
        },
      ],
    }).compile();

    resolver = module.get<DashboardResolver>(DashboardResolver);
    dashboardService = module.get<DashboardService>(DashboardService);
    loggerService = module.get<LoggerService>(LoggerService);
    dashboardResponse = module.get<GenericResponseProvider<ViewDashboard[]>>(GenericResponseProvider);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getRecentViewedApplications', () => {
    it('should return error response for invalid user', async () => {
      const invalidUsers = [null, undefined, {}, { someProp: 'no sub' }];

      for (const user of invalidUsers) {
        const result = await resolver.getRecentViewedApplications(user as any);

        expect(loggerService.log).toHaveBeenCalledWith(
          'An invalid user was passed into DashboardResolver.getRecentViewedApplications() end'
        );
        expect(dashboardResponse.createResponse).toHaveBeenCalledWith(
          'Invalid user',
          400,
          false,
          null
        );
        expect(result).toEqual({
          message: 'Invalid user',
          httpStatusCode: 400,
          success: false,
          data: null,
          timestamp: expect.any(String),
        });
      }
    });

    it('should return recent viewed applications when found', async () => {
      const user = { sub: 'user-123' };
      const mockResult: RecentViewedApplication[] = mockRecentViewedApplications;

      dashboardService.getRecentViewedApplications = jest.fn().mockResolvedValue(mockResult);

      const result = await resolver.getRecentViewedApplications(user);

      expect(loggerService.log).toHaveBeenCalledWith(
        `DashboardResolver.getRecentViewedApplications() user: ${user.sub}`
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        'DashboardResolver.getRecentViewedApplications() calling DashboardService.getRecentViewedApplications()'
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        'DashboardResolver.getRecentViewedApplications() start'
      );
      expect(dashboardService.getRecentViewedApplications).toHaveBeenCalledWith(user);
      expect(loggerService.log).toHaveBeenCalledWith(
        'DashboardResolver.getRecentViewedApplications() RES:200 end'
      );

      expect(dashboardResponse.createResponse).toHaveBeenCalledWith(
        'Recent viewed applications retrieved successfully',
        HttpStatus.OK,
        true,
        mockResult
      );

      expect(result).toEqual({
        message: 'Recent viewed applications retrieved successfully',
        httpStatusCode: HttpStatus.OK,
        success: true,
        data: mockResult,
        timestamp: expect.any(String),
      });
    });

    it('should return not found response when no recent viewed applications found', async () => {
      const user = { sub: 'user-123' };
      dashboardService.getRecentViewedApplications = jest.fn().mockResolvedValue([]);

      const result = await resolver.getRecentViewedApplications(user);

      expect(loggerService.log).toHaveBeenCalledWith(
        `DashboardResolver.getRecentViewedApplications() user: ${user.sub}`
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        'DashboardResolver.getRecentViewedApplications() calling DashboardService.getRecentViewedApplications()'
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        'DashboardResolver.getRecentViewedApplications() start'
      );
      expect(dashboardService.getRecentViewedApplications).toHaveBeenCalledWith(user);
      expect(loggerService.log).toHaveBeenCalledWith(
        'DashboardResolver.getRecentViewedApplications() RES:404 end'
      );

      expect(dashboardResponse.createResponse).toHaveBeenCalledWith(
        'No recent viewed applications found',
        HttpStatus.NOT_FOUND,
        false,
        null
      );

      expect(result).toEqual({
        message: 'No recent viewed applications found',
        httpStatusCode: HttpStatus.NOT_FOUND,
        success: false,
        data: null,
        timestamp: expect.any(String),
      });
    });

    it('should handle errors thrown by dashboardService', async () => {
      const user = { sub: 'user-123' };
      const error = new Error('Service failure');

      jest.spyOn(dashboardService, 'getRecentViewedApplications').mockRejectedValue(error);

      const result = await resolver.getRecentViewedApplications(user);

      expect(loggerService.error).toHaveBeenCalledWith(
        `Error in getRecentViewedApplications: ${error.message}`,
        error
      );
      expect(dashboardResponse.createResponse).toHaveBeenCalledWith(
        'Failed to retrieve recent viewed applications',
        HttpStatus.INTERNAL_SERVER_ERROR,
        false,
        null
      );
      expect(result).toEqual({
        message: 'Failed to retrieve recent viewed applications',
        httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        data: null,
        timestamp: expect.any(String),
      });
    });


  });

  describe('getApplications', () => {
    it('should return applications when found', async () => {
      const mockApplications = [
        {
          applicationId: 1,
          applicationType: 'Residential',
          applicationStatus: 'Submitted',
          priority: 'High',
          receivedDate: '2024-05-01',
          siteId: 101,
          address: '123 Main St Suite 100',
        },
      ];

      jest.spyOn(dashboardService, 'getApplications').mockResolvedValue(mockApplications);

      const result = await resolver.getApplications();

      expect(loggerService.log).toHaveBeenCalledWith('DashboardResolver.getApplications() start');
      expect(loggerService.log).toHaveBeenCalledWith('DashboardResolver.getApplications() calling DashboardService.getApplications()');
      expect(loggerService.log).toHaveBeenCalledWith('DashboardResolver.getApplications() RES:200 end');

      expect(dashboardResponse.createResponse).toHaveBeenCalledWith(
        'Recent viewed applications retrieved successfully',
        HttpStatus.OK,
        true,
        mockApplications
      );

      expect(result).toEqual({
        message: 'Recent viewed applications retrieved successfully',
        httpStatusCode: HttpStatus.OK,
        success: true,
        data: mockApplications,
        timestamp: expect.any(String),
      });
    });

    it('should return 404 when no applications found', async () => {
      jest.spyOn(dashboardService, 'getApplications').mockResolvedValue([]);

      const result = await resolver.getApplications();

      expect(loggerService.log).toHaveBeenCalledWith('DashboardResolver.getApplications() RES:404 end');
      expect(dashboardResponse.createResponse).toHaveBeenCalledWith(
        'No recent viewed applications found',
        HttpStatus.NOT_FOUND,
        false,
        null
      );

      expect(result).toEqual({
        message: 'No recent viewed applications found',
        httpStatusCode: HttpStatus.NOT_FOUND,
        success: false,
        data: null,
        timestamp: expect.any(String),
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('DB crash');
      jest.spyOn(dashboardService, 'getApplications').mockRejectedValue(error);

      const result = await resolver.getApplications();

      expect(loggerService.error).toHaveBeenCalledWith(
        `Error in getApplications: ${error.message}`,
        error
      );
      expect(dashboardResponse.createResponse).toHaveBeenCalledWith(
        'Failed to retrieve applications',
        HttpStatus.INTERNAL_SERVER_ERROR,
        false,
        null
      );

      expect(result).toEqual({
        message: 'Failed to retrieve applications',
        httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        data: null,
        timestamp: expect.any(String),
      });
    });

    it('should return trimmed and single-line formatted address', async () => {
      const mockApplications = [
        {
          applicationId: 2,
          applicationType: 'Commercial',
          applicationStatus: 'In Review',
          priority: 'Medium',
          receivedDate: '2024-06-01',
          siteId: 202,
          address: '456 Elm St\n\n  Suite 200\n  \n'
        }
      ];

      jest.spyOn(dashboardService, 'getApplications').mockResolvedValue(mockApplications);

      const result = await resolver.getApplications();


      expect(result.data[0].address).toBe('456 Elm St\n\n  Suite 200\n  \n');
    });

    it('should handle missing fields in application data gracefully', async () => {
      const mockApplications = [
        {
          applicationId: 3,
          applicationType: null,
          applicationStatus: 'Pending',
          priority: null,
          receivedDate: '2024-06-10',
          siteId: 303,
          address: null,
        }
      ];

      jest.spyOn(dashboardService, 'getApplications').mockResolvedValue(mockApplications);

      const result = await resolver.getApplications();

      expect(result.data[0].applicationType).toBeNull();
      expect(result.data[0].priority).toBeNull();
      expect(result.data[0].address).toBeNull();
    });

    it('should return multiple applications including ones with missing optional fields', async () => {
      const mockApplications = [
        {
          applicationId: 4,
          applicationType: 'Industrial',
          applicationStatus: 'Approved',
          priority: 'Low',
          receivedDate: '2024-04-20',
          siteId: 404,
          address: '789 Pine St Suite 300',
        },
        {
          applicationId: 5,
          applicationType: null,
          applicationStatus: 'Submitted',
          priority: null,
          receivedDate: '2024-05-15',
          siteId: 505,
          address: null,
        }
      ];

      jest.spyOn(dashboardService, 'getApplications').mockResolvedValue(mockApplications);

      const result = await resolver.getApplications();

      expect(result.data.length).toBe(2);
      expect(result.data[0].applicationType).toBe('Industrial');
      expect(result.data[1].applicationType).toBeNull();
    });

    it('should handle null result from dashboardService gracefully', async () => {
      jest.spyOn(dashboardService, 'getApplications').mockResolvedValue(null);

      const result = await resolver.getApplications();

      expect(result).toEqual({
        message: 'No recent viewed applications found',
        httpStatusCode: HttpStatus.NOT_FOUND,
        success: false,
        data: null,
        timestamp: expect.any(String),
      });
    });

  });
});
