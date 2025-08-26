import { Query, Resolver } from '@nestjs/graphql';
import { AuthenticatedUser, Resource } from 'nest-keycloak-connect';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { DashboardResponse } from '../../dto/response/dashboard/dashboardResponse';
import { HttpStatus } from '@nestjs/common';
import { ViewDashboard } from '../../dto/dashboard/viewDashboard.dto';

@Resolver()
@Resource('cats-service')
export class DashboardResolver {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly loggerService: LoggerService,
    private readonly dashboardResponse: GenericResponseProvider<
      ViewDashboard[]
    >,
  ) {}

  @Query(() => DashboardResponse, { name: 'getRecentViewedApplications' })
  async getRecentViewedApplications(@AuthenticatedUser() user: any) {
    try {
      if (!user || !user?.sub) {
        this.loggerService.log(
          'An invalid user was passed into DashboardResolver.getRecentViewedApplications() end',
        );
        return this.dashboardResponse.createResponse(
          'Invalid user',
          400,
          false,
          null,
        );
      }
      this.loggerService.log(
        `DashboardResolver.getRecentViewedApplications() user: ${user?.sub}`,
      );
      this.loggerService.log(
        'DashboardResolver.getRecentViewedApplications() calling DashboardService.getRecentViewedApplications()',
      );

      // Call the service to get recent viewed applications
      this.loggerService.log(
        'DashboardResolver.getRecentViewedApplications() start',
      );

      const result =
        await this.dashboardService.getRecentViewedApplications(user);

      if (result?.length > 0) {
        this.loggerService.log(
          'DashboardResolver.getRecentViewedApplications() RES:200 end',
        );
        return this.dashboardResponse.createResponse(
          'Recent viewed applications retrieved successfully',
          HttpStatus.OK,
          true,
          result,
        );
      } else {
        this.loggerService.log(
          'DashboardResolver.getRecentViewedApplications() RES:404 end',
        );
        return this.dashboardResponse.createResponse(
          'No recent viewed applications found',
          HttpStatus.NOT_FOUND,
          false,
          null,
        );
      }
    } catch (error) {
      this.loggerService.error(
        `Error in getRecentViewedApplications: ${error.message}`,
        error,
      );
      return this.dashboardResponse.createResponse(
        'Failed to retrieve recent viewed applications',
        HttpStatus.INTERNAL_SERVER_ERROR,
        false,
        null,
      );
    }
  }

  @Query(() => DashboardResponse, { name: 'getApplications' })
  async getApplications() {
    try {
      // Log the start of the method
      this.loggerService.log('DashboardResolver.getApplications() start');
      this.loggerService.log(
        'DashboardResolver.getApplications() calling DashboardService.getApplications()',
      );

      // Call the service to get applications
      this.loggerService.log('DashboardResolver.getApplications() start');

      const result: any = await this.dashboardService.getApplications();

      if (result?.length > 0) {
        this.loggerService.log(
          'DashboardResolver.getApplications() RES:200 end',
        );
        return this.dashboardResponse.createResponse(
          'Recent viewed applications retrieved successfully',
          HttpStatus.OK,
          true,
          result,
        );
      } else {
        this.loggerService.log(
          'DashboardResolver.getApplications() RES:404 end',
        );
        return this.dashboardResponse.createResponse(
          'No recent viewed applications found',
          HttpStatus.NOT_FOUND,
          false,
          null,
        );
      }
    } catch (error) {
      this.loggerService.error(
        `Error in getApplications: ${error.message}`,
        error,
      );
      return this.dashboardResponse.createResponse(
        'Failed to retrieve applications',
        HttpStatus.INTERNAL_SERVER_ERROR,
        false,
        null,
      );
    }
  }
}
