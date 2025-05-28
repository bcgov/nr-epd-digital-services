import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from './staff.service';
import { DataSource } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { Filter } from '../../utilities/enums/application/filter.enum';
import { SortBy } from '../../utilities/enums/staff/sortBy.enum';
import { SortByDirection } from '../../utilities/enums/application/sortByDirection.enum';

describe('StaffService', () => {
  let staffService: StaffService;
  let dataSourceMock: Partial<DataSource>;
  let loggerServiceMock: Partial<LoggerService>;

  beforeEach(async () => {
    dataSourceMock = {
      query: jest.fn(),
    };

    loggerServiceMock = {
      log: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        { provide: DataSource, useValue: dataSourceMock },
        { provide: LoggerService, useValue: loggerServiceMock },
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

    const result = await staffService.getStaffs(
      1,
      10,
      null,
      SortBy.NAME,
      SortByDirection.ASC,
    );

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

    const result = await staffService.getStaffs(
      1,
      10,
      Filter.UNASSIGNED,
      SortBy.ID,
      SortByDirection.ASC,
    );

    expect(result.count).toBe(1);
    expect(result.data[0].assignments).toBe(0);
  });

  it('should return overcapacity staff only', async () => {
    (dataSourceMock.query as jest.Mock)
      .mockResolvedValueOnce([sampleResult[0]]) // only overcapacity
      .mockResolvedValueOnce([{ count: '1' }]);

    const result = await staffService.getStaffs(
      1,
      10,
      Filter.OVERCAPACITY,
      SortBy.ASSIGNMENT,
      SortByDirection.DESC,
    );

    expect(result.count).toBe(1);
    expect(result.data[0].assignments).toBe(3);
  });

  it('should fallback to ASC if invalid sort direction is given', async () => {
    (dataSourceMock.query as jest.Mock)
      .mockResolvedValueOnce(sampleResult)
      .mockResolvedValueOnce(sampleCount);

    const result = await staffService.getStaffs(
      1,
      10,
      null,
      SortBy.NAME,
      'invalid' as any,
    );

    expect(result.page).toBe(1);
    expect(result.data.length).toBeGreaterThan(0);
  });

  it('should handle pagination correctly', async () => {
    (dataSourceMock.query as jest.Mock)
      .mockResolvedValueOnce(sampleResult)
      .mockResolvedValueOnce(sampleCount);

    const result = await staffService.getStaffs(
      2,
      5,
      null,
      SortBy.ID,
      SortByDirection.ASC,
    );

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
});
