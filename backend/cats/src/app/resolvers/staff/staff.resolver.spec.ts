import { Test, TestingModule } from '@nestjs/testing';
import { StaffResolver } from './staff.resolver';
import { StaffService } from '../../services/staff/staff.service';
import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { ViewStaff } from '../../dto/staff/viewStaff.dto';
import { HttpStatus } from '@nestjs/common';
import { Filter } from '../../utilities/enums/application/filter.enum';
import { SortBy } from '../../utilities/enums/staff/sortBy.enum';
import { SortByDirection } from '../../utilities/enums/application/sortByDirection.enum';

describe('StaffResolver', () => {
  let resolver: StaffResolver;
  let staffService: StaffService;
  let loggerService: LoggerService;
  let personResponse: GenericResponseProvider<ViewStaff[]>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffResolver,
        {
          provide: StaffService,
          useValue: {
            getStaffs: jest.fn(),
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
            createPagedResponse: jest.fn().mockImplementation((response) => ({
                message: response.message,
                httpStatusCode: response.httpStatusCode,
                success: response.success,
                data: response.data,
                timestamp: expect.any(String),
            })),
          },
        },
      ],
    }).compile();

    resolver = module.get<StaffResolver>(StaffResolver);
    staffService = module.get<StaffService>(StaffService);
    loggerService = module.get<LoggerService>(LoggerService);
    personResponse = module.get<GenericResponseProvider<ViewStaff[]>>(GenericResponseProvider);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return staff records when found', async () => {
      const mockStaffData = [
        { id: 1, name: 'John Doe', assignment: 3, capacity: 10},
        { id: 2, name: 'Jane Smith', assignment: 5, capacity: 10},
      ];

      staffService.getStaffs = jest.fn().mockResolvedValue({
        data: mockStaffData,
        count: mockStaffData.length,
      });

      const result = await resolver.findAll(1, 5, Filter.ALL, SortBy.NAME, SortByDirection.ASC);

      expect(staffService.getStaffs).toHaveBeenCalledWith(1, 5, Filter.ALL, SortBy.NAME, SortByDirection.ASC);
      expect(result).toEqual({
        message: 'Staff records fetched successfully',
        httpStatusCode: HttpStatus.OK,
        success: true,
        data: [
            {
            id: 1,
            name: 'John Doe',
            assignment: 3,
            capacity: 10,
            },
            {
            id: 2,
            name: 'Jane Smith',
            assignment: 5,
            capacity: 10,
            },
        ],
        timestamp: expect.any(String),
        });
    });

    it('should return not found response when no staff records exist', async () => {
      staffService.getStaffs = jest.fn().mockResolvedValue({
        data: [],
        count: 0,
      });

      const result = await resolver.findAll(1, 5, Filter.ALL, SortBy.ID, SortByDirection.ASC);

      expect(staffService.getStaffs).toHaveBeenCalledWith(1, 5, Filter.ALL, SortBy.ID, SortByDirection.ASC);
      expect(result).toEqual({
        message: 'No staff records found',
        httpStatusCode: HttpStatus.NOT_FOUND,
        success: false,
        data: [],
        timestamp: expect.any(String),
      });
    });

    it('should log a success message when staff records are fetched successfully', async () => {
      const mockStaffData = [
        { id: 1, name: 'John Doe', assignment: 3, capacity: 10},
      ];

      staffService.getStaffs = jest.fn().mockResolvedValue({
        data: mockStaffData,
        count: mockStaffData.length,
      });

      await resolver.findAll(1, 5, Filter.ALL, SortBy.NAME, SortByDirection.ASC);

      expect(loggerService.log).toHaveBeenCalledWith('StaffResolver.getStaffs() RES:200 start');
      expect(loggerService.log).toHaveBeenCalledWith(
        `page: 1, pageSize: 5, filter: ${Filter.ALL.toLowerCase()}, sortBy: ${SortBy.NAME.toLowerCase()}, sortByDir: ${SortByDirection.ASC}`
      );
      expect(loggerService.log).toHaveBeenCalledWith('StaffResolver.getStaffs() RES:200 end');
    });

   it('should return error response if staffService fails', async () => {
        staffService.getStaffs = jest.fn().mockRejectedValue(new Error('Database Error'));

        await expect(
            resolver.findAll(1, 5, Filter.ALL, SortBy.NAME, SortByDirection.ASC)
        ).rejects.toThrow('Failed to fetch staff: Database Error');
    });

  it('should handle unexpected errors gracefully', async () => {
    staffService.getStaffs = jest.fn().mockRejectedValue(new Error('Unexpected Error'));

    await expect(
        resolver.findAll(1, 5, Filter.ALL, SortBy.NAME, SortByDirection.ASC)
    ).rejects.toThrow('Failed to fetch staff: Unexpected Error');
    });

  });
});
