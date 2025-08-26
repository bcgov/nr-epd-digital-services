import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { LoggerService } from '../../logger/logger.service';
import { ApplicationService } from '../../services/application/application.service';
import { ApplicationDetailsResponse } from '../../dto/response/application/applicationResponse';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { HttpStatus } from '@nestjs/common';
import { ViewApplicationDetails } from '../../dto/application/viewApplicationDetails.dto';
import { AuthenticatedUser } from 'nest-keycloak-connect';

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
}
