import { Test, TestingModule } from '@nestjs/testing';
import { AppParticipantService } from '../../services/application/appParticipants.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';

import { HttpStatus } from '@nestjs/common';
import { AppParticipantResolver } from './appParticipant.resolver';
import { ViewAppParticipantsDto } from '../../dto/appParticipants/viewAppParticipants.dto';
import { AppParticipantFilter } from '../../utilities/enums/appParticipantFilter.enum';
import { LoggerService } from '../../logger/logger.service';
import { get } from 'http';
import { DropdownDto, DropdownResponse } from '../../dto/dropdown.dto';
import { Person } from 'src/app/entities/person.entity';
import { CreateAppParticipantDto } from '../../dto/appParticipants/createAppParticipant.dto';
import { ViewAppParticipantEntityDto } from '../../dto/appParticipants/viewAppParticipantEntity.dto';

describe('AppParticipantResolver', () => {
  let resolver: AppParticipantResolver;
  let appParticipantService: AppParticipantService;
  let genericResponseProvider: GenericResponseProvider<
    ViewAppParticipantsDto[]
  >;
  let genericResponseProviderEntity: GenericResponseProvider<
    ViewAppParticipantEntityDto[]
  >;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppParticipantResolver,

        {
          provide: AppParticipantService,

          useValue: {
            getAppParticipantsByAppId: jest.fn(),
            getParticipantNames: jest.fn(),
            getOrganizations: jest.fn(),
            createAppParticipant: jest.fn(),
            updateAppParticipant: jest.fn(),
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
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<AppParticipantResolver>(AppParticipantResolver);
    appParticipantService = module.get<AppParticipantService>(
      AppParticipantService,
    );
    loggerService = module.get<LoggerService>(LoggerService);
    genericResponseProvider = module.get<
      GenericResponseProvider<ViewAppParticipantsDto[]>
    >(GenericResponseProvider);
    genericResponseProviderEntity = module.get<
      GenericResponseProvider<ViewAppParticipantEntityDto[]>
    >(GenericResponseProvider);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getAppParticipantsByAppId', () => {
    it('should return a response when participants are found', async () => {
      const mockParticipants = [
        {
          id: 1,
          applicationId: 1,
          organization: {
            id: 1,
            name: 'Organization',
          },
          person: {
            id: 1,
            firstName: 'John',
            middleName: 'M',
            lastName: 'Doe',
            fullName: 'John M Doe',
          },
          participantRole: {
            id: 1,
            description: 'Participant',
          },
          fullName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          description: 'Participant',
          effectiveStartDate: new Date('2021-01-01'),
          effectiveEndDate: new Date('2021-12-31'),
          isMainParticipant: true,
          name: 'Organization',
          isMinistry: false,
          createdBy: 'user1',
          createdDateTime: new Date('2021-01-01'),
          updatedBy: 'user1',
          updatedDateTime: new Date('2021-01-01'),
          rowVersionCount: 1,
        },
      ];
      const mockResponse = {
        message: 'Participants fetched successfully',
        statusCode: HttpStatus.OK,
        success: true,
        data: mockParticipants,
      };
      const applicationId = 1;
      const user = { id: 'user1' };
      const filter = AppParticipantFilter.ALL;

      jest
        .spyOn(appParticipantService, 'getAppParticipantsByAppId')
        .mockResolvedValue(mockParticipants);
      jest
        .spyOn(genericResponseProvider, 'createResponse')
        .mockReturnValue(mockResponse);

      const result = await resolver.getAppParticipantsByAppId(
        applicationId,
        user,
        filter,
      );

      expect(
        appParticipantService.getAppParticipantsByAppId,
      ).toHaveBeenCalledWith(applicationId, user, filter);

      expect(genericResponseProvider.createResponse).toHaveBeenCalledWith(
        'Participants fetched successfully',
        HttpStatus.OK,
        true,
        mockParticipants,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return an empty list when no participants are found', async () => {
      const mockParticipants = [];
      const mockResponse = {
        message: 'Participants data not found for app id: 1',
        httpStatusCode: HttpStatus.NOT_FOUND,
        success: false,
        data: mockParticipants,
      };
      const applicationId = 1;
      const user = { id: 'user1' };
      const filter = AppParticipantFilter.ALL;

      jest
        .spyOn(appParticipantService, 'getAppParticipantsByAppId')
        .mockResolvedValue(mockParticipants);

      (genericResponseProvider.createResponse as jest.Mock).mockReturnValue(
        mockResponse,
      );
      const result = await resolver.getAppParticipantsByAppId(
        applicationId,
        user,
        filter,
      );

      expect(
        appParticipantService.getAppParticipantsByAppId,
      ).toHaveBeenCalledWith(applicationId, user, filter);

      expect(genericResponseProvider.createResponse).toHaveBeenCalledWith(
        'Participants data not found for app id: 1',
        HttpStatus.NOT_FOUND,
        false,
        [],
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getParticipantNames', () => {
    it('should return participant names on search', async () => {
      const searchParam = 'John';
      const mockResult = [{ key: '1', value: 'John Doe' }];
      const user = { id: 'user1' };
      const expectedResponse: DropdownResponse = {
        data: mockResult,
        message: 'Participant names fetched successfully',
        httpStatusCode: HttpStatus.OK,
        success: true,
      };

      jest
        .spyOn(appParticipantService, 'getParticipantNames')
        .mockResolvedValue(mockResult);
      const result = await resolver.getParticipantNames(searchParam, user);

      expect(appParticipantService.getParticipantNames).toHaveBeenCalledWith(
        searchParam,
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        'AppParticipantResolver.getParticipantNames() RES:200 end',
      );
    });
  });

  describe('getOrganizations', () => {
    it('should return organization names on search', async () => {
      const searchParam = 'Org';
      const mockResult = [{ key: '1', value: 'Org1' }];
      const user = { id: 'user1' };
      const expectedResponse: DropdownResponse = {
        data: mockResult,
        message: 'Organization names fetched successfully',
        httpStatusCode: HttpStatus.OK,
        success: true,
      };

      jest
        .spyOn(appParticipantService, 'getOrganizations')
        .mockResolvedValue(mockResult);
      const result = await resolver.getOrganizations(searchParam, user);

      expect(appParticipantService.getOrganizations).toHaveBeenCalledWith(
        searchParam,
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        'AppParticipantResolver.getOrganizations() RES:200 end',
      );
    });
  });

  describe('createAppParticipant', () => {
    it('should create a new participant successfully', async () => {
      const input: CreateAppParticipantDto = {
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

      const addedParticipant: ViewAppParticipantEntityDto = {
        id: 27912,
        applicationId: 1,
        personId: 2,
        participantRoleId: 3,
        organizationId: 4,
        isMainParticipant: false,
        effectiveStartDate: new Date('2021-01-01'),
        createdBy: 'system',
        createdDateTime: new Date('2025-02-05T18:43:03.244Z'),
        effectiveEndDate: new Date('2021-12-31'),
        rowVersionCount: null,
        updatedBy: null,
        updatedDateTime: null,
      };

      const expectedResponse = {
        message: 'Participant created successfully',
        httpStatusCode: HttpStatus.CREATED,
        success: true,
        data: [addedParticipant],
      };

      jest
        .spyOn(appParticipantService, 'createAppParticipant')
        .mockResolvedValue(addedParticipant);

      (
        genericResponseProviderEntity.createResponse as jest.Mock
      ).mockReturnValue(addedParticipant);
      const result = await resolver.createAppParticipant(input, {
        identity_provider: 'IDIR',
      });
    });
  });

  describe('updateAppParticipant', () => {
    it('should update a participant successfully', async () => {
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

      const expectedResponse = {
        message: 'App Participant updated successfully with ID: 1',
        httpStatusCode: HttpStatus.CREATED,
        success: true,
        timestamp: new Date(),
        data: [updatedParticipant],
      };
      jest
        .spyOn(appParticipantService, 'updateAppParticipant')
        .mockResolvedValue(updatedParticipant as any);

      (
        genericResponseProviderEntity.createResponse as jest.Mock
      ).mockReturnValue(expectedResponse);

      const result = await resolver.updateAppParticipant(input, user);
      expect(result).toBeDefined();
      expect(appParticipantService.updateAppParticipant).toHaveBeenCalledWith(
        input,
        user,
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        'AppParticipantResolver.updateAppParticipant() RES:201 end',
      );
    });
  });
});
