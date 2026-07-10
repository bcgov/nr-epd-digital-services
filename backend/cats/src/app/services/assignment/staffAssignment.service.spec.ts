import { Test, TestingModule } from '@nestjs/testing';
import { StaffAssignmentService } from './staffAssignment.service';
import { Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { ApplicationServiceType } from '../../entities/applicationServiceType.entity';
import { DropdownDto } from '../../dto/dropdown.dto';
import { HttpException } from '@nestjs/common';
import { AppParticipant } from '../../entities/appParticipant.entity';
import { Person } from '../../entities/person.entity';
import { Application } from '../../entities/application.entity';
import { AppParticipantService } from '../application/appParticipants.service';
import { ChesEmailService } from '../email/chesEmail.service';
import { ParticipantRole } from '../../entities/participantRole.entity';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserTypeEum } from '../../utilities/enums/userType';
import { UpdateStaffAssignedDto } from '../../dto/assignment/updateStaffAssigned.dto';
import { create } from 'domain';
import { find } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import { SiteService } from '../site/site.service';
import { Risk } from '../../entities/risk.entity';
import { StaffRoles } from './staffRoles.enum';
import { AppPriority } from '../../entities/appPriority.entity';
import { Priority } from '../../entities/priority.entity';

describe('StaffAssignmentService', () => {
  let service: StaffAssignmentService;
  let repository: Repository<ApplicationServiceType>;
  let loggerService: LoggerService;
  let staffAssignmentRepository: Repository<AppParticipant>;
  let personRepository: Repository<Person>;
  let applicationRepository: Repository<Application>;
  let appParticipantService: AppParticipantService;
  let emailService: ChesEmailService;
  let participantRoleRepository: Repository<ParticipantRole>;
  let configService: ConfigService;
  let siteService: SiteService;
  let siteRiskRepository: Repository<Risk>;
  let appPriorityRepository: Repository<AppPriority>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(AppPriority),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            filter: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AppParticipant),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            filter: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ParticipantRole),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Person),
          useValue: {
            find: jest.fn(),
            query: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Application),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ApplicationServiceType),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Risk),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: AppParticipantService,
          useValue: {
            createAppParticipant: jest.fn(),
          }, // mock as needed
        },
        {
          provide: ChesEmailService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
        {
          provide: SiteService,
          useValue: {
            getSiteById: jest.fn(),
          },
        },
        StaffAssignmentService,
      ],
    }).compile();

    service = module.get<StaffAssignmentService>(StaffAssignmentService);
    repository = module.get<Repository<ApplicationServiceType>>(
      getRepositoryToken(ApplicationServiceType),
    );
    loggerService = module.get<LoggerService>(LoggerService);
    applicationRepository = module.get<Repository<Application>>(
      getRepositoryToken(Application),
    );
    staffAssignmentRepository = module.get<Repository<AppParticipant>>(
      getRepositoryToken(AppParticipant),
    );
    personRepository = module.get<Repository<Person>>(
      getRepositoryToken(Person),
    );

    siteRiskRepository = module.get<Repository<Risk>>(getRepositoryToken(Risk));

    appParticipantService = module.get<AppParticipantService>(
      AppParticipantService,
    );
    emailService = module.get<ChesEmailService>(ChesEmailService);
    participantRoleRepository = module.get<Repository<ParticipantRole>>(
      getRepositoryToken(ParticipantRole),
    );
    appPriorityRepository = module.get<Repository<AppPriority>>(
      getRepositoryToken(AppPriority),
    );
    configService = module.get<ConfigService>(ConfigService);
    siteService = module.get<SiteService>(SiteService);
  });

  it('should return application service types successfully', async () => {
    const applicationServiceTypes = [
      {
        id: 1,
        serviceName: 'Service 1',
        serviceType: 'Type 1',
        serviceFeeInCents: 5000,
      },
      {
        id: 2,
        serviceName: 'Service 2',
        serviceType: 'Type 2',
        serviceFeeInCents: null,
      },
    ];
    (repository.find as jest.Mock).mockResolvedValue(applicationServiceTypes);

    const result = await service.getApplicationServiceTypes();

    expect(result).toEqual([
      { key: 1, value: 'Service 1 (Type 1)', metaData: '5000' },
      { key: 2, value: 'Service 2 (Type 2)', metaData: null },
    ]);
    expect(loggerService.log).toHaveBeenCalledTimes(2);
  });

  it('should throw HttpException when repository find fails', async () => {
    (repository.find as jest.Mock).mockRejectedValue(
      new Error('Repository find error'),
    );

    await expect(service.getApplicationServiceTypes()).rejects.toThrow(
      HttpException,
    );
    expect(loggerService.log).toHaveBeenCalledTimes(2);
  });

  it('should throw HttpException when mapping fails', async () => {
    const applicationServiceTypes = [
      { id: 1, serviceName: 'Service 1' },
      { id: 2, serviceName: 'Service 2' },
    ];
    (repository.find as jest.Mock).mockResolvedValue(applicationServiceTypes);

    jest.spyOn(applicationServiceTypes, 'map').mockImplementation(() => {
      throw new Error('Mapping error');
    });

    await expect(service.getApplicationServiceTypes()).rejects.toThrow(
      HttpException,
    );
    expect(loggerService.log).toHaveBeenCalledTimes(2);
  });

  it('should return empty array when no staff members are found', async () => {
    (personRepository.query as jest.Mock).mockResolvedValueOnce([]);
    const result = await service.getAllActiveStaffMembersWithCurrentCapacity();
    expect(result).toEqual([]);
  });

  it('should return array of staff members', async () => {
    (personRepository.query as jest.Mock).mockResolvedValueOnce([
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        roles: 'STAFF',
        middle_name: '',
        current_factors: 1,
      },
    ]);
    const result = await service.getActiveStaffWithCapacityByServiceType(1);
    expect(result).toEqual([
      {
        personId: 1,
        personFirstName: 'John',
        personLastName: 'Doe',
        personFullName: 'John  Doe - (STAFF)',
        personMiddleName: '',
        currentCapacity: 1,
      },
    ]);
  });

  it('should retrieve staff assigned by app ID successfully', async () => {
    const applicationId = 1;
    const application = new Application();
    application.id = applicationId;
    application.serviceTypeId = 1;
    const participantRole = new ParticipantRole();
    participantRole.id = 1;
    participantRole.abbrev = StaffRoles.CASE_WORKER;
    const staffAssignment = new AppParticipant();
    staffAssignment.id = 1;
    staffAssignment.applicationId = applicationId;
    staffAssignment.participantRoleId = participantRole.id;

    const person = new Person();
    person.id = staffAssignment.personId;
    person.email = 'iN8fj@example.com';
    (personRepository.find as jest.Mock).mockResolvedValue([person]);
    (personRepository.findOne as jest.Mock).mockResolvedValue([person]);

    (applicationRepository.findOne as jest.Mock).mockResolvedValue(application);
    (participantRoleRepository.find as jest.Mock).mockResolvedValue([
      participantRole,
    ]);
    (staffAssignmentRepository.find as jest.Mock).mockResolvedValue([
      staffAssignment,
    ]);

    const result = await service.getStaffByAppId(applicationId, {});
    expect(result).toEqual({
      applicationServiceTypeId: application.serviceTypeId,
      staffList: [
        {
          id: staffAssignment.id,
          applicationId: staffAssignment.applicationId,
          startDate: staffAssignment.effectiveStartDate,
          endDate: staffAssignment.effectiveEndDate,
          roleId: staffAssignment.participantRoleId,
          personId: staffAssignment.personId,
          currentCapacity: 0,
        },
      ],
    });
  });

  it('should generate email template with valid input parameters', () => {
    const role = 'Test Role';
    const serviceRequested = 'Test Service';
    const application: any = {
      siteId: 1,
      id: 1,
      createdDateTime: new Date(),
      riskId: 1,
    };
    const staff = {
      effectiveStartDate: new Date(),
    };
    const site: any = {
      address: 'Test Address',
      id: 1,
    };

    const siteRisk = new Risk();
    siteRisk.id = 1;
    siteRisk.description = 'Test Risk';

    const result = service.generateAssignmentEmailTemplate(
      role,
      serviceRequested,
      application,
      staff,
      site,
      [],
      [],
      [],
      '',
    );
    expect(result).toContain(role);
    expect(result).toContain(serviceRequested);
  });

  it('should update staff assigned with IDIR user', async () => {
    const staffInput: UpdateStaffAssignedDto[] = [
      {
        id: 0,
        applicationId: 1,
        personId: 1,
        roleId: 1,
        organizationId: null,
        startDate: new Date(),
        endDate: new Date(),
        action: '',
      },
    ];
    const applicationId = 1;
    const applicationServiceTypeId = 1;
    const user = {
      identity_provider: UserTypeEum.IDIR,
      givenName: 'Test User',
    };

    const participantRole = new ParticipantRole();
    participantRole.id = 1;
    participantRole.abbrev = StaffRoles.CASE_WORKER;

    (participantRoleRepository.findOne as jest.Mock).mockResolvedValue(
      participantRole,
    );

    const application = new Application();
    application.id = applicationId;
    application.serviceTypeId = 1;
    (applicationRepository.save as jest.Mock).mockResolvedValue(true);
    (applicationRepository.findOne as jest.Mock).mockResolvedValue(application);
    (appParticipantService.createAppParticipant as jest.Mock).mockResolvedValue(
      true,
    );
    (emailService.sendEmail as jest.Mock).mockResolvedValue(true);
    (siteService.getSiteById as jest.Mock).mockResolvedValue({
      address: 'Test Address',
      id: 1,
    });

    const person = new Person();
    person.id = 1;
    person.email = 'iN8fj@example.com';
    (personRepository.find as jest.Mock).mockResolvedValue([person]);
    (personRepository.findOne as jest.Mock).mockResolvedValue([person]);

    const serviceType = new ApplicationServiceType();
    serviceType.id = application.serviceTypeId.toString();

    const appParticipant = new AppParticipant();
    appParticipant.id = 1;
    appParticipant.applicationId = applicationId;
    appParticipant.participantRoleId = 1;
    appParticipant.personId = 1;
    appParticipant.effectiveStartDate = new Date();
    appParticipant.effectiveEndDate = new Date();
    appParticipant.participantRole = participantRole;
    appParticipant.person = person;
    (staffAssignmentRepository.find as jest.Mock).mockResolvedValue([
      {
        ...appParticipant,
      },
    ]);
    (repository.findOne as jest.Mock).mockResolvedValue(serviceType);

    const appPrioirty = new AppPriority();
    appPrioirty.id = 1;
    appPrioirty.priority = new Priority();
    appPrioirty.priority.description = 'High';
    (appPriorityRepository.findOne as jest.Mock).mockResolvedValue(appPrioirty);

    const result = await service.updateStaffAssigned(
      staffInput,
      applicationId,
      applicationServiceTypeId,
      user,
    );
    expect(result).toBe(true);
  });

  it('should return staff grouped by role for service type', async () => {
    const applicationServiceTypeId = 1;
    const caseWorkerRole = new ParticipantRole();
    caseWorkerRole.id = 1;
    caseWorkerRole.abbrev = StaffRoles.CASE_WORKER;
    caseWorkerRole.description = 'Caseworker';

    const sdmRole = new ParticipantRole();
    sdmRole.id = 2;
    sdmRole.abbrev = StaffRoles.SDM;
    sdmRole.description = 'Statutory Decision Maker';

    const mentorRole = new ParticipantRole();
    mentorRole.id = 3;
    mentorRole.abbrev = StaffRoles.MENTOR;
    mentorRole.description = 'Mentor';

    (participantRoleRepository.find as jest.Mock).mockResolvedValue([
      caseWorkerRole,
      sdmRole,
      mentorRole,
    ]);

    (personRepository.query as jest.Mock)
      .mockResolvedValueOnce([
        {
          personid: 1,
          first_name: 'John',
          last_name: 'Doe',
          middle_name: '',
          description: 'Test App Type',
          end_date: '2024-01-01',
          appid: 100,
          has_permission: 1,
        },
      ])
      .mockResolvedValueOnce([
        {
          personid: 2,
          first_name: 'Jane',
          last_name: 'Smith',
          middle_name: '',
          description: 'Another App Type',
          end_date: '2024-02-01',
          appid: 101,
          has_permission: 1,
        },
      ])
      .mockResolvedValueOnce([
        {
          personid: 3,
          first_name: 'Bob',
          last_name: 'Johnson',
          middle_name: '',
          description: 'Third App Type',
          end_date: '2024-03-01',
          appid: 102,
          has_permission: 1,
        },
      ]);

    const result = await service.getStaffGroupedByRoleForServiceType(
      applicationServiceTypeId,
      104,
    );

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      roleId: 1,
      roleName: 'Caseworker',
      roleAbbrev: StaffRoles.CASE_WORKER,
      staff: [
        {
          personId: 1,
          personFirstName: 'John',
          personMiddleName: '',
          personLastName: 'Doe',
          personFullName: 'John  Doe',
          currentCapacity: 0,
          appType: 'Test App Type',
          endDate: '2024-01-01',
          applicationId: 100,
          hasPermission: true,
        },
      ],
    });
    expect(result[1]).toEqual({
      roleId: 2,
      roleName: 'Statutory Decision Maker',
      roleAbbrev: StaffRoles.SDM,
      staff: [
        {
          personId: 2,
          personFirstName: 'Jane',
          personMiddleName: '',
          personLastName: 'Smith',
          personFullName: 'Jane  Smith',
          currentCapacity: 0,
          appType: 'Another App Type',
          endDate: '2024-02-01',
          applicationId: 101,
          hasPermission: true,
        },
      ],
    });
    expect(result[2]).toEqual({
      roleId: 3,
      roleName: 'Mentor',
      roleAbbrev: StaffRoles.MENTOR,
      staff: [
        {
          personId: 3,
          personFirstName: 'Bob',
          personMiddleName: '',
          personLastName: 'Johnson',
          personFullName: 'Bob  Johnson',
          currentCapacity: 0,
          appType: 'Third App Type',
          endDate: '2024-03-01',
          applicationId: 102,
          hasPermission: true,
        },
      ],
    });
  });

  it('should return empty staff arrays when no staff found for roles', async () => {
    const applicationServiceTypeId = 1;
    const caseWorkerRole = new ParticipantRole();
    caseWorkerRole.id = 1;
    caseWorkerRole.abbrev = StaffRoles.CASE_WORKER;
    caseWorkerRole.description = 'Caseworker';

    (participantRoleRepository.find as jest.Mock).mockResolvedValue([
      caseWorkerRole,
    ]);

    (personRepository.query as jest.Mock).mockResolvedValue([]);

    const result = await service.getStaffGroupedByRoleForServiceType(
      applicationServiceTypeId,
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      roleId: 1,
      roleName: 'Caseworker',
      roleAbbrev: StaffRoles.CASE_WORKER,
      staff: [],
    });
  });

  it('should throw HttpException when getStaffGroupedByRoleForServiceType fails', async () => {
    const applicationServiceTypeId = 1;
    (participantRoleRepository.find as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(
      service.getStaffGroupedByRoleForServiceType(applicationServiceTypeId),
    ).rejects.toThrow(HttpException);
  });

  it('should filter out deleted staff from getStaffByAppId results', async () => {
    const applicationId = 1;
    const application = new Application();
    application.id = applicationId;
    application.serviceTypeId = 1;

    const participantRole = new ParticipantRole();
    participantRole.id = 1;
    participantRole.abbrev = StaffRoles.CASE_WORKER;

    (applicationRepository.findOne as jest.Mock).mockResolvedValue(application);
    (participantRoleRepository.find as jest.Mock).mockResolvedValue([
      participantRole,
    ]);

    const activeStaff = new AppParticipant();
    activeStaff.id = 1;
    activeStaff.applicationId = applicationId;
    activeStaff.participantRoleId = 1;
    activeStaff.personId = 1;
    activeStaff.isDeleted = false;
    activeStaff.effectiveStartDate = new Date('2024-01-01');
    activeStaff.effectiveEndDate = new Date('2024-12-31');

    (staffAssignmentRepository.find as jest.Mock).mockResolvedValue([
      activeStaff,
    ]);
    (personRepository.query as jest.Mock).mockResolvedValue([
      { id: 1, current_factors: 0.5 },
    ]);

    const result = await service.getStaffByAppId(applicationId, {});

    expect(staffAssignmentRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          applicationId,
          isDeleted: false,
        }),
      }),
    );
    expect(result.staffList).toHaveLength(1);
    expect(result.staffList[0].id).toBe(1);
  });
});
