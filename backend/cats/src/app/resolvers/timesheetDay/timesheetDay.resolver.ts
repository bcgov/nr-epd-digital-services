import { Args, Mutation, Resolver, Query, Int } from '@nestjs/graphql';
import { HttpStatus, UsePipes } from '@nestjs/common';
import { TimesheetDayService } from '../../services/timesheetDay/timesheetDay.service';
import {
  TimesheetDayDto,
  TimesheetDayResponse,
  UpsertTimesheetDaysInputDto,
  PersonWithTimesheetDaysDto,
  PersonWithTimesheetDaysResponse,
} from '../../dto/timesheetDay.dto';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { GenericValidationPipe } from '../../utils/validations/genericValidationPipe';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { LoggerService } from '../../logger/logger.service';

@Resolver(() => TimesheetDayDto)
export class TimesheetDayResolver {
  constructor(
    private readonly timesheetDayService: TimesheetDayService,
    private readonly loggerService: LoggerService,
  ) {}

  @Mutation(() => TimesheetDayResponse, { name: 'upsertTimesheetDays' })
  @UsePipes(new GenericValidationPipe())
  async upsertTimesheetDays(
    @Args('input') input: UpsertTimesheetDaysInputDto,
    @AuthenticatedUser() user: any,
  ) {
    const responseProvider = new GenericResponseProvider<TimesheetDayDto[]>();
    this.loggerService.log(
      `Received upsertTimesheetDays mutation by user: ${user?.name}`,
    );
    try {
      const result = await this.timesheetDayService.upsertTimesheetDays(
        input.entries,
        user,
      );
      const dtos: TimesheetDayDto[] = result.map((item) => ({
        id: item.id,
        applicationId: item.applicationId,
        personId: item.personId,
        date: new Date(item.date),
        hours: item.hours ? parseFloat(item.hours) : 0,
      }));
      this.loggerService.log(
        `Successfully upserted ${dtos.length} timesheet day entries by user: ${user?.name}`,
      );
      return responseProvider.createResponse(
        'Timesheet days upserted successfully',
        HttpStatus.CREATED,
        true,
        dtos,
      );
    } catch (error) {
      this.loggerService.error(
        `Error in upsertTimesheetDays resolver: ${error.message}`,
        error.stack,
      );
      return responseProvider.createResponse(
        error.message || 'Failed to upsert timesheet days',
        HttpStatus.BAD_REQUEST,
        false,
        [],
      );
    }
  }

  @Query(() => PersonWithTimesheetDaysResponse, {
    name: 'getTimesheetDaysForAssignedStaff',
  })
  async getTimesheetDaysForAssignedStaff(
    @Args('applicationId', { type: () => Int }) applicationId: number,
    @Args('startDate', { type: () => String }) startDate: string,
    @Args('endDate', { type: () => String }) endDate: string,
    @AuthenticatedUser() user: any,
  ): Promise<PersonWithTimesheetDaysResponse> {
    const responseProvider = new GenericResponseProvider<
      PersonWithTimesheetDaysDto[]
    >();
    this.loggerService.log(
      `Received getTimesheetDaysForAssignedStaff query for applicationId=${applicationId}, startDate=${startDate}, endDate=${endDate}, user: ${user?.name}`,
    );
    try {
      const data =
        await this.timesheetDayService.getTimesheetDaysForAssignedStaff(
          applicationId,
          startDate,
          endDate,
          user,
        );
      this.loggerService.log(
        `Successfully fetched timesheet days for assigned staff for applicationId=${applicationId}`,
      );
      return responseProvider.createResponse(
        'Fetched timesheet days for assigned staff',
        HttpStatus.OK,
        true,
        data,
      );
    } catch (error) {
      this.loggerService.error(
        `Error in getTimesheetDaysForAssignedStaff resolver: ${error.message}`,
        error.stack,
      );
      return responseProvider.createResponse(
        error.message || 'Failed to fetch timesheet days for assigned staff',
        HttpStatus.BAD_REQUEST,
        false,
        [],
      );
    }
  }
}
