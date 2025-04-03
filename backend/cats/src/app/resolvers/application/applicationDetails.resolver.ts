import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { LoggerService } from '../../logger/logger.service';
import { ApplicationService } from '../../services/application/application.service';
import { ApplicationDetailsResponse } from '../../dto/response/application/applicationResponse';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { HttpStatus } from '@nestjs/common';
import { ViewApplicationDetails } from '../../dto/application/viewApplicationDetails.dto';

@Resolver()
export class ApplicationDetailsResolver {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly loggerService: LoggerService,
    private readonly applicationDetailsResponse: GenericResponseProvider<ViewApplicationDetails>,
  ) {}

  @Query(() => ApplicationDetailsResponse, { name: 'getApplicationById' })
  async getApplicationById(@Args('id', { type: () => Int }) id: number) {
    this.loggerService.log(
      'ApplicationDetailsResolver.getApplicationById() start',
    );

    try {
      const result = await this.applicationService.findApplicationDetailsById(
        id,
      );

      if (result) {
        this.loggerService.log(
          'ApplicationDetailsResolver.getApplicationById() RES:200 end',
        );
        return this.applicationDetailsResponse.createResponse(
          'Application details retrieved successfully',
          HttpStatus.OK,
          true,
          result,
        );
      } else {
        this.loggerService.log(
          'ApplicationDetailsResolver.getApplicationById() RES:404 end',
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
        'ApplicationDetailsResolver.getApplicationById() error',
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
