import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { AppParticipantService } from '../../services/application/appParticipants.service';
import { AuthenticatedUser, Resource } from 'nest-keycloak-connect';
import { HttpStatus, UsePipes } from '@nestjs/common';
import { GenericResponseProvider } from '../../dto/reponse/genericResponseProvider';
import { GenericValidationPipe } from '../../utils/validations/genericValidationPipe';
import { AppParticipantsResponse } from '../../dto/reponse/applicationParticipant/appParticipantsResponse';
import { ViewAppParticipantsDto } from 'src/app/dto/appParticipants/viewAppParticipants.dto';
import { LoggerService } from 'src/app/logger/logger.service';
import { AppParticipantFilter } from 'src/app/utilities/enums/appParticipantFilter.enum';


@Resolver(() => ViewAppParticipantsDto)
@Resource('user-service')
export class AppParticipantResolver {
  constructor(
    private readonly appParticipantService: AppParticipantService,
    private readonly genericResponseProvider: GenericResponseProvider<
      ViewAppParticipantsDto[]
    >,
    private readonly loggerSerivce: LoggerService,
  ) {}

  @Query(() => AppParticipantsResponse, { name: 'getAppParticipantsByAppId' })
  @UsePipes(new GenericValidationPipe()) // Apply generic validation pipe
  async getAppParticipantsByAppId(
    @Args('applicationId', { type: () => Int }) applicationId: number,
    @AuthenticatedUser() user: any,
    @Args('filter', { type: () => AppParticipantFilter, nullable: true }) filter: AppParticipantFilter,
  ) {
    const result = await this.appParticipantService.getAppParticipantsByAppId(
      applicationId,
      user,
      filter
    );
    if (result?.length > 0) {
      this.loggerSerivce.log('AppParticipantResolver.getAppParticipantsByAppId() RES:200 end');
      return this.genericResponseProvider.createResponse(
        'Participants fetched successfully',
        HttpStatus.OK,
        true,
        result,
      );
    } else {
      this.loggerSerivce.log('AppParticipantResolver.getAppParticipantsByAppId() RES:404 end');
      return this.genericResponseProvider.createResponse(
        `Participants data not found for app id: ${applicationId}`,
        HttpStatus.NOT_FOUND,
        false,
        result,
      );
    }
  }
}
