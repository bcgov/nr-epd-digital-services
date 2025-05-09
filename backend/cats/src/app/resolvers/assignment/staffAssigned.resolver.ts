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
import { StaffAssignmentService } from '../../services/assignment/staffAssignment.service';
import {
  StaffAssignedDto,
  ViewStaffAssignedDto,
  ViewStaffAssignedResponse,
} from '../../dto/assignment/viewStaffAssigned.dto';
import { ResponseDto } from '../../dto/response/response.dto';
import { UpdateStaffAssignedDto } from '../../dto/assignment/updateStaffAssigned.dto';
import {
  ViewStaffWithCapacityDTO,
  ViewStaffWithCapacityResponse,
} from '../../dto/assignment/viewStaffWithCapacity';

@Resolver()
@Resource('user-service')
export class StaffAssignmentResolver {
  constructor(
    private readonly service: StaffAssignmentService,
    private readonly updateResponseProvider: GenericResponseProvider<ResponseDto>,
    private readonly genericResponseProvider: GenericResponseProvider<StaffAssignedDto>,
    private readonly loggerService: LoggerService,
    private readonly staffResponseProvider: GenericResponseProvider<
      ViewStaffWithCapacityDTO[]
    >,
    private readonly drowpDownResponseProvider: GenericResponseProvider<
      DropdownDto[]
    >,
  ) {}

  @Query(() => ViewStaffAssignedResponse, { name: 'getStaffAssignedByAppId' })
  @UsePipes(new GenericValidationPipe()) // Apply generic validation pipe
  async getStaffAssignedByAppId(
    @Args('applicationId', { type: () => Int }) applicationId: number,
    @AuthenticatedUser() user: any,
  ) {
    const result = await this.service.getStaffByAppId(applicationId, user);

    this.loggerService.log(
      'StaffAssignmentResolver.getStaffAssignedByAppId() RES:200 end',
    );
    return this.genericResponseProvider.createResponse(
      'Participants fetched successfully',
      HttpStatus.OK,
      true,
      result,
    );
  }

  @Query(() => ViewStaffWithCapacityResponse, {
    name: 'getAllActiveStaffMembers',
  })
  @UsePipes(new GenericValidationPipe())
  async getAllActiveStaffMembers(@AuthenticatedUser() user: any) {
    const result =
      await this.service.getAllActiveStaffMembersWithCurrentCapacity();
    if (result?.length > 0) {
      this.loggerService.log(
        'StaffAssignmentResolver.getAllActiveStaffMembers() RES:200 end',
      );
      return this.staffResponseProvider.createResponse(
        'Participant names fetched successfully',
        HttpStatus.OK,
        true,
        result,
      );
    } else {
      this.loggerService.log(
        'StaffAssignmentResolver.getAllActiveStaffMembers() RES:404 end',
      );
      return this.staffResponseProvider.createResponse(
        'Participant names data not found',
        HttpStatus.NOT_FOUND,
        false,
        result,
      );
    }
  }

  @Query(() => DropdownResponse, { name: 'getApplicationServiceTypes' })
  @UsePipes(new GenericValidationPipe())
  async getApplicationServiceTypes(@AuthenticatedUser() user: any) {
    const result = await this.service.getApplicationServiceTypes();
    if (result?.length > 0) {
      this.loggerService.log(
        'StaffAssignmentResolver.getApplicationServiceTypes() RES:200 end',
      );
      return this.drowpDownResponseProvider.createResponse(
        'Participant names fetched successfully',
        HttpStatus.OK,
        true,
        result,
      );
    } else {
      this.loggerService.log(
        'StaffAssignmentResolver.getApplicationServiceTypes() RES:404 end',
      );
      return this.drowpDownResponseProvider.createResponse(
        'Participant names data not found',
        HttpStatus.NOT_FOUND,
        false,
        result,
      );
    }
  }

  @Mutation(() => ResponseDto, {
    name: 'updateStaffAssigned',
  })
  @UsePipes(new GenericValidationPipe())
  async updateStaffAssigned(
    @Args('staffInput', { type: () => [UpdateStaffAssignedDto] })
    staffInput: UpdateStaffAssignedDto[],
    @Args('applicationServiceTypeId', { type: () => Int })
    applicationSize: number,
    @Args('applicationId', { type: () => Int }) applicationId: number,
    @AuthenticatedUser() user: any,
  ) {
    const result = await this.service.updateStaffAssigned(
      staffInput,
      applicationId,
      applicationSize,
      user,
    );
    if (result) {
      this.loggerService.log(
        'StaffAssignmentResolver.updateStaffAssigned() RES:201 end',
      );
      return this.updateResponseProvider.createResponse(
        '',
        result ? HttpStatus.CREATED : HttpStatus.NOT_MODIFIED,
        true,
      );
    } else {
      this.loggerService.log(
        'StaffAssignmentResolver.updateStaffAssigned() RES:400 end',
      );
      return this.genericResponseProvider.createResponse(
        'Failed to updateStaffAssigned',
        HttpStatus.BAD_REQUEST,
        false,
        null,
      );
    }
  }
}
