import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { AppParticipantService } from '../../services/application/appParticipants.service';
import { AuthenticatedUser, Resource, Unprotected } from 'nest-keycloak-connect';
import { HttpStatus, UsePipes } from '@nestjs/common';
import { GenericResponseProvider } from '../../dto/reponse/genericResponseProvider';
import { GenericValidationPipe } from '../../utils/validations/genericValidationPipe';
import { AppParticipantsResponse } from '../../dto/reponse/applicationParticipant/appParticipantsResponse';
import { ViewAppParticipantsDto } from '../../dto/appParticipants/viewAppParticipantsDto';
import { AppParticipantFilter } from 'src/app/dto/appParticipants/appParticipantFilter.enum';


@Resolver(() => ViewAppParticipantsDto)
@Resource('user-service')
export class AppParticipantResolver {
  constructor(
    private readonly appParticipantService: AppParticipantService,
    private readonly genericResponseProvider: GenericResponseProvider<
      ViewAppParticipantsDto[]
    >,
  ) {}

  @Query(() => AppParticipantsResponse, { name: 'getAppParticipantsByAppId' })
  @UsePipes(new GenericValidationPipe()) // Apply generic validation pipe
  async getAppParticipantsByAppId(
    @Args('applicationId', { type: () => Int }) applicationId: number,
    //@Args('pending', { type: () => Boolean, nullable: true }) pending: boolean,
    @AuthenticatedUser() user: any,
    @Args('filter', { type: () => AppParticipantFilter, nullable: true }) filter: AppParticipantFilter,
  ) {
    console.log('nupur - AppParticipantResolver user:', user);
    const result = await this.appParticipantService.getAppParticipantsByAppId(
      applicationId,
      user,
      filter
    );
    if (result?.length > 0) {
      return this.genericResponseProvider.createResponse(
        'Participants fetched successfully',
        HttpStatus.OK,
        true,
        result,
      );
    } else {
      return this.genericResponseProvider.createResponse(
        `Participants data not found for app id: ${applicationId}`,
        HttpStatus.NOT_FOUND,
        false,
        result,
      );
    }
  }
}
