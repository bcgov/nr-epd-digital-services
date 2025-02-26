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
    // private readonly sitesLogger: LoggerService,
    // private snapshotService: SnapshotsService,
  ) {}

  /**
   * Retrieves site participants for a given site ID and transforms the data into DTOs.
   *
   * @param applicationId - The ID of the site for which participants are to be fetched.
   * @returns An array of SiteParticsDto objects containing participant details.
   * @throws Error if there is an issue retrieving the data.
   */
  async getAppParticipantsByAppId(
    applicationId: number,
    showPending: boolean,
    user: any,
  ): Promise<AppParticipantsDto[]> {
    try {
    //   this.sitesLogger.log(
    //     'ParticipantService.getSiteParticipantsBySiteId() start',
    //   );
    //   this.sitesLogger.debug(
    //     'ParticipantService.getSiteParticipantsBySiteId() start',
    //   );

      // Fetch site participants based on the given siteId
      let result = [];
      if (user?.identity_provider === 'idir') {
        if (showPending) {
          result = await this.appParticsRepository.find({
            where: { applicationId },
            relations: ['organization', 'participantRole', 'person'],
          });
        } else {
          result = await this.appParticsRepository.find({
            where: { applicationId  },
            relations: ['organization', 'participantRole', 'person'],
          });
        }
    }
    //   } else {
    //     const userId: string = user?.sub ? user.sub : '';
    //     if (userId?.length === 0) {
    //       this.sitesLogger.log(
    //         'An invalid user was passed into ParticipantService.getSiteParticipantsBySiteId() end',
    //       );
    //       return [];
    //     } else {
    //       const snapshot = await this.snapshotService.getMostRecentSnapshot(
    //         siteId,
    //         userId,
    //       );
    //       if (!snapshot) {
    //         return [];
    //       } else {
    //         result = snapshot?.snapshotData?.siteParticipants;
    //       }
    //     }
    //   }

   // TODO FOR APP PARTICIPANT
      if (!result?.length) {
        return [];
      } else {
        console.log('nupur - appParticpant service result is: ', result);
      
        // Transform the fetched site participants into the desired format
        // const transformedObjects = result?.flatMap((item) =>
        //   item.siteParticRoles.map((role) => ({
        //     particRoleId: role.id,
        //     id: item.id,
        //     siteId: item.siteId,
        //     psnorgId: item.psnorgId,
        //     effectiveDate: new Date(item.effectiveDate).toISOString(),
        //     endDate: item.endDate ? new Date(item.endDate).toISOString() : null,
        //     note: item.note?.trim() || '', // Ensure note is trimmed and defaults to an empty string if null
        //     displayName: item.psnorg?.displayName?.trim() || '', // Safely access displayName with default value
        //     prCode: role.prCode.trim(),
        //     description: role.prCode2?.description?.trim() || '', // Safely access description with default value
        //     srValue:
        //       item.srAction === SRApprovalStatusEnum.PUBLIC ||
        //       role.srAction === SRApprovalStatusEnum.PUBLIC
        //         ? true
        //         : false,
        //     srAction: role.srAction,
        //   })),
        //);
        const transformedObjects = result.map((participant) => ({
            id: participant.id,
            applicationId: participant.applicationId,
            isMainParticipant: participant.isMainParticipant,
            firstName: participant.person.firstName,
            name: participant.organization.name,
            description: participant.participantRole.description,
            effectiveStartDate: participant.effectiveStartDate,
            effectiveEndDate: participant.effectiveEndDate,
            isMinistry: participant.organization.isMinistry,
          }));

        const appPartics = plainToInstance(AppParticipantsDto, transformedObjects);
        console.log('nupur - appParticpant service appPartics is: ', appPartics);
        return appPartics;
      }
    } catch (error) {
    //   this.sitesLogger.error(
    //     'Exception occured in ParticipantService.getSiteParticipantsBySiteId() end',
    //     JSON.stringify(error),
    //   );
      // Log or handle the error as necessary
      throw new HttpException(
        `Failed to retrieve site participants by siteId: ${applicationId}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
