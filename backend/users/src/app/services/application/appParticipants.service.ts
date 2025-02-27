import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

import { Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';

import { AppParticipant } from 'src/app/entities/appParticipant.entity';
import { AppParticipantsDto } from 'src/app/dto/appParticipantsDto';

@Injectable()
export class AppParticipantService {
  constructor(
    @InjectRepository(AppParticipant)
    private readonly appParticsRepository: Repository<AppParticipant>,
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
    showPending: boolean,
    user: any,
  ): Promise<AppParticipantsDto[]> {
    try {
      //TODO: have the logger statements
      let result = [];
      if (user?.identity_provider === 'idir') {
        if (showPending) {
          result = await this.appParticsRepository.find({
            where: { applicationId },
            relations: ['organization', 'participantRole', 'person'],
          });
        } else {
          result = await this.appParticsRepository.find({
            where: { applicationId },
            relations: ['organization', 'participantRole', 'person'],
          });
        }
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
          isMinistry: participant.organization.isMinistry,
        }));

        const appPartics = plainToInstance(
          AppParticipantsDto,
          transformedObjects,
        );
        return appPartics;
      }
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve app participants by appId: ${applicationId}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
