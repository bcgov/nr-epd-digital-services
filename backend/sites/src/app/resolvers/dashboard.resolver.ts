import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RecentViews } from '../entities/recentViews.entity';
import { DashboardService } from '../services/dashboard.service';
import { ValidationPipe } from '@nestjs/common';
import { RecentViewDto } from '../dto/recentView.dto';
import { DashboardResponse } from '../dto/response/fetchSiteResponse';
import { RoleMatchingMode, Roles } from 'nest-keycloak-connect';

@Resolver(() => RecentViews)
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles({ roles: ['site-admin'], mode: RoleMatchingMode.ANY })
  @Query(() => DashboardResponse, { name: 'getRecentViewsByUserId' })
  async getRecentViewsByUserId(
    @Args('userId', { type: () => String }) userId: string,
  ) {
    const result = await this.dashboardService.getRecentViewsByUserId(userId);
    if (result) {
      return { httpStatusCode: 200, message: 'Success', data: result };
    }

    return {
      httpStatusCode: 404,
      message: `Data not found for user id: ${userId}`,
      data: result,
    };
  }

  @Roles({ roles: ['site-admin'], mode: RoleMatchingMode.ANY })
  @Mutation(() => DashboardResponse, { name: 'addRecentView' })
  async addRecentView(
    @Args('recentView', { type: () => RecentViewDto }, new ValidationPipe())
    recentView: RecentViewDto,
  ) {
    const result = await this.dashboardService.addRecentView(recentView);

    if (result) {
      return { httpStatusCode: 201, message: result };
    }

    return { httpStatusCode: 400, message: 'Bad Request.' };
  }
}
