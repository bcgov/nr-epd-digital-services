import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimesheetDayService } from './timesheetDay.service';
import { TimesheetDay } from '../entities/timesheetDay.entity';
import { Application } from '../entities/application.entity';
import { Person } from '../entities/person.entity';
import { LoggerService } from '../logger/logger.service';
import { TimesheetDayUpsertInputDto } from '../dto/timesheetDay.dto';
import { HttpException } from '@nestjs/common';
import { StaffAssignmentService } from './assignment/staffAssignment.service';

describe('TimesheetDayService', () => {
  let service: TimesheetDayService;
  let timesheetDayRepository: Repository<TimesheetDay>;
  let applicationRepository: Repository<Application>;
  let personRepository: Repository<Person>;
  let logger: LoggerService;
  let staffAssignmentService: StaffAssignmentService;

  const mockUser = { name: 'Test User' };
  const mockApplication = { id: 1 } as Application;
  const mockPerson = { id: 2 } as Person;
  const mockTimesheetDay = {
    id: 10,
    applicationId: 1,
    personId: 2,
    date: '2025-06-01',
    hours: '8',
    rowVersionCount: 0,
    createdBy: 'Test User',
    createdDateTime: new Date(),
    updatedBy: 'Test User',
    updatedDateTime: new Date(),
    ts: Buffer.from(''),
  } as TimesheetDay;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimesheetDayService,
        { provide: getRepositoryToken(TimesheetDay), useClass: Repository },
        { provide: getRepositoryToken(Application), useClass: Repository },
        { provide: getRepositoryToken(Person), useClass: Repository },
        {
          provide: LoggerService,
          useValue: { log: jest.fn(), error: jest.fn() },
        },
        {
          provide: StaffAssignmentService,
          useValue: { getStaffByAppId: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<TimesheetDayService>(TimesheetDayService);
    timesheetDayRepository = module.get<Repository<TimesheetDay>>(
      getRepositoryToken(TimesheetDay),
    );
    applicationRepository = module.get<Repository<Application>>(
      getRepositoryToken(Application),
    );
    personRepository = module.get<Repository<Person>>(
      getRepositoryToken(Person),
    );
    logger = module.get<LoggerService>(LoggerService);
    staffAssignmentService = module.get<StaffAssignmentService>(
      StaffAssignmentService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upsertTimesheetDays', () => {
    it('should create new timesheet day entries', async () => {
      const input: TimesheetDayUpsertInputDto[] = [
        { applicationId: 1, personId: 2, date: '2025-06-01', hours: 8 },
      ];
      jest
        .spyOn(applicationRepository, 'findOne')
        .mockResolvedValue(mockApplication);
      jest.spyOn(personRepository, 'findOne').mockResolvedValue(mockPerson);
      jest
        .spyOn(timesheetDayRepository, 'create')
        .mockReturnValue(mockTimesheetDay);
      jest
        .spyOn(timesheetDayRepository, 'save')
        .mockResolvedValue(mockTimesheetDay);

      const result = await service.upsertTimesheetDays(input, mockUser);
      expect(result).toHaveLength(1);
      expect(timesheetDayRepository.create).toHaveBeenCalled();
      expect(timesheetDayRepository.save).toHaveBeenCalled();
    });

    it('should update existing timesheet day entries', async () => {
      const input: TimesheetDayUpsertInputDto[] = [
        {
          timesheetDayId: 10,
          applicationId: 1,
          personId: 2,
          date: '2025-06-01',
          hours: 8,
        },
      ];
      jest
        .spyOn(applicationRepository, 'findOne')
        .mockResolvedValue(mockApplication);
      jest.spyOn(personRepository, 'findOne').mockResolvedValue(mockPerson);
      jest
        .spyOn(timesheetDayRepository, 'findOne')
        .mockResolvedValue(mockTimesheetDay);
      jest
        .spyOn(timesheetDayRepository, 'save')
        .mockResolvedValue(mockTimesheetDay);

      const result = await service.upsertTimesheetDays(input, mockUser);
      expect(result).toHaveLength(1);
      expect(timesheetDayRepository.save).toHaveBeenCalled();
    });

    it('should throw if application not found', async () => {
      const input: TimesheetDayUpsertInputDto[] = [
        { applicationId: 999, personId: 2, date: '2025-06-01', hours: 8 },
      ];
      jest.spyOn(applicationRepository, 'findOne').mockResolvedValue(undefined);
      await expect(
        service.upsertTimesheetDays(input, mockUser),
      ).rejects.toThrow(HttpException);
    });

    it('should throw if person not found', async () => {
      const input: TimesheetDayUpsertInputDto[] = [
        { applicationId: 1, personId: 999, date: '2025-06-01', hours: 8 },
      ];
      jest
        .spyOn(applicationRepository, 'findOne')
        .mockResolvedValue(mockApplication);
      jest.spyOn(personRepository, 'findOne').mockResolvedValue(undefined);
      await expect(
        service.upsertTimesheetDays(input, mockUser),
      ).rejects.toThrow(HttpException);
    });

    it('should throw if updating non-existent timesheet day', async () => {
      const input: TimesheetDayUpsertInputDto[] = [
        {
          timesheetDayId: 999,
          applicationId: 1,
          personId: 2,
          date: '2025-06-01',
          hours: 8,
        },
      ];
      jest
        .spyOn(applicationRepository, 'findOne')
        .mockResolvedValue(mockApplication);
      jest.spyOn(personRepository, 'findOne').mockResolvedValue(mockPerson);
      jest
        .spyOn(timesheetDayRepository, 'findOne')
        .mockResolvedValue(undefined);
      await expect(
        service.upsertTimesheetDays(input, mockUser),
      ).rejects.toThrow(HttpException);
    });

    it('should throw validation errors if input is missing required fields', async () => {
      const input: TimesheetDayUpsertInputDto[] = [{} as any];
      await expect(
        service.upsertTimesheetDays(input, mockUser),
      ).rejects.toThrow(HttpException);
      try {
        await service.upsertTimesheetDays(input, mockUser);
      } catch (e) {
        const errors = e.getResponse().errors;
        expect(errors).toContain('Application ID is required');
        expect(errors).toContain('Person ID is required');
        expect(errors).toContain('Date is required');
      }
    });
  });

  describe('getTimesheetDaysForAssignedStaff', () => {
    it('should return timesheet days for assigned staff', async () => {
      const mockStaffList = [
        {
          id: 1,
          applicationId: 1,
          personId: 2,
          roleId: 1,
          startDate: new Date(),
          endDate: new Date(),
          currentCapacity: 0,
        },
      ];
      const mockStaffResult = {
        applicationServiceTypeId: null,
        staffList: mockStaffList,
      };
      const mockPerson = {
        id: 2,
        firstName: 'John',
        lastName: 'Doe',
        middleName: null,
        loginUserName: 'jdoe',
        email: 'jdoe@example.com',
      };
      const mockTimesheetDay = {
        id: 1,
        applicationId: 1,
        personId: 2,
        date: '2025-06-01',
        hours: '8',
      };
      jest
        .spyOn(staffAssignmentService, 'getStaffByAppId')
        .mockResolvedValue(mockStaffResult);
      jest
        .spyOn(personRepository, 'findByIds')
        .mockResolvedValue([mockPerson] as any);
      jest
        .spyOn(timesheetDayRepository, 'find')
        .mockResolvedValue([mockTimesheetDay] as any);
      const result = await service.getTimesheetDaysForAssignedStaff(
        1,
        '2025-06-01',
        '2025-06-30',
        mockUser,
      );
      expect(result).toHaveLength(1);
      expect(result[0].personId).toBe(2);
      expect(result[0].timesheetDays).toHaveLength(1);
      expect(staffAssignmentService.getStaffByAppId).toHaveBeenCalled();
      expect(personRepository.findByIds).toHaveBeenCalled();
      expect(timesheetDayRepository.find).toHaveBeenCalled();
    });
    it('should return empty array if no staff assigned', async () => {
      const mockStaffList = [{ personId: 2 }];
      const mockStaffResult = {
        applicationServiceTypeId: null,
        staffList: mockStaffList,
      };
      jest
        .spyOn(staffAssignmentService, 'getStaffByAppId')
        .mockResolvedValue({ applicationServiceTypeId: null, staffList: [] });
      const result = await service.getTimesheetDaysForAssignedStaff(
        1,
        '2025-06-01',
        '2025-06-30',
        mockUser,
      );
      expect(result).toEqual([]);
    });
    it('should throw and log error on failure', async () => {
      jest
        .spyOn(staffAssignmentService, 'getStaffByAppId')
        .mockRejectedValue(new Error('Test error'));
      await expect(
        service.getTimesheetDaysForAssignedStaff(
          1,
          '2025-06-01',
          '2025-06-30',
          mockUser,
        ),
      ).rejects.toThrow('Test error');
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
