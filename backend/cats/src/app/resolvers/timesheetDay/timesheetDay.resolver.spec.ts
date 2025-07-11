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
      expect(service.getTimesheetDaysForAssignedStaff).toHaveBeenCalledWith(
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
  });
});
