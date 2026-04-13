import { Test, TestingModule } from '@nestjs/testing';
import { TimesheetDayResolver } from './timesheetDay.resolver';
import { TimesheetDayService } from '../../services/timesheetDay/timesheetDay.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { LoggerService } from '../../logger/logger.service';
import { HttpStatus } from '@nestjs/common';
import {
  UpsertTimesheetDaysInputDto,
  TimesheetDayDto,
  PersonWithTimesheetDaysDto,
} from '../../dto/timesheetDay.dto';

describe('TimesheetDayResolver', () => {
  let resolver: TimesheetDayResolver;
  let service: TimesheetDayService;
  let responseProvider: GenericResponseProvider<any>;
  let logger: LoggerService;

  const mockUser = { name: 'Test User' };
  const mockTimesheetData: TimesheetDayDto[] = [
    {
      id: 1,
      applicationId: 1,
      personId: 2,
      date: new Date('2025-06-01'),
      hours: 8,
    },
  ];

  const mockPersonWithTimesheetData: PersonWithTimesheetDaysDto[] = [
    {
      personId: 2,
      firstName: 'John',
      lastName: 'Doe',
      email: 'jdoe@example.com',
      allTimeHours: 0,
      weekHours: 0,
      timesheetDays: [
        {
          id: 1,
          applicationId: 1,
          personId: 2,
          date: new Date('2025-06-01'),
          hours: 8,
        },
      ],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimesheetDayResolver,
        {
          provide: TimesheetDayService,
          useValue: {
            upsertTimesheetDays: jest.fn(),
            getTimesheetDaysForAssignedStaff: jest.fn(),
          },
        },
        {
          provide: GenericResponseProvider,
          useValue: {
            createResponse: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<TimesheetDayResolver>(TimesheetDayResolver);
    service = module.get<TimesheetDayService>(TimesheetDayService);
    responseProvider = module.get<GenericResponseProvider<any>>(
      GenericResponseProvider,
    );
    logger = module.get<LoggerService>(LoggerService);
  });

  describe('upsertTimesheetDays', () => {
    it('should call service and return success response', async () => {
      const input: UpsertTimesheetDaysInputDto = {
        entries: [
          { applicationId: 1, personId: 2, date: '2025-06-01', hours: 8 },
        ],
      };
      jest
        .spyOn(service, 'upsertTimesheetDays')
        .mockResolvedValue(mockTimesheetData as any);

      const result = await resolver.upsertTimesheetDays(input, mockUser);
      expect(service.upsertTimesheetDays).toHaveBeenCalledWith(
        input.entries,
        mockUser,
      );
      expect(result).toEqual(
        expect.objectContaining({
          message: 'Timesheet days upserted successfully',
          httpStatusCode: HttpStatus.CREATED,
          success: true,
          data: mockTimesheetData,
        }),
      );
    });

    it('should return error response on failure', async () => {
      const input: UpsertTimesheetDaysInputDto = {
        entries: [
          { applicationId: 1, personId: 2, date: '2025-06-01', hours: 8 },
        ],
      };
      jest
        .spyOn(service, 'upsertTimesheetDays')
        .mockRejectedValue(new Error('Test error'));

      const result = await resolver.upsertTimesheetDays(input, mockUser);
      expect(service.upsertTimesheetDays).toHaveBeenCalledWith(
        input.entries,
        mockUser,
      );
      expect(result).toEqual(
        expect.objectContaining({
          message: 'Test error',
          httpStatusCode: HttpStatus.BAD_REQUEST,
          success: false,
          data: [],
        }),
      );
    });
  });

  describe('getTimesheetDaysForAssignedStaff', () => {
    it('should call service and return success response', async () => {
      jest
        .spyOn(service, 'getTimesheetDaysForAssignedStaff')
        .mockResolvedValue(mockPersonWithTimesheetData as any);
      const result = await resolver.getTimesheetDaysForAssignedStaff(
        1,
        '2025-06-01',
        '2025-06-30',
        mockUser,
      );
      expect(service.getTimesheetDaysForAssignedStaff).toHaveBeenCalledWith(
        1,
        '2025-06-01',
        '2025-06-30',
        mockUser,
      );
      expect(result).toEqual(
        expect.objectContaining({
          message: 'Fetched timesheet days for assigned staff',
          httpStatusCode: HttpStatus.OK,
          success: true,
          data: mockPersonWithTimesheetData,
        }),
      );
    });

    it('should return error response on failure', async () => {
      jest
        .spyOn(service, 'getTimesheetDaysForAssignedStaff')
        .mockRejectedValue(new Error('Test error'));
      const result = await resolver.getTimesheetDaysForAssignedStaff(
        1,
        '2025-06-01',
        '2025-06-30',
        mockUser,
      );
      expect(result).toEqual(
        expect.objectContaining({
          message: 'Test error',
          httpStatusCode: HttpStatus.BAD_REQUEST,
          success: false,
          data: [],
        }),
      );
    });

    it('should return weekHours and allTimeHours on each person row', async () => {
      // Verifies the resolver passes through the new weekHours/allTimeHours fields
      // that the service now returns per (personId, roleId) assignment.
      const dataWithHours: PersonWithTimesheetDaysDto[] = [
        {
          personId: 1,
          firstName: 'Alice',
          lastName: 'Smith',
          roleId: 10,
          roleDescription: 'Caseworker',
          weekHours: 8,
          allTimeHours: 40,
          timesheetDays: [],
        },
        {
          personId: 1,
          firstName: 'Alice',
          lastName: 'Smith',
          roleId: 11,
          roleDescription: 'Mentor',
          weekHours: 8,
          allTimeHours: 40,
          timesheetDays: [],
        },
      ];
      jest
        .spyOn(service, 'getTimesheetDaysForAssignedStaff')
        .mockResolvedValue(dataWithHours as any);

      const result = await resolver.getTimesheetDaysForAssignedStaff(
        1, '2025-06-01', '2025-06-07', mockUser,
      );

      expect(result.data).toHaveLength(2);
      expect(result.data[0].weekHours).toBe(8);
      expect(result.data[0].allTimeHours).toBe(40);
      expect(result.data[1].roleDescription).toBe('Mentor');
    });

    it('should return two rows when same person has two roles', async () => {
      // Same person (personId=1) assigned as both Caseworker and Mentor.
      // Resolver should pass both rows through unchanged.
      const twoRoleData: PersonWithTimesheetDaysDto[] = [
        { personId: 1, firstName: 'Sam', lastName: 'Green', roleId: 10, roleDescription: 'Caseworker', weekHours: 5, allTimeHours: 20, timesheetDays: [] },
        { personId: 1, firstName: 'Sam', lastName: 'Green', roleId: 11, roleDescription: 'Mentor',     weekHours: 5, allTimeHours: 20, timesheetDays: [] },
      ];
      jest.spyOn(service, 'getTimesheetDaysForAssignedStaff').mockResolvedValue(twoRoleData as any);

      const result = await resolver.getTimesheetDaysForAssignedStaff(1, '2025-06-01', '2025-06-07', mockUser);

      expect(result.data).toHaveLength(2);
      expect(result.data[0].roleId).toBe(10);
      expect(result.data[1].roleId).toBe(11);
    });

    it('should return two rows when two people share the same role', async () => {
      // Person 2 and Person 3 are both Caseworkers (roleId=10).
      const sharedRoleData: PersonWithTimesheetDaysDto[] = [
        { personId: 2, firstName: 'Alice', lastName: 'A', roleId: 10, roleDescription: 'Caseworker', weekHours: 3, allTimeHours: 15, timesheetDays: [] },
        { personId: 3, firstName: 'Bob',   lastName: 'B', roleId: 10, roleDescription: 'Caseworker', weekHours: 7, allTimeHours: 35, timesheetDays: [] },
      ];
      jest.spyOn(service, 'getTimesheetDaysForAssignedStaff').mockResolvedValue(sharedRoleData as any);

      const result = await resolver.getTimesheetDaysForAssignedStaff(1, '2025-06-01', '2025-06-07', mockUser);

      expect(result.data).toHaveLength(2);
      expect(result.data[0].personId).toBe(2);
      expect(result.data[1].personId).toBe(3);
      expect(result.data[0].weekHours).toBe(3);
      expect(result.data[1].weekHours).toBe(7);
    });

    it('should return empty data array when service returns empty list', async () => {
      jest.spyOn(service, 'getTimesheetDaysForAssignedStaff').mockResolvedValue([]);

      const result = await resolver.getTimesheetDaysForAssignedStaff(1, '2025-06-01', '2025-06-07', mockUser);

      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          data: [],
        }),
      );
    });

    it('should log the query parameters on entry', async () => {
      jest.spyOn(service, 'getTimesheetDaysForAssignedStaff').mockResolvedValue([]);

      await resolver.getTimesheetDaysForAssignedStaff(42, '2025-07-01', '2025-07-07', mockUser);

      expect(logger.log).toHaveBeenCalledWith(
        expect.stringContaining('applicationId=42'),
      );
    });

    it('should log error and return BAD_REQUEST when service throws without message', async () => {
      jest.spyOn(service, 'getTimesheetDaysForAssignedStaff').mockRejectedValue({});

      const result = await resolver.getTimesheetDaysForAssignedStaff(1, '2025-06-01', '2025-06-07', mockUser);

      expect(result).toEqual(
        expect.objectContaining({
          httpStatusCode: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to fetch timesheet days for assigned staff',
        }),
      );
    });
  });

  describe('upsertTimesheetDays — additional cases', () => {
    it('should map hours string to float in returned DTOs', async () => {
      // The resolver converts item.hours (string from entity) to parseFloat.
      // e.g. '8.50' → 8.5
      const rawResult = [
        { id: 1, applicationId: 1, personId: 2, date: '2025-06-01', hours: '8.50' },
      ];
      jest.spyOn(service, 'upsertTimesheetDays').mockResolvedValue(rawResult as any);

      const input: UpsertTimesheetDaysInputDto = {
        entries: [{ applicationId: 1, personId: 2, date: '2025-06-01', hours: 8.5 }],
      };
      const result = await resolver.upsertTimesheetDays(input, mockUser);

      expect(result.data[0].hours).toBe(8.5);
    });

    it('should default hours to 0 when entity hours is null', async () => {
      // If a timesheet day has null hours, the resolver should return 0 not NaN.
      const rawResult = [
        { id: 2, applicationId: 1, personId: 2, date: '2025-06-02', hours: null },
      ];
      jest.spyOn(service, 'upsertTimesheetDays').mockResolvedValue(rawResult as any);

      const input: UpsertTimesheetDaysInputDto = {
        entries: [{ applicationId: 1, personId: 2, date: '2025-06-02', hours: null }],
      };
      const result = await resolver.upsertTimesheetDays(input, mockUser);

      expect(result.data[0].hours).toBe(0);
    });

    it('should log error and return BAD_REQUEST when service throws without message', async () => {
      jest.spyOn(service, 'upsertTimesheetDays').mockRejectedValue({});

      const input: UpsertTimesheetDaysInputDto = { entries: [] };
      const result = await resolver.upsertTimesheetDays(input, mockUser);

      expect(result).toEqual(
        expect.objectContaining({
          httpStatusCode: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to upsert timesheet days',
        }),
      );
    });

    it('should log success with correct count after upsert', async () => {
      const rawResult = [
        { id: 1, applicationId: 1, personId: 2, date: '2025-06-01', hours: '4' },
        { id: 2, applicationId: 1, personId: 2, date: '2025-06-02', hours: '4' },
      ];
      jest.spyOn(service, 'upsertTimesheetDays').mockResolvedValue(rawResult as any);

      const input: UpsertTimesheetDaysInputDto = {
        entries: [
          { applicationId: 1, personId: 2, date: '2025-06-01', hours: 4 },
          { applicationId: 1, personId: 2, date: '2025-06-02', hours: 4 },
        ],
      };
      await resolver.upsertTimesheetDays(input, mockUser);

      expect(logger.log).toHaveBeenCalledWith(
        expect.stringContaining('2'),
      );
    });
  });
});
