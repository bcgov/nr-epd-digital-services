import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { DataSource, Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { SiteService } from '../site/site.service';
import { Application } from '../../entities/application.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecentViewedApplication } from '../../entities/recentViewedApplication.entity';

describe('DashboardService', () => {
  let dashboardService: DashboardService;
  let recentViewedApplicationRepository: Partial<Repository<RecentViewedApplication>>;
  let loggerService: Partial<LoggerService>;
  let siteService: Partial<SiteService>;
  let dataSourceMock: Partial<DataSource>;

  beforeEach(async () => {
    dataSourceMock = {
      query: jest.fn(),
    };
    recentViewedApplicationRepository = {
      find: jest.fn(),
      remove: jest.fn(),
      save: jest.fn(),
    };

    loggerService = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    siteService = {
      getSiteById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: getRepositoryToken(RecentViewedApplication), useValue: recentViewedApplicationRepository },
        { provide: LoggerService, useValue: loggerService },
        { provide: SiteService, useValue: siteService },
        { provide: DataSource, useValue: dataSourceMock },
      ],
    }).compile();

    dashboardService = module.get<DashboardService>(DashboardService);
  });

  describe('getRecentViewedApplications', () => {
    it('should return recent viewed applications when user is valid', async () => {
      const user = { sub: 'user1' };
      const mockApps = [{ applicationId: 1 }, { applicationId: 2 }];

      (recentViewedApplicationRepository.find as jest.Mock).mockResolvedValue(mockApps);

      const result = await dashboardService.getRecentViewedApplications(user);

      expect(loggerService.log).toHaveBeenCalledWith('DashboardService.getRecentViewedApplication() start');
      expect(recentViewedApplicationRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        order: { visitedDateTime: 'ASC' },
      });
      expect(result).toEqual(mockApps);
      expect(loggerService.log).toHaveBeenCalledWith('DashboardService.getRecentViewedApplication() end');
    });

    it('should return null and log when user is invalid', async () => {
      const user = { sub: '' };

      const result = await dashboardService.getRecentViewedApplications(user);

      expect(result).toBeNull();
      expect(loggerService.log).toHaveBeenCalledWith(
        'An invalid user was passed into DashboardService.getRecentViewedApplication() end',
      );
    });

    it('should log and throw on repository error', async () => {
      const user = { sub: 'user1' };
      const error = new Error('DB fail');
      (recentViewedApplicationRepository.find as jest.Mock).mockRejectedValue(error);

      await expect(dashboardService.getRecentViewedApplications(user)).rejects.toThrow(error);

      expect(loggerService.error).toHaveBeenCalledWith(
        `Error in getRecentViewedApplication: ${error.message}`,
        error,
      );
    });
  });

  describe('createRecentViewedApplication', () => {
    const userInfo = { sub: 'user1', givenName: 'John' };
    const application = {
      id: 101,
      siteId: 55,
      appType: { description: 'TypeA' },
    } as Application;

    const siteResponse = {
      findSiteBySiteId: {
        data: {
          id: '55',
          addrLine_1: 'Line1',
          addrLine_2: 'Line2',
          addrLine_3: '',
          addrLine_4: '',
        },
      },
    };

    it('should create and save a recent viewed application successfully', async () => {
      (siteService.getSiteById as jest.Mock).mockResolvedValue(siteResponse);
      (recentViewedApplicationRepository.find as jest.Mock).mockResolvedValue([
        { visitedDateTime: new Date('2024-01-01') },
        { visitedDateTime: new Date('2024-01-02') },
      ]);
      (recentViewedApplicationRepository.remove as jest.Mock).mockResolvedValue(undefined);
      (recentViewedApplicationRepository.save as jest.Mock).mockImplementation(x => Promise.resolve(x));

      const result = await dashboardService.createRecentViewedApplication(application, userInfo);

      expect(loggerService.log).toHaveBeenCalledWith('DashboardService.createRecentViewedApplication() start');
      expect(siteService.getSiteById).toHaveBeenCalledWith('55');
      expect(recentViewedApplicationRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        order: { visitedDateTime: 'ASC' },
      });
      expect(recentViewedApplicationRepository.remove).not.toHaveBeenCalled(); // only 2 < max 4
      expect(recentViewedApplicationRepository.save).toHaveBeenCalled();
      expect(result).toMatchObject({
        userId: 'user1',
        applicationId: 101,
        applicationType: 'TypeA',
        visitedBy: 'John',
        siteId: 55,
      });
      expect(loggerService.log).toHaveBeenCalledWith('DashboardService.createRecentViewedApplication() end');
    });

    it('should remove oldest applications if more than max limit', async () => {
      (siteService.getSiteById as jest.Mock).mockResolvedValue(siteResponse);

      // 6 applications, max is 4 -> remove first 2 oldest
      const oldApps = [
        { visitedDateTime: new Date('2024-01-01'), id: 1 },
        { visitedDateTime: new Date('2024-01-02'), id: 2 },
        { visitedDateTime: new Date('2024-01-03'), id: 3 },
        { visitedDateTime: new Date('2024-01-04'), id: 4 },
      ];
      (recentViewedApplicationRepository.find as jest.Mock).mockResolvedValue(oldApps);
      (recentViewedApplicationRepository.remove as jest.Mock).mockResolvedValue(undefined);
      (recentViewedApplicationRepository.save as jest.Mock).mockImplementation(x => Promise.resolve(x));

      await dashboardService.createRecentViewedApplication(application, userInfo);

      expect(recentViewedApplicationRepository.remove).toHaveBeenCalledWith(oldApps.slice(0, 1)[0]);
    });

    it('should return null and log if user is invalid', async () => {
      const badUser = { sub: '' };

      const result = await dashboardService.createRecentViewedApplication(application, badUser);

      expect(result).toBeNull();
      expect(loggerService.log).toHaveBeenCalledWith(
        'An invalid user was passed into DashboardService.createRecentViewedApplication() end',
      );
    });

    it('should return null and log if site is invalid', async () => {
      (siteService.getSiteById as jest.Mock).mockResolvedValue(null);

      const result = await dashboardService.createRecentViewedApplication(application, userInfo);

      expect(result).toBeNull();
      expect(loggerService.log).toHaveBeenCalledWith(
        'An invalid site was passed into DashboardService.createRecentViewedApplication() end',
      );
    });

    it('should log and throw on repository or service errors', async () => {
      (siteService.getSiteById as jest.Mock).mockRejectedValue(new Error('site service fail'));

      await expect(
        dashboardService.createRecentViewedApplication(application, userInfo),
      ).rejects.toThrow('site service fail');

      expect(loggerService.error).toHaveBeenCalled();

      // Now test save error
      (siteService.getSiteById as jest.Mock).mockResolvedValue(siteResponse);
      (recentViewedApplicationRepository.find as jest.Mock).mockResolvedValue([]);
      (recentViewedApplicationRepository.save as jest.Mock).mockRejectedValue(new Error('save fail'));

      await expect(
        dashboardService.createRecentViewedApplication(application, userInfo),
      ).rejects.toThrow('save fail');

      expect(loggerService.error).toHaveBeenCalled();
    });
  });

  describe('getApplications', () => {
  it('should return a list of processed applications with site address', async () => {
    const mockApplications = [
      {
        applicationid: 1,
        siteid: 101,
        applicationtype: 'Residential',
        applicationstatus: 'Submitted',
        priority: 'High',
        receiveddate: '2024-05-01',
      },
    ];

    const mockSite = {
      findSiteBySiteId: {
        data: {
          addrLine_1: '123 Main St',
          addrLine_2: 'Suite 100',
          addrLine_3: '',
          addrLine_4: '',
        },
      },
    };

    (dataSourceMock.query as jest.Mock).mockResolvedValue(mockApplications);
    (siteService.getSiteById as jest.Mock).mockResolvedValue(mockSite);

    const result = await dashboardService.getApplications();

    expect(loggerService.log).toHaveBeenCalledWith('DashboardService.getApplications() start');
    expect(dataSourceMock.query).toHaveBeenCalled();
    expect(siteService.getSiteById).toHaveBeenCalledWith('101');
    expect(result).toEqual([
      {
        applicationId: 1,
        applicationType: 'Residential',
        applicationStatus: 'Submitted',
        priority: 'High',
        receivedDate: '2024-05-01',
        siteId: 101,
        address: '123 Main St Suite 100',
      },
    ]);
    expect(loggerService.log).toHaveBeenCalledWith('DashboardService.getApplications() end');
  });

  it('should return empty array when no applications are found', async () => {
    (dataSourceMock.query as jest.Mock).mockResolvedValue([]);

    const result = await dashboardService.getApplications();

    expect(loggerService.log).toHaveBeenCalledWith('No applications found');
    expect(result).toEqual([]);
  });

  it('should throw error if dataSource.query fails', async () => {
    const error = new Error('Database error');
    (dataSourceMock.query as jest.Mock).mockRejectedValue(error);

    await expect(dashboardService.getApplications()).rejects.toThrow('Database error');
    expect(loggerService.error).toHaveBeenCalledWith(
      `Error in getApplications: ${error.message}`,
      error,
    );
  });

  it('should handle null or missing siteId gracefully', async () => {
    const mockApplications = [
      {
        applicationid: 2,
        siteid: null,
        applicationtype: 'Commercial',
        applicationstatus: 'In Review',
        priority: 'Medium',
        receiveddate: '2024-05-05',
      },
    ];

    (dataSourceMock.query as jest.Mock).mockResolvedValue(mockApplications);

    const result = await dashboardService.getApplications();

    expect(siteService.getSiteById).not.toHaveBeenCalled();
    expect(result[0].address).toBe(null);
  });

  it('should handle siteService.getSiteById returning null', async () => {
    const mockApplications = [
      {
        applicationid: 3,
        siteid: 202,
        applicationtype: 'Industrial',
        applicationstatus: 'Processing',
        priority: 'Low',
        receiveddate: '2024-04-15',
      },
    ];

    (dataSourceMock.query as jest.Mock).mockResolvedValue(mockApplications);
    (siteService.getSiteById as jest.Mock).mockResolvedValue(null);

    const result = await dashboardService.getApplications();

    expect(result[0].address).toBe(null);
  });

  it('should handle error from siteService.getSiteById', async () => {
    const mockApplications = [
      {
        applicationid: 4,
        siteid: 303,
        applicationtype: 'Mixed-Use',
        applicationstatus: 'Open',
        priority: 'Urgent',
        receiveddate: '2024-06-01',
      },
    ];

    (dataSourceMock.query as jest.Mock).mockResolvedValue(mockApplications);
    (siteService.getSiteById as jest.Mock).mockRejectedValue(new Error('Site service error'));

    await expect(dashboardService.getApplications()).rejects.toThrow('Site service error');
    expect(loggerService.error).toHaveBeenCalled();
  });
});

});
