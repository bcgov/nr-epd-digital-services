import { Test, TestingModule } from '@nestjs/testing';
import { AppParticipantService } from '../../services/application/appParticipants.service';
import { GenericResponseProvider } from '../../dto/reponse/genericResponseProvider';

import { HttpStatus } from '@nestjs/common';
import { ViewAppParticipantsDto } from '../../dto/appParticipants/viewAppParticipantsDto';
import { AppParticipantResolver } from './appParticipant.resolver';
import { AppParticipantFilter } from 'src/app/dto/appParticipants/appParticipantFilter.enum';

describe('AppParticipantResolver', () => {
  let resolver: AppParticipantResolver;
  let appParticipantService: AppParticipantService;
  let genericResponseProvider: GenericResponseProvider<ViewAppParticipantsDto[]>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppParticipantResolver,

        {
          provide: AppParticipantService,

          useValue: {
            getAppParticipantsByAppId: jest.fn(),
          },
        },
        {
          provide: GenericResponseProvider,
          useValue: {
            createResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<AppParticipantResolver>(AppParticipantResolver);
    appParticipantService = module.get<AppParticipantService>(
      AppParticipantService,
    );
    genericResponseProvider = module.get<
      GenericResponseProvider<ViewAppParticipantsDto[]>
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
          fullName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          description: 'Participant',
          effectiveStartDate: new Date('2021-01-01'),
          effectiveEndDate: new Date('2021-12-31'),
          isMainParticipant: true,
          name: 'Organization',
          isMinistry: false,
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

      jest
        .spyOn(appParticipantService, 'getAppParticipantsByAppId')
        .mockResolvedValue(mockParticipants);
      jest
        .spyOn(genericResponseProvider, 'createResponse')
        .mockReturnValue(mockResponse);

      const result = await resolver.getAppParticipantsByAppId(
        applicationId,
        user,
        AppParticipantFilter.ALL
      );

      expect(
        appParticipantService.getAppParticipantsByAppId,
      ).toHaveBeenCalledWith(applicationId, user);

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

      jest
        .spyOn(appParticipantService, 'getAppParticipantsByAppId')
        .mockResolvedValue(mockParticipants);

      (genericResponseProvider.createResponse as jest.Mock).mockReturnValue(
        mockResponse,
      );
      const result = await resolver.getAppParticipantsByAppId(
        applicationId,
        user,
        AppParticipantFilter.ALL
      );

      expect(
        appParticipantService.getAppParticipantsByAppId,
      ).toHaveBeenCalledWith(applicationId, user);

      expect(genericResponseProvider.createResponse).toHaveBeenCalledWith(
        'Participants data not found for app id: 1',
        HttpStatus.NOT_FOUND,
        false,
        [],
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
