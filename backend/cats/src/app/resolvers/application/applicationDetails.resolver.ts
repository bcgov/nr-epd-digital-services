import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoggerService } from '../../logger/logger.service';
import { ApplicationService } from '../../services/application/application.service';
import { ApplicationSubmissionService } from '../../services/applicationSubmission/applicationSubmission.service';
import { ApplicationDetailsResponse } from '../../dto/response/application/applicationResponse';
import { ApplicationSubmissionResponse } from '../../dto/applicationSubmission.dto';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { HttpStatus } from '@nestjs/common';
import { ViewApplicationDetails } from '../../dto/application/viewApplicationDetails.dto';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { BaseHttpResponse } from '../../dto/response/baseHttpResponse';

@Resolver()
export class ApplicationDetailsResolver {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly applicationSubmissionService: ApplicationSubmissionService,
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

  @Query(() => ApplicationSubmissionResponse, {
    name: 'getSubmissionByApplicationId',
  })
  async getSubmissionByApplicationId(
    @Args('applicationId', { type: () => Int }) applicationId: number,
  ) {
    const responseProvider = new GenericResponseProvider<any>();
    try {
      const submission =
        await this.applicationSubmissionService.getSubmissionByApplicationId(
          applicationId,
        );

      if (!submission) {
        return responseProvider.createResponse(
          'No submission found for this application',
          HttpStatus.NOT_FOUND,
          false,
          null,
        );
      }

      // Fetching form schema for rendering form
      const versionNumber = submission.chefsFormVersionNumber
        ? parseInt(submission.chefsFormVersionNumber, 10)
        : null;
      let formSchema: string | null = null;
      if (versionNumber && submission.application?.appType?.abbrev) {
        try {
          const schema =
            await this.applicationSubmissionService.getFormSchemaByAppType(
              submission.application.appType.abbrev,
              submission.chefsFormId,
              versionNumber,
            );
          formSchema = JSON.stringify(schema);
        } catch (err) {
          this.loggerService.error(
            `Could not fetch form schema: ${err.message}`,
            null,
          );
        }
      }

      return responseProvider.createResponse(
        'Submission fetched successfully',
        HttpStatus.OK,
        true,
        {
          ...submission,
          formData: JSON.stringify(submission.formData),
          formSchema,
        },
      );
    } catch (error) {
      this.loggerService.error(
        `Failed to fetch submission for application ${applicationId}: ${error.message}`,
        null,
      );
      return responseProvider.createResponse(
        `Failed to fetch submission: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        false,
        null,
      );
    }
  }
}
