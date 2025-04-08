import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppParticipantService } from '../../services/application/appParticipants.service';
import { AuthenticatedUser, Resource } from 'nest-keycloak-connect';
import { HttpStatus, UsePipes } from '@nestjs/common';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { GenericValidationPipe } from '../../utils/validations/genericValidationPipe';
import { AppParticipantsResponse } from '../../dto/response/applicationParticipant/appParticipantsResponse';
import { ViewAppParticipantsDto } from '../../dto/appParticipants/viewAppParticipants.dto';
import { LoggerService } from '../../logger/logger.service';
import { AppParticipantFilter } from '../../utilities/enums/appParticipantFilter.enum';

import { ViewParticipantsRolesDto } from '../../dto/appParticipants/viewParticipantsRoles.dto';
import { ParticipantsRolesResponse } from '../../dto/response/applicationParticipant/participantRolesResponse';
import { DropdownDto, DropdownResponse } from '../../dto/dropdown.dto';
import { CreateAppParticipantDto } from '../../dto/appParticipants/createAppParticipant.dto';
import { CreateAppParticipantsResponse } from '../../dto/response/applicationParticipant/createAppParticipantResponse';
import { ViewAppParticipantEntityDto } from '../../dto/appParticipants/viewAppParticipantEntity.dto';

@Resolver(() => ViewAppParticipantsDto)
@Resource('user-service')
export class AppParticipantResolver {
  constructor(
    private readonly appParticipantService: AppParticipantService,
    private readonly genericResponseProvider: GenericResponseProvider<
      ViewAppParticipantsDto[]
    >,
    private readonly createAppParticipantResponseProvider: GenericResponseProvider<
      ViewAppParticipantEntityDto[]
    >,
    private readonly loggerService: LoggerService,
    private readonly participantRolesResponseProvider: GenericResponseProvider<
      ViewParticipantsRolesDto[]
    >,
    private readonly personResponseProvider: GenericResponseProvider<
      DropdownDto[]
    >,
    private readonly organizationResponseProvider: GenericResponseProvider<
      DropdownDto[]
    >,
  ) { }

  @Query(() => AppParticipantsResponse, { name: 'getAppParticipantsByAppId' })
  @UsePipes(new GenericValidationPipe()) // Apply generic validation pipe
  async getAppParticipantsByAppId(
    @Args('applicationId', { type: () => Int }) applicationId: number,
    @AuthenticatedUser() user: any,
    @Args('filter', { type: () => AppParticipantFilter, nullable: true })
    filter: AppParticipantFilter,
  ) {
    const result = await this.appParticipantService.getAppParticipantsByAppId(
      applicationId,
      user,
      filter,
    );
    if (result?.length > 0) {
      this.loggerService.log(
        'AppParticipantResolver.getAppParticipantsByAppId() RES:200 end',
      );
      return this.genericResponseProvider.createResponse(
        'Participants fetched successfully',
        HttpStatus.OK,
        true,
        result,
      );
    } else {
      this.loggerService.log(
        'AppParticipantResolver.getAppParticipantsByAppId() RES:404 end',
      );
      return this.genericResponseProvider.createResponse(
        `Participants data not found for app id: ${applicationId}`,
        HttpStatus.NOT_FOUND,
        false,
        result,
      );
    }
  }

  @Query(() => ParticipantsRolesResponse, { name: 'getAllParticipantRoles' })
  @UsePipes(new GenericValidationPipe())
  async getAllParticipantRoles(@AuthenticatedUser() user: any) {
    const result = await this.appParticipantService.getAllParticipantRoles();
    if (result?.length > 0) {
      this.loggerService.log(
        'AppParticipantResolver.getAllParticipantRoles() RES:200 end',
      );
      return this.participantRolesResponseProvider.createResponse(
        'Participant roles fetched successfully',
        HttpStatus.OK,
        true,
        result,
      );
    } else {
      this.loggerService.log(
        'AppParticipantResolver.getAllParticipantRoles() RES:404 end',
      );
      return this.participantRolesResponseProvider.createResponse(
        'Participant roles data not found',
        HttpStatus.NOT_FOUND,
        false,
        result,
      );
    }
  }

  @Query(() => DropdownResponse, { name: 'getParticipantNames' })
  @UsePipes(new GenericValidationPipe())
  async getParticipantNames(
    @Args('searchParam', { type: () => String }) searchParam: string,
    @AuthenticatedUser() user: any,
  ) {
    const result = await this.appParticipantService.getParticipantNames(
      searchParam,
    );
    if (result?.length > 0) {
      this.loggerService.log(
        'AppParticipantResolver.getParticipantNames() RES:200 end',
      );
      return this.personResponseProvider.createResponse(
        'Participant names fetched successfully',
        HttpStatus.OK,
        true,
        result,
      );
    } else {
      this.loggerService.log(
        'AppParticipantResolver.getParticipantNames() RES:404 end',
      );
      return this.personResponseProvider.createResponse(
        'Participant names data not found',
        HttpStatus.NOT_FOUND,
        false,
        result,
      );
    }
  }

  @Query(() => DropdownResponse, { name: 'getOrganizations' })
  @UsePipes(new GenericValidationPipe())
  async getOrganizations(
    @Args('searchParamForOrg', { type: () => String }) searchParamForOrg: string,
    @AuthenticatedUser() user: any,
  ) {
    const result = await this.appParticipantService.getOrganizations(
      searchParamForOrg,
    );
    if (result?.length > 0) {
      this.loggerService.log(
        'AppParticipantResolver.getOrganizations() RES:200 end',
      );
      return this.organizationResponseProvider.createResponse(
        'Organization names fetched successfully',
        HttpStatus.OK,
        true,
        result,
      );
    } else {
      this.loggerService.log(
        'AppParticipantResolver.getOrganizations() RES:404 end',
      );
      return this.organizationResponseProvider.createResponse(
        'Organization names data not found',
        HttpStatus.NOT_FOUND,
        false,
        result,
      );
    }
  }

  @Mutation(() => CreateAppParticipantsResponse, { name: 'createAppParticipant' })
  @UsePipes(new GenericValidationPipe())
  async createAppParticipant(
    @Args('newAppParticipant', { type: () => CreateAppParticipantDto }) newAppParticipant: CreateAppParticipantDto,
    @AuthenticatedUser() user: any
  ) {
    const result = await this.appParticipantService.createAppParticipant(newAppParticipant, user);
    if (result) {
      this.loggerService.log('AppParticipantResolver.createAppParticipant() RES:201 end');
      return this.createAppParticipantResponseProvider.createResponse(
        'App participant added successfully',
        HttpStatus.CREATED,
        true,
        [result]
      );
    }
    else {
      this.loggerService.log('PersonNoteResolver.createPersonNote() RES:400 end');
      return this.genericResponseProvider.createResponse(
        'Failed to add app participant',
        HttpStatus.BAD_REQUEST,
        false,
        null
      );
    }
  }
}
