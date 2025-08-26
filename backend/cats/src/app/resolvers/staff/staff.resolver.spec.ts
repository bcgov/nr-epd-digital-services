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
import { ViewApplication } from '../../dto/application/viewApplication.dto';

describe('StaffResolver', () => {
  let resolver: StaffResolver;
  let staffService: StaffService;
  let loggerService: LoggerService;
  let personResponse: GenericResponseProvider<ViewStaff[]>;
  let applicationResponse: GenericResponseProvider<ViewApplication[]>;

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
    personResponse = module.get<GenericResponseProvider<ViewStaff[]>>(
      GenericResponseProvider,
    );
    applicationResponse = module.get<
      GenericResponseProvider<ViewApplication[]>
    >(GenericResponseProvider);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return staff records when found', async () => {
      const mockStaffData = [
        { id: 1, name: 'John Doe', assignment: 3, capacity: 10 },
        { id: 2, name: 'Jane Smith', assignment: 5, capacity: 10 },
      ];

      staffService.getStaffs = jest.fn().mockResolvedValue({
        data: mockStaffData,
        count: mockStaffData.length,
      });

      const result = await resolver.findAll(
        1,
        5,
        Filter.ALL,
        SortBy.NAME,
        SortByDirection.ASC,
      );

      expect(staffService.getStaffs).toHaveBeenCalledWith(
        1,
        5,
        Filter.ALL,
        SortBy.NAME,
        SortByDirection.ASC,
      );
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

      const result = await resolver.findAll(
        1,
        5,
        Filter.ALL,
        SortBy.ID,
        SortByDirection.ASC,
      );

      expect(staffService.getStaffs).toHaveBeenCalledWith(
        1,
        5,
        Filter.ALL,
        SortBy.ID,
        SortByDirection.ASC,
      );
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
        { id: 1, name: 'John Doe', assignment: 3, capacity: 10 },
      ];

      staffService.getStaffs = jest.fn().mockResolvedValue({
        data: mockStaffData,
        count: mockStaffData.length,
      });

      await resolver.findAll(
        1,
        5,
        Filter.ALL,
        SortBy.NAME,
        SortByDirection.ASC,
      );

      expect(loggerService.log).toHaveBeenCalledWith(
        'StaffResolver.getStaffs() RES:200 start',
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        `page: 1, pageSize: 5, filter: ${Filter.ALL.toLowerCase()}, sortBy: ${SortBy.NAME.toLowerCase()}, sortByDir: ${SortByDirection.ASC}`,
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        'StaffResolver.getStaffs() RES:200 end',
      );
    });

    it('should return error response if staffService fails', async () => {
      staffService.getStaffs = jest
        .fn()
        .mockRejectedValue(new Error('Database Error'));

      await expect(
        resolver.findAll(1, 5, Filter.ALL, SortBy.NAME, SortByDirection.ASC),
      ).rejects.toThrow('Failed to fetch staff: Database Error');
    });

    it('should handle unexpected errors gracefully', async () => {
      staffService.getStaffs = jest
        .fn()
        .mockRejectedValue(new Error('Unexpected Error'));

      await expect(
        resolver.findAll(1, 5, Filter.ALL, SortBy.NAME, SortByDirection.ASC),
      ).rejects.toThrow('Failed to fetch staff: Unexpected Error');
    });
  });

  describe('getApplicationsByStaff', () => {
    it('should return application records when found', async () => {
      const mockApplications = [
        {
          applicationId: 101,
          siteAddress: '123 Main St',
          role: 'Inspector',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        },
        {
          applicationId: 102,
          siteAddress: '456 Market Ave',
          role: 'Supervisor',
          startDate: '2024-06-01',
          endDate: '2024-12-01',
        },
      ];

      staffService.getApplicationsByStaff = jest.fn().mockResolvedValue({
        data: mockApplications,
        count: mockApplications.length,
      });

      const result = await resolver.getApplicationsByStaff(
        1,
        5,
        SortBy.ID,
        SortByDirection.ASC,
        1,
        2,
      );

      expect(staffService.getApplicationsByStaff).toHaveBeenCalledWith(
        1,
        5,
        SortBy.ID,
        SortByDirection.ASC,
        1,
        2,
      );
      expect(result).toEqual({
        message: 'Application records fetched successfully',
        httpStatusCode: HttpStatus.OK,
        success: true,
        data: mockApplications,
        timestamp: expect.any(String),
      });
    });

    it('should return not found response when no application records exist', async () => {
      staffService.getApplicationsByStaff = jest.fn().mockResolvedValue({
        data: [],
        count: 0,
      });

      const result = await resolver.getApplicationsByStaff(
        1,
        5,
        SortBy.ID,
        SortByDirection.ASC,
        1,
      );

      expect(staffService.getApplicationsByStaff).toHaveBeenCalledWith(
        1,
        5,
        SortBy.ID,
        SortByDirection.ASC,
        1,
        undefined,
      );
      expect(result).toEqual({
        message: 'No application records found',
        httpStatusCode: HttpStatus.NOT_FOUND,
        success: false,
        data: [],
        timestamp: expect.any(String),
      });
    });

    it('should log appropriate messages', async () => {
      const mockApplications = [
        {
          applicationId: 103,
          siteAddress: '789 Broadway Blvd',
          role: 'Auditor',
          startDate: '2024-05-01',
          endDate: '2024-11-30',
        },
      ];

      staffService.getApplicationsByStaff = jest.fn().mockResolvedValue({
        data: mockApplications,
        count: mockApplications.length,
      });

      await resolver.getApplicationsByStaff(
        1,
        5,
        SortBy.ID,
        SortByDirection.ASC,
        1,
        3,
      );

      expect(loggerService.log).toHaveBeenCalledWith(
        'StaffResolver.getApplicationsByStaff() RES:200 start',
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        `personId: 1, roleId: 3, page: 1, pageSize: 5, sortBy: ${SortBy.ID.toLowerCase()}, sortByDir: ${SortByDirection.ASC}`,
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        'StaffResolver.getApplicationsByStaff() RES:200 end',
      );
    });

    it('should throw an error if service fails', async () => {
      staffService.getApplicationsByStaff = jest
        .fn()
        .mockRejectedValue(new Error('Service failure'));

      await expect(
        resolver.getApplicationsByStaff(
          1,
          5,
          SortBy.ID,
          SortByDirection.ASC,
          1,
        ),
      ).rejects.toThrow('Failed to fetch applications: Service failure');
    });
  });
});
