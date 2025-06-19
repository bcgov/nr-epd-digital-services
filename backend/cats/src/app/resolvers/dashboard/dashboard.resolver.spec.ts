import { Test, TestingModule } from '@nestjs/testing';
import { DashboardResolver } from './dashboard.resolver';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { RecentViewedApplication } from '../../entities/recentViewedApplication.entity';
import { HttpStatus } from '@nestjs/common';
import { Application } from '../../entities/application.entity';

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
      // other properties can be left undefined or empty arrays for relations
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
      formId: null,
      submissionId: null,
    } as Application,
  },
];


describe('DashboardResolver', () => {
  let resolver: DashboardResolver;
  let dashboardService: DashboardService;
  let loggerService: LoggerService;
  let dashboardResponse: GenericResponseProvider<RecentViewedApplication[]>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardResolver,
        {
          provide: DashboardService,
          useValue: {
            getRecentViewedApplications: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
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
    dashboardResponse = module.get<GenericResponseProvider<RecentViewedApplication[]>>(GenericResponseProvider);
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

      dashboardService.getRecentViewedApplications = jest.fn().mockRejectedValue(error);

      // You may want to handle this error inside resolver with try/catch if needed,
      // but since no error handling is shown, test for rejection here:
      await expect(resolver.getRecentViewedApplications(user)).rejects.toThrow(error);

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
    });
  });
});
