import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

import { Repository } from 'typeorm';

import { AppParticipant } from '../../entities/appParticipant.entity';
import { ViewAppParticipantsDto } from '../../dto/appParticipants/viewAppParticipants.dto';
import { LoggerService } from '../../logger/logger.service';
import { AppParticipantFilter } from '../../utilities/enums/appParticipantFilter.enum';

@Injectable()
export class AppParticipantService {
  constructor(
    @InjectRepository(AppParticipant)
    private readonly appParticsRepository: Repository<AppParticipant>,
    private readonly loggerSerivce: LoggerService,
  ) {}

  /**
   * Retrieves app participants for a given app ID and transforms the data into DTOs.
   *
   * @param applicationId - The ID of the site for which participants are to be fetched.
   * @returns An array of AppParticsDTO objects containing participant details.
   * @throws Error if there is an issue retrieving the data.
   */
  async getAppParticipantsByAppId(
    applicationId: number,
    user: any,
    filter: AppParticipantFilter
  ): Promise<ViewAppParticipantsDto[]> {
    try {
      this.loggerSerivce.log('at service layer getAppParticipantsByAppId start');
      let result = [];
      if (user?.identity_provider === 'idir') {
        result = await this.appParticsRepository.find({
          where: { applicationId },
          relations: ['organization', 'participantRole', 'person'],
        });
      }

      if (!result?.length) {
        return [];
      } else {
        const transformedObjects = result.map((participant) => ({
          id: participant.id,
          applicationId: participant.applicationId,
          isMainParticipant: participant.isMainParticipant,
          fullName:
            participant.person.firstName + ' ' + participant.person.lastName,
          name: participant.organization.name,
          description: participant.participantRole.description,
          effectiveStartDate: participant.effectiveStartDate,
          effectiveEndDate: participant.effectiveEndDate,
          isMinistry: participant.participantRole.isMinistry,
        }));

        let mainParticipants = [];
        if (filter === AppParticipantFilter.MAIN) {
            mainParticipants = transformedObjects.filter(
            (participant) => participant.isMainParticipant === true,
          );
        }
        const appPartics = plainToInstance(
          ViewAppParticipantsDto,
          filter === AppParticipantFilter.ALL ? transformedObjects : mainParticipants,
        );
        return appPartics;
      }
    } catch (error) {
      this.loggerSerivce.log('at service layer getAppParticipantsByAppId error');
      throw new HttpException(
        `Failed to retrieve app participants by appId: ${applicationId}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
