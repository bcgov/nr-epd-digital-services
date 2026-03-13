import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoggerService } from '../../logger/logger.service';
import { ApplicationService } from '../../services/application/application.service';
import { ApplicationDetailsResponse } from '../../dto/response/application/applicationResponse';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { HttpStatus } from '@nestjs/common';
import { ViewApplicationDetails } from '../../dto/application/viewApplicationDetails.dto';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { BaseHttpResponse } from '../../dto/response/baseHttpResponse';

@Resolver()
export class ApplicationDetailsResolver {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly loggerService: LoggerService,
    private readonly applicationDetailsResponse: GenericResponseProvider<ViewApplicationDetails>,
  ) {}

  @Query(() => ApplicationDetailsResponse, {
    name: 'getApplicationDetailsById',
  })
  async getApplicationDetailsById(
    @Args('id', { type: () => Int }) id: number,
    @AuthenticatedUser() user: any,
  ) {
    this.loggerService.log(
      'ApplicationDetailsResolver.getApplicationDetailsById() start',
    );

    try {
      const result = await this.applicationService.findApplicationDetailsById(
        id,
        user,
      );

      if (result) {
        this.loggerService.log(
          'ApplicationDetailsResolver.getApplicationDetailsById() RES:200 end',
        );
        return this.applicationDetailsResponse.createResponse(
          'Application details retrieved successfully',
          HttpStatus.OK,
          true,
          result,
        );
      } else {
        this.loggerService.log(
          'ApplicationDetailsResolver.getApplicationDetailsById() RES:404 end',
        );
        return this.applicationDetailsResponse.createResponse(
          'Application not found',
          HttpStatus.NOT_FOUND,
          false,
          null,
        );
      }
    } catch (error) {
      this.loggerService.error(
        'ApplicationDetailsResolver.getApplicationDetailsById() error',
        error,
      );
      return this.applicationDetailsResponse.createResponse(
        'Error retrieving application details',
        HttpStatus.INTERNAL_SERVER_ERROR,
        false,
        null,
      );
    }
  }

  @Mutation(() => BaseHttpResponse, {
    name: 'updateApplicationServiceType',
  })
  async updateApplicationServiceType(
    @Args('applicationId', { type: () => Int }) applicationId: number,
    @Args('serviceTypeId', { type: () => Int, nullable: true })
    serviceTypeId: number | null,
    @AuthenticatedUser() user: any,
  ): Promise<BaseHttpResponse> {
    this.loggerService.log(
      'ApplicationDetailsResolver.updateApplicationServiceType() start',
    );

    try {
      await this.applicationService.updateApplicationServiceType(
        applicationId,
        serviceTypeId,
        user,
      );

      this.loggerService.log(
        'ApplicationDetailsResolver.updateApplicationServiceType() RES:200 end',
      );

      return new BaseHttpResponse(
        'Application service type updated successfully',
        HttpStatus.OK,
        true,
      );
    } catch (error) {
      this.loggerService.error(
        'ApplicationDetailsResolver.updateApplicationServiceType() error',
        error,
      );

      return new BaseHttpResponse(
        error.message || 'Failed to update application service type',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        false,
      );
    }
  }

  @Mutation(() => BaseHttpResponse, {
    name: 'updateSecondaryServiceTypes',
  })
  async updateSecondaryServiceTypes(
    @Args('applicationId', { type: () => Int }) applicationId: number,
    @Args('serviceTypeIds', { type: () => [Int] }) serviceTypeIds: number[],
    @AuthenticatedUser() user: any,
  ): Promise<BaseHttpResponse> {
    this.loggerService.log(
      'ApplicationDetailsResolver.updateSecondaryServiceTypes() start',
    );

    try {
      await this.applicationService.updateSecondaryServiceTypes(
        applicationId,
        serviceTypeIds,
        user,
      );

      this.loggerService.log(
        'ApplicationDetailsResolver.updateSecondaryServiceTypes() RES:200 end',
      );

      return new BaseHttpResponse(
        'Secondary service types updated successfully',
        HttpStatus.OK,
        true,
      );
    } catch (error) {
      this.loggerService.error(
        'ApplicationDetailsResolver.updateSecondaryServiceTypes() error',
        error,
      );

      return new BaseHttpResponse(
        error.message || 'Failed to update secondary service types',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        false,
      );
    }
  }
}
