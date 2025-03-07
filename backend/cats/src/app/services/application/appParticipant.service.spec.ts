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


describe('AppParticipantsService', () => {
  let service: AppParticipantService;
  let appParticsRepo: Repository<AppParticipant>;
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
          },
        },
      ],
    }).compile();

    service = module.get<AppParticipantService>(AppParticipantService);
    appParticsRepo = module.get<Repository<AppParticipant>>(getRepositoryToken(AppParticipant));
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

      const result = await service.getAppParticipantsByAppId(1, 'user', AppParticipantFilter.MAIN);
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
});
