import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimesheetDayService } from './timesheetDay.service';
import { TimesheetDay } from '../../entities/timesheetDay.entity';
import { Application } from '../../entities/application.entity';
import { Person } from '../../entities/person.entity';
import { LoggerService } from '../../logger/logger.service';
import { TimesheetDayUpsertInputDto } from '../../dto/timesheetDay.dto';
import { HttpException } from '@nestjs/common';
import { StaffAssignmentService } from '../assignment/staffAssignment.service';
import { ParticipantRole } from '../../entities/participantRole.entity';
import { AppParticipant } from '../../entities/appParticipant.entity';
import { ConfigService } from '@nestjs/config';

describe('TimesheetDayService', () => {
  let service: TimesheetDayService;
  let timesheetDayRepository: Repository<TimesheetDay>;
  let applicationRepository: Repository<Application>;
  let personRepository: Repository<Person>;
  let participantRoleRepository: Repository<ParticipantRole>;
  let logger: LoggerService;
  let staffAssignmentService: StaffAssignmentService;
  let appParticipantRepository: Repository<AppParticipant>;
  let configService: ConfigService;

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
          provide: getRepositoryToken(ParticipantRole),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AppParticipant),
          useClass: Repository,
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
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
    participantRoleRepository = module.get<Repository<ParticipantRole>>(
      getRepositoryToken(ParticipantRole),
    );
    appParticipantRepository = module.get<Repository<AppParticipant>>(
      getRepositoryToken(AppParticipant),
    );
    configService = module.get<ConfigService>(ConfigService);
    logger = module.get<LoggerService>(LoggerService);
    staffAssignmentService = module.get<StaffAssignmentService>(
      StaffAssignmentService,
    );

    jest.spyOn(staffAssignmentService, 'getStaffByAppId').mockResolvedValue({
      applicationServiceTypeId: null,
      staffList: [
        { personId: 2, roleId: 1 },
        { personId: 3, roleId: 2 },
      ],
    } as any);
    jest.spyOn(configService, 'get').mockReturnValue(undefined);
    jest.spyOn(appParticipantRepository, 'find').mockResolvedValue([]);
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

    it('should accept hours exceeding 24', async () => {
      const input: TimesheetDayUpsertInputDto[] = [
        { applicationId: 1, personId: 2, date: '2025-06-01', hours: 25 },
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

    it('should accept negative hours', async () => {
      const input: TimesheetDayUpsertInputDto[] = [
        { applicationId: 1, personId: 2, date: '2025-06-01', hours: -1 },
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

    it('should accept valid hours values (0-24)', async () => {
      const input: TimesheetDayUpsertInputDto[] = [
        { applicationId: 1, personId: 2, date: '2025-06-01', hours: 0 },
        { applicationId: 1, personId: 2, date: '2025-06-02', hours: 8.5 },
        { applicationId: 1, personId: 2, date: '2025-06-03', hours: 24 },
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
      expect(result).toHaveLength(3);
      expect(timesheetDayRepository.create).toHaveBeenCalledTimes(3);
      expect(timesheetDayRepository.save).toHaveBeenCalledTimes(3);
    });

    it('should handle entries with comments', async () => {
      const input: TimesheetDayUpsertInputDto[] = [
        { applicationId: 1, personId: 2, date: '2025-06-01', hours: 8, comment: 'Worked on case review' },
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

    it('should handle entries with null hours', async () => {
      const input: TimesheetDayUpsertInputDto[] = [
        { applicationId: 1, personId: 2, date: '2025-06-01', hours: null },
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

    it('should handle multiple entries in one call', async () => {
      const input: TimesheetDayUpsertInputDto[] = [
        { applicationId: 1, personId: 2, date: '2025-06-01', hours: 8 },
        { applicationId: 1, personId: 3, date: '2025-06-02', hours: 6 },
      ];
      const mockPerson2 = { id: 3 } as Person;
      jest
        .spyOn(applicationRepository, 'findOne')
        .mockResolvedValue(mockApplication);
      jest.spyOn(personRepository, 'findOne')
        .mockResolvedValueOnce(mockPerson)
        .mockResolvedValueOnce(mockPerson2);
      jest
        .spyOn(timesheetDayRepository, 'create')
        .mockReturnValue(mockTimesheetDay);
      jest
        .spyOn(timesheetDayRepository, 'save')
        .mockResolvedValue(mockTimesheetDay);

      const result = await service.upsertTimesheetDays(input, mockUser);
      expect(result).toHaveLength(2);
      expect(timesheetDayRepository.create).toHaveBeenCalledTimes(2);
      expect(timesheetDayRepository.save).toHaveBeenCalledTimes(2);
    });

    it('should handle user without name', async () => {
      const input: TimesheetDayUpsertInputDto[] = [
        { applicationId: 1, personId: 2, date: '2025-06-01', hours: 8 },
      ];
      const userWithoutName = {};
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

      const result = await service.upsertTimesheetDays(input, userWithoutName);
      expect(result).toHaveLength(1);
      expect(timesheetDayRepository.create).toHaveBeenCalled();
      expect(timesheetDayRepository.save).toHaveBeenCalled();
    });

    it('should reject standard user edits when the application is ODM locked', async () => {
      const input: TimesheetDayUpsertInputDto[] = [
        { applicationId: 1, personId: 2, date: '2025-06-01', hours: 8 },
      ];
      const lockedApplication = {
        id: 1,
        appStatuses: [
          {
            isCurrent: true,
            statusType: {
              abbrev: 'ODM - Satisfactory',
            },
          },
        ],
      } as Application;
      jest
        .spyOn(applicationRepository, 'findOne')
        .mockResolvedValue(lockedApplication);
      jest.spyOn(personRepository, 'findOne').mockResolvedValue(mockPerson);

      await expect(
        service.upsertTimesheetDays(input, mockUser),
      ).rejects.toThrow('Timesheets are locked');
    });

    it('should allow CSSA manager edits when the application is ODM locked', async () => {
      const input: TimesheetDayUpsertInputDto[] = [
        { applicationId: 1, personId: 2, date: '2025-06-01', hours: 8 },
      ];
      const lockedApplication = {
        id: 1,
        appStatuses: [
          {
            isCurrent: true,
            statusType: {
              abbrev: 'ODM - Unatisfactory',
            },
          },
        ],
      } as Application;
      jest
        .spyOn(applicationRepository, 'findOne')
        .mockResolvedValue(lockedApplication);
      jest
        .spyOn(configService, 'get')
        .mockReturnValue('formsflow-reviewer/cssa-manager');
      jest.spyOn(personRepository, 'findOne').mockResolvedValue(mockPerson);
      jest
        .spyOn(timesheetDayRepository, 'create')
        .mockReturnValue(mockTimesheetDay);
      jest
        .spyOn(timesheetDayRepository, 'save')
        .mockResolvedValue(mockTimesheetDay);

      const result = await service.upsertTimesheetDays(input, {
        ...mockUser,
        role: [
          'formsflow-reviewer',
          'formsflow-reviewer/cssa-manager',
          'site-internal-user',
        ],
      });

      expect(result).toHaveLength(1);
      expect(timesheetDayRepository.save).toHaveBeenCalled();
    });

    it('should allow assigned SDM edits when the application is ODM locked', async () => {
      const input: TimesheetDayUpsertInputDto[] = [
        { applicationId: 1, personId: 2, date: '2025-06-01', hours: 8 },
      ];
      const lockedApplication = {
        id: 1,
        appStatuses: [
          {
            isCurrent: true,
            statusType: {
              abbrev: 'ODM - Satisfactory',
            },
          },
        ],
      } as Application;
      jest
        .spyOn(applicationRepository, 'findOne')
        .mockResolvedValue(lockedApplication);
      jest.spyOn(appParticipantRepository, 'find').mockResolvedValue([
        {
          participantRole: { abbrev: 'SDM' },
          person: { loginUserName: 'sdm.user' },
        },
      ] as any);
      jest.spyOn(personRepository, 'findOne').mockResolvedValue(mockPerson);
      jest
        .spyOn(timesheetDayRepository, 'create')
        .mockReturnValue(mockTimesheetDay);
      jest
        .spyOn(timesheetDayRepository, 'save')
        .mockResolvedValue(mockTimesheetDay);

      const result = await service.upsertTimesheetDays(input, {
        ...mockUser,
        preferred_username: 'sdm.user',
      });

      expect(result).toHaveLength(1);
      expect(timesheetDayRepository.save).toHaveBeenCalled();
    });

    it('should reject edits for people not assigned to the application', async () => {
      const input: TimesheetDayUpsertInputDto[] = [
        { applicationId: 1, personId: 999, date: '2025-06-01', hours: 8 },
      ];
      jest
        .spyOn(applicationRepository, 'findOne')
        .mockResolvedValue(mockApplication);
      jest.spyOn(personRepository, 'findOne').mockResolvedValue(mockPerson);

      await expect(
        service.upsertTimesheetDays(input, mockUser),
      ).rejects.toThrow('Time can only be entered for staff assigned');
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

      const mockParticipantRole = {
        id: 1,
        description: 'Participant Role Description',
      } as ParticipantRole;

      jest
        .spyOn(participantRoleRepository, 'find')
        .mockResolvedValue([mockParticipantRole]);
      jest
        .spyOn(staffAssignmentService, 'getStaffByAppId')
        .mockResolvedValue(mockStaffResult);
      jest
        .spyOn(personRepository, 'find')
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
      expect(personRepository.find).toHaveBeenCalled();
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

    it('should handle multiple staff assignments', async () => {
      const mockStaffList = [
        { id: 1, applicationId: 1, personId: 2, roleId: 1, startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), currentCapacity: 100 },
        { id: 2, applicationId: 1, personId: 3, roleId: 2, startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), currentCapacity: 80 },
      ];
      const mockStaffResult = { applicationServiceTypeId: null, staffList: mockStaffList };
      const mockPerson2 = { id: 2, firstName: 'John', lastName: 'Doe', middleName: null, loginUserName: 'jdoe', email: 'jdoe@example.com' };
      const mockPerson3 = { id: 3, firstName: 'Jane', lastName: 'Smith', middleName: null, loginUserName: 'jsmith', email: 'jsmith@example.com' };
      const mockTimesheetDays = [
        { id: 1, applicationId: 1, personId: 2, date: '2025-06-01', hours: '8', comment: null },
        { id: 2, applicationId: 1, personId: 3, date: '2025-06-02', hours: '6', comment: 'Overtime' },
      ];
      const mockRoles = [
        { id: 1, description: 'Role 1' },
        { id: 2, description: 'Role 2' },
      ];

      jest.spyOn(staffAssignmentService, 'getStaffByAppId').mockResolvedValue(mockStaffResult);
      jest.spyOn(personRepository, 'find').mockResolvedValue([mockPerson2, mockPerson3] as any);
      jest.spyOn(timesheetDayRepository, 'find').mockResolvedValue(mockTimesheetDays as any);
      jest.spyOn(participantRoleRepository, 'find').mockResolvedValue(mockRoles as any);

      const result = await service.getTimesheetDaysForAssignedStaff(1, '2025-06-01', '2025-06-30', mockUser);
      expect(result).toHaveLength(2);
      expect(result[0].personId).toBe(2);
      expect(result[0].weekHours).toBe(8);
      expect(result[1].personId).toBe(3);
      expect(result[1].weekHours).toBe(6);
    });

    it('should calculate week and all-time hours correctly', async () => {
      const mockStaffList = [{ id: 1, applicationId: 1, personId: 2, roleId: 1, startDate: new Date(), endDate: new Date(), currentCapacity: 100 }];
      const mockStaffResult = { applicationServiceTypeId: null, staffList: mockStaffList };
      const mockPerson = { id: 2, firstName: 'John', lastName: 'Doe', middleName: null, loginUserName: 'jdoe', email: 'jdoe@example.com' };
      const mockTimesheetDays = [
        { id: 1, applicationId: 1, personId: 2, date: '2025-05-30', hours: '4' }, // Before week
        { id: 2, applicationId: 1, personId: 2, date: '2025-06-01', hours: '8' }, // In week
        { id: 3, applicationId: 1, personId: 2, date: '2025-06-15', hours: '6' }, // In week
        { id: 4, applicationId: 1, personId: 2, date: '2025-07-01', hours: '2' }, // After week
      ];
      const mockRole = { id: 1, description: 'Role' };

      jest.spyOn(staffAssignmentService, 'getStaffByAppId').mockResolvedValue(mockStaffResult);
      jest.spyOn(personRepository, 'find').mockResolvedValue([mockPerson] as any);
      jest.spyOn(timesheetDayRepository, 'find').mockResolvedValue(mockTimesheetDays as any);
      jest.spyOn(participantRoleRepository, 'find').mockResolvedValue([mockRole] as any);

      const result = await service.getTimesheetDaysForAssignedStaff(1, '2025-06-01', '2025-06-30', mockUser);
      expect(result).toHaveLength(1);
      expect(result[0].weekHours).toBe(14); // 8 + 6
      expect(result[0].allTimeHours).toBe(20); // 4 + 8 + 6 + 2
      expect(result[0].timesheetDays).toHaveLength(2); // Only in week
    });

    it('should handle timesheet days with null hours', async () => {
      const mockStaffList = [{ id: 1, applicationId: 1, personId: 2, roleId: 1, startDate: new Date(), endDate: new Date(), currentCapacity: 100 }];
      const mockStaffResult = { applicationServiceTypeId: null, staffList: mockStaffList };
      const mockPerson = { id: 2, firstName: 'John', lastName: 'Doe', middleName: null, loginUserName: 'jdoe', email: 'jdoe@example.com' };
      const mockTimesheetDays = [
        { id: 1, applicationId: 1, personId: 2, date: '2025-06-01', hours: null, comment: 'No hours' },
      ];
      const mockRole = { id: 1, description: 'Role' };

      jest.spyOn(staffAssignmentService, 'getStaffByAppId').mockResolvedValue(mockStaffResult);
      jest.spyOn(personRepository, 'find').mockResolvedValue([mockPerson] as any);
      jest.spyOn(timesheetDayRepository, 'find').mockResolvedValue(mockTimesheetDays as any);
      jest.spyOn(participantRoleRepository, 'find').mockResolvedValue([mockRole] as any);

      const result = await service.getTimesheetDaysForAssignedStaff(1, '2025-06-01', '2025-06-30', mockUser);
      expect(result).toHaveLength(1);
      expect(result[0].weekHours).toBe(0);
      expect(result[0].allTimeHours).toBe(0);
      expect(result[0].timesheetDays[0].hours).toBeUndefined();
    });

    it('should return empty timesheet days if no days in range', async () => {
      const mockStaffList = [{ id: 1, applicationId: 1, personId: 2, roleId: 1, startDate: new Date(), endDate: new Date(), currentCapacity: 100 }];
      const mockStaffResult = { applicationServiceTypeId: null, staffList: mockStaffList };
      const mockPerson = { id: 2, firstName: 'John', lastName: 'Doe', middleName: null, loginUserName: 'jdoe', email: 'jdoe@example.com' };
      const mockTimesheetDays = [
        { id: 1, applicationId: 1, personId: 2, date: '2025-05-01', hours: '8' }, // Outside range
      ];
      const mockRole = { id: 1, description: 'Role' };

      jest.spyOn(staffAssignmentService, 'getStaffByAppId').mockResolvedValue(mockStaffResult);
      jest.spyOn(personRepository, 'find').mockResolvedValue([mockPerson] as any);
      jest.spyOn(timesheetDayRepository, 'find').mockResolvedValue(mockTimesheetDays as any);
      jest.spyOn(participantRoleRepository, 'find').mockResolvedValue([mockRole] as any);

      const result = await service.getTimesheetDaysForAssignedStaff(1, '2025-06-01', '2025-06-30', mockUser);
      expect(result).toHaveLength(1);
      expect(result[0].weekHours).toBe(0);
      expect(result[0].allTimeHours).toBe(8);
      expect(result[0].timesheetDays).toEqual([]);
    });

  });
});
