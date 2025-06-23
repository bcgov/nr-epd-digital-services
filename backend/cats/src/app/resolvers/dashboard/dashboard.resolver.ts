import { Query, Resolver } from "@nestjs/graphql";
import { AuthenticatedUser, Resource } from "nest-keycloak-connect";
import { DashboardService } from "../../services/dashboard/dashboard.service";
import { LoggerService } from "../../logger/logger.service";
import { GenericResponseProvider } from "../../dto/response/genericResponseProvider";
import { RecentViewedApplication } from "../../entities/RecentViewedApplication.entity";
import { DashboardResponse } from "../../dto/response/dashboard/dashboardResponse";
import { HttpStatus } from "@nestjs/common";

@Resolver(() => RecentViewedApplication)
@Resource('cats-service')
export class DashboardResolver {
    constructor(
        private readonly dashboardService: DashboardService,
        private readonly loggerSerivce: LoggerService,
        private readonly dashboardResponse: GenericResponseProvider<RecentViewedApplication[]>,
    ){}

    @Query(() => DashboardResponse, { name: 'getRecentViewedApplications' })
    async getRecentViewedApplications(@AuthenticatedUser() user: any,)
    {
        if(!user || !user?.sub)
        {
            this.loggerSerivce.log('An invalid user was passed into DashboardResolver.getRecentViewedApplications() end');
            return this.dashboardResponse.createResponse(
                'Invalid user',
                400,
                false,
                null,
            );
        }
        this.loggerSerivce.log(`DashboardResolver.getRecentViewedApplications() user: ${user?.sub}`);
        this.loggerSerivce.log('DashboardResolver.getRecentViewedApplications() calling DashboardService.getRecentViewedApplications()');

        // Call the service to get recent viewed applications
        this.loggerSerivce.log('DashboardResolver.getRecentViewedApplications() start');

        const result = await this.dashboardService.getRecentViewedApplications(user);

        if(result?.length > 0)
        {
            this.loggerSerivce.log('DashboardResolver.getRecentViewedApplications() RES:200 end');
            return this.dashboardResponse.createResponse(
                'Recent viewed applications retrieved successfully',
                HttpStatus.OK,
                true,
                result,
            );
        }
        else
        {
            this.loggerSerivce.log('DashboardResolver.getRecentViewedApplications() RES:404 end');
            return this.dashboardResponse.createResponse(
                'No recent viewed applications found',
                HttpStatus.NOT_FOUND,
                false,
                null,
            );
        }
    }
}