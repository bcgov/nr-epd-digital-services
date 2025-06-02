import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from './staff.service';
import { DataSource, Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { Filter } from '../../utilities/enums/application/filter.enum';
import { SortBy } from '../../utilities/enums/staff/sortBy.enum';
import { SortByDirection } from '../../utilities/enums/application/sortByDirection.enum';
import { AppParticipant } from '../../entities/appParticipant.entity';
import { SiteService } from '../site/site.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('StaffService', () => {
  let staffService: StaffService;
  let dataSourceMock: Partial<DataSource>;
  let loggerServiceMock: Partial<LoggerService>;
  let applicationParticRepo: Partial<Repository<AppParticipant>>;
  let siteServiceMock: Partial<SiteService>;

  beforeEach(async () => {
    dataSourceMock = {
      query: jest.fn(),
    };

    loggerServiceMock = {
      log: jest.fn(),
      error: jest.fn(),
    };

    applicationParticRepo = {
      createQueryBuilder: jest.fn(),
    };

    siteServiceMock = {
      getSiteById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        { provide: DataSource, useValue: dataSourceMock },
        { provide: LoggerService, useValue: loggerServiceMock },
        { provide: getRepositoryToken(AppParticipant), useValue: applicationParticRepo },
        { provide: SiteService, useValue: siteServiceMock },
      ],
    }).compile();

    staffService = module.get<StaffService>(StaffService);
  });

  const sampleResult = [
    { id: 1, name: 'John Doe', current_factors: '3' },
    { id: 2, name: 'Jane Smith', current_factors: '0' },
  ];

  const sampleCount = [{ count: '2' }];

  it('should return paginated staff list without filters', async () => {
    (dataSourceMock.query as jest.Mock)
      .mockResolvedValueOnce(sampleResult) // data query
      .mockResolvedValueOnce(sampleCount); // count query

    const result = await staffService.getStaffs(1, 10, null, SortBy.NAME, SortByDirection.ASC);

    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
    expect(result.count).toBe(2);
    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toEqual({
      id: 1,
      name: 'John Doe',
      assignments: 3,
      capacity: 10,
    });
    expect(dataSourceMock.query).toHaveBeenCalledTimes(2);
  });

  it('should return unassigned staff only', async () => {
    (dataSourceMock.query as jest.Mock)
      .mockResolvedValueOnce([sampleResult[1]]) // only unassigned
      .mockResolvedValueOnce([{ count: '1' }]);

    const result = await staffService.getStaffs(1, 10, Filter.UNASSIGNED, SortBy.ID, SortByDirection.ASC);

    expect(result.count).toBe(1);
    expect(result.data[0].assignments).toBe(0);
  });

  it('should return overcapacity staff only', async () => {
    (dataSourceMock.query as jest.Mock)
      .mockResolvedValueOnce([sampleResult[0]]) // only overcapacity
      .mockResolvedValueOnce([{ count: '1' }]);

    const result = await staffService.getStaffs(1, 10, Filter.OVERCAPACITY, SortBy.ASSIGNMENT, SortByDirection.DESC);

    expect(result.count).toBe(1);
    expect(result.data[0].assignments).toBe(3);
  });

  it('should fallback to ASC if invalid sort direction is given', async () => {
    (dataSourceMock.query as jest.Mock)
      .mockResolvedValueOnce(sampleResult)
      .mockResolvedValueOnce(sampleCount);

    const result = await staffService.getStaffs(1, 10, null, SortBy.NAME, 'invalid' as any);

    expect(result.page).toBe(1);
    expect(result.data.length).toBeGreaterThan(0);
  });

  it('should handle pagination correctly', async () => {
    (dataSourceMock.query as jest.Mock)
      .mockResolvedValueOnce(sampleResult)
      .mockResolvedValueOnce(sampleCount);

    const result = await staffService.getStaffs(2, 5, null, SortBy.ID, SortByDirection.ASC);

    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(5);
  });

  it('should throw and log error if query fails', async () => {
    (dataSourceMock.query as jest.Mock).mockImplementation(() => {
      throw new Error('Database error');
    });

    await expect(
      staffService.getStaffs(1, 10, null, SortBy.ID, SortByDirection.ASC),
    ).rejects.toThrow('Failed to fetch staff: Database error');

    expect(loggerServiceMock.error).toHaveBeenCalled();
  });

   it('should throw error on invalid staffId', async () => {
    await expect(
      staffService.getApplicationsByStaff(1, 10, SortBy.ID, SortByDirection.ASC, 0),
    ).rejects.toThrow('Invalid staffId');
  });

  it('should throw error on invalid page or pageSize', async () => {
    await expect(
      staffService.getApplicationsByStaff(0, 0, SortBy.ID, SortByDirection.ASC, 1),
    ).rejects.toThrow('Invalid page or pageSize value');
  });

  it('should return application data and sort by address', async () => {
    const mockAppParticipant = {
      id: 1,
      applicationId: 123,
      participantRoleId: 2,
      participantRole: { description: 'Supervisor' },
      application: { siteId: 45 },
      effectiveStartDate: '2024-01-01',
      effectiveEndDate: '2024-12-31',
    };

    const mockQueryBuilder: any = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockAppParticipant], 1]),
    };

    (applicationParticRepo.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

    (siteServiceMock.getSiteById as jest.Mock).mockResolvedValue({
      findSiteBySiteId: {
        data: {
          addrLine_1: '123 Main St',
          addrLine_2: '',
          addrLine_3: '',
          addrLine_4: '',
        },
      },
    });

    const result = await staffService.getApplicationsByStaff(1, 10, SortBy.SITE_ADDRESS, SortByDirection.ASC, 1);

    expect(result.data).toHaveLength(1);
    expect(result.data[0].siteAddress).toContain('123 Main St');
    expect(result.count).toBe(1);
    expect(siteServiceMock.getSiteById).toHaveBeenCalledWith('45');
  });

  it('should sort by role if specified', async () => {
    const mockAppParticipant = {
      id: 1,
      applicationId: 222,
      participantRoleId: 2,
      participantRole: { description: 'Inspector' },
      application: { siteId: 10 },
      effectiveStartDate: '2024-01-01',
      effectiveEndDate: '2024-12-31',
    };

    const mockQueryBuilder: any = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockAppParticipant], 1]),
    };

    (applicationParticRepo.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

    (siteServiceMock.getSiteById as jest.Mock).mockResolvedValue({
      findSiteBySiteId: {
        data: {
          addrLine_1: '456 Elm St',
          addrLine_2: '',
          addrLine_3: '',
          addrLine_4: '',
        },
      },
    });

    const result = await staffService.getApplicationsByStaff(1, 10, SortBy.ROLE, SortByDirection.DESC, 1, 2);

    expect(result.data[0].roleDescription).toBe('Inspector');
    expect(result.count).toBe(1);
  });

  it('should handle and log internal errors', async () => {
    (applicationParticRepo.createQueryBuilder as jest.Mock).mockImplementation(() => {
      throw new Error('Internal failure');
    });

    await expect(
      staffService.getApplicationsByStaff(1, 10, SortBy.ID, SortByDirection.ASC, 1),
    ).rejects.toThrow('Failed to fetch staff applications: Internal failure');

    expect(loggerServiceMock.error).toHaveBeenCalled();
  });
  
});
