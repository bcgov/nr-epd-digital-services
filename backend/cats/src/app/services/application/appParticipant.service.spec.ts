import { Test, TestingModule } from '@nestjs/testing';

import { HttpException, HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { AppParticipantService } from './appParticipants.service';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { AppParticipant } from '../../entities/appParticipant.entity';
import { ViewAppParticipantsDto } from '../../dto/appParticipants/viewAppParticipants.dto';
import { AppParticipantFilter } from '../../utilities/enums/appParticipantFilter.enum';
import { LoggerService } from '../../logger/logger.service';
import { get } from 'http';
import { ParticipantRole } from '../../entities/participantRole.entity';
import { Organization } from '../../entities/organization.entity';
import { ViewParticipantsRolesDto } from '../../dto/appParticipants/viewParticipantsRoles.dto';
import { Person } from '../../entities/person.entity';
import { DropdownDto } from 'src/app/dto/dropdown.dto';

describe('AppParticipantsService', () => {
  let service: AppParticipantService;
  let appParticsRepo: Repository<AppParticipant>;
  let rolesRepo: Repository<ParticipantRole>;
  let orgRepo: Repository<Organization>;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppParticipantService,
        LoggerService,
        {
          provide: getRepositoryToken(AppParticipant),
          useValue: {
            getAppParticipantsByAppId: jest.fn(),
            createAppParticipant: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ParticipantRole),
          useValue: {
            getAllParticipantRoles: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: {
            getOrganizations: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Person),
          useValue: {
            getParticipantNames: jest.fn(),
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
      ],
    }).compile();

    service = module.get<AppParticipantService>(AppParticipantService);
    appParticsRepo = module.get<Repository<AppParticipant>>(
      getRepositoryToken(AppParticipant),
    );
    rolesRepo = module.get<Repository<ParticipantRole>>(
      getRepositoryToken(ParticipantRole),
    );
    orgRepo = module.get<Repository<Organization>>(
      getRepositoryToken(Organization),
    );
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAppParticipantsByAppId', () => {
    it('should return transformed participants', async () => {
      const mockParticipants = [
        {
          organization: { name: 'Org1', isMinistry: true },
          participantRole: { description: 'Role1' },
          effectiveStartDate: '2021-01-01',
          effectiveEndDate: '2021-12-31',
          person: { firstName: 'John', lastName: 'Doe' },
        },
      ];

      jest.spyOn(service, 'getAppParticipantsByAppId').mockResolvedValue(
        plainToInstance(
          ViewAppParticipantsDto,
          mockParticipants.map((participant) => ({
            name: participant.organization.name,
            description: participant.participantRole.description,
            effectiveStartDate: new Date(participant.effectiveStartDate),
            effectiveEndDate: new Date(participant.effectiveEndDate),
            isMinistry: participant.organization.isMinistry,
            fullName:
              participant.person.firstName + ' ' + participant.person.lastName,
          })),
        ),
      );

      const result = await service.getAppParticipantsByAppId(
        1,
        'user',
        AppParticipantFilter.MAIN,
      );
      expect(result).toEqual(
        plainToInstance(ViewAppParticipantsDto, [
          {
            name: 'Org1',
            description: 'Role1',
            effectiveStartDate: new Date('2021-01-01'),
            effectiveEndDate: new Date('2021-12-31'),
            isMinistry: true,
            fullName: 'John Doe',
          },
        ]),
      );
    });

    it('should throw an error when an exception occurs', async () => {
      jest
        .spyOn(service, 'getAppParticipantsByAppId')
        .mockImplementation(async () => {
          throw new Error('Failed to retrieve app participants by appId: 1');
        });

      await expect(
        service.getAppParticipantsByAppId(1, 'user', AppParticipantFilter.MAIN),
      ).rejects.toThrow(
        new HttpException(
          'Failed to retrieve app participants by appId: 1',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('getAllParticipantRoles', () => {
    it('should return all participant roles successfully', async () => {
      const mockRoles: ViewParticipantsRolesDto[] = [
        { id: 1, description: 'Role 1' },
        { id: 2, description: 'Role 2' },
      ];

      jest
        .spyOn(service, 'getAllParticipantRoles')
        .mockResolvedValue(mockRoles);

      const result = await service.getAllParticipantRoles();
      expect(result).toEqual(mockRoles);
    });
  });

  describe('getOrganizations', () => {
    it('should return searched organizations successfully', async () => {
      const searchParam = 'Org';
      const mockRoles: DropdownDto[] = [{ key: '1', value: 'Org1' }];

      jest.spyOn(service, 'getOrganizations').mockResolvedValue(mockRoles);

      const result = await service.getOrganizations(searchParam);
      expect(result).toEqual(mockRoles);
    });
  });

  describe('getParticipantNames', () => {
    it('should return searched participant names successfully', async () => {
      const searchParam = 'Nam';
      const mockRoles: DropdownDto[] = [{ key: '1', value: 'Name1' }];

      jest.spyOn(service, 'getParticipantNames').mockResolvedValue(mockRoles);

      const result = await service.getParticipantNames(searchParam);
      expect(result).toEqual(mockRoles);
    });
  });

  describe('createAppParticipant', () => {
    const input = {
      applicationId: 1,
      personId: 2,
      participantRoleId: 3,
      organizationId: 4,
      isMainParticipant: true,
      effectiveStartDate: new Date('2021-01-01'),
      effectiveEndDate: new Date('2021-12-31'),
      createdBy: 'system',
      createdDateTime: new Date('2025-02-05T18:43:03.244Z'),
    };

    const addedParticipant = {
      id: 27912,
      ...input,
      createdBy: 'system',
      createdDateTime: new Date('2025-02-05T18:43:03.244Z'),
      rowVersionCount: null,
      updatedBy: null,
      updatedDateTime: null,
    };

    const user = {
      identity_provider: 'idir', // IDIR provider
      givenName: 'TestUser',
    };

    const expectedResponse = {
      message: 'Participant created successfully',
      httpStatusCode: HttpStatus.CREATED,
      success: true,
      data: [addedParticipant],
    };
    it('should log start message and create a participant successfully', async () => {
      jest
        .spyOn(appParticsRepo, 'create')
        .mockReturnValue(addedParticipant as any);
      jest
        .spyOn(appParticsRepo, 'save')
        .mockResolvedValue(addedParticipant as any);
      const result = await service.createAppParticipant(input, user);
      expect(result).toBeDefined();
      expect(result.id).toBe(addedParticipant.id);
      expect(result.isMainParticipant).toBe(addedParticipant.isMainParticipant);
    });

    it('should throw HttpException when participant creation fails', async () => {
      jest
        .spyOn(appParticsRepo, 'findOne')
        .mockReturnValue(addedParticipant as any);
      await expect(
        service.createAppParticipant(input, user),
      ).rejects.toThrowError(
        new HttpException(
          'Failed to add app Participant',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('updateAppParticipant', () => {
    const input = {
      id: 1,
      applicationId: 1,
      effectiveStartDate: new Date('2021-01-01'),
      effectiveEndDate: new Date('2021-12-31'),
    };

    const user = {
      identity_provider: 'idir',
      givenName: 'TestUser',
    };

    const updatedParticipant = {
      id: 1,
      applicationId: 1,
      personId: 2,
      participantRoleId: 3,
      organizationId: 4,
      isMainParticipant: true,
      effectiveStartDate: new Date('2021-01-01'),
      effectiveEndDate: new Date('2021-12-31'),
      createdBy: 'TestUser',
      createdDateTime: new Date('2025-02-05T18:43:03.244Z'),
      rowVersionCount: null,
      updatedBy: 'TestUser',
      updatedDateTime: new Date('2025-02-05T18:43:03.244Z'),
    };
    it('should update a participant successfully', async () => {
      const expectedResponse = {
        message: 'App Participant updated successfully with ID: 1',
        httpStatusCode: HttpStatus.CREATED,
        success: true,
        timestamp: new Date(),
        data: [updatedParticipant],
      };
      jest
        .spyOn(appParticsRepo, 'save')
        .mockResolvedValue(updatedParticipant as any);

      jest
        .spyOn(appParticsRepo, 'findOne')
        .mockResolvedValue([updatedParticipant] as any);

      const result = await service.updateAppParticipant(input, user);
      expect(result).toBeDefined();
    });

    it('should throw HttpException when participant is not found', async () => {
      jest.spyOn(appParticsRepo, 'findOne').mockResolvedValue(null); // Simulate no participant found

      await expect(
        service.updateAppParticipant(input, user),
      ).rejects.toThrowError(
        new HttpException(
          'Failed to update App Participant',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
