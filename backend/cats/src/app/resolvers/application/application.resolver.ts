import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { HttpStatus, UsePipes } from '@nestjs/common';
import { GenericValidationPipe } from '../../utilities/validations/genericValidationPipe';
import { ApplicationService } from '../../services/application/application.service';
import { CreateApplication } from '../../dto/application/createApplication.dto';
import { ViewApplication } from '../../dto/application/viewApplication.dto';
import { ApplicationResponse } from '../../dto/response/application/applicationResponse';
import { Unprotected } from 'nest-keycloak-connect';
import { UpdateApplicationStatusDto } from '../../dto/application/updateApplicationStatus.dto';
import { ApplicationStatusResponse } from '../../dto/response/application/applicationStatusResponse';
import { ViewApplicationStatus } from '../../dto/application/viewApplicationStatus.dto';

@Resolver()
export class ApplicationResolver {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly loggerService: LoggerService,
    private readonly applicationResponse: GenericResponseProvider<
      ViewApplication[]
    >,
    private readonly applicationStatusResponse: GenericResponseProvider<
      ViewApplicationStatus[]
    >,
  ) { }

  @Unprotected()
  @Mutation(() => ApplicationResponse, { name: 'createApplication' })
  @UsePipes(new GenericValidationPipe())
  async createApplication(
    @Args('application', { type: () => CreateApplication })
    application: CreateApplication,
  ) {
    try {
      this.loggerService.log(
        'ApplicationResolver.createApplication() start' +
        JSON.stringify(application),
      );
      const result = await this.applicationService.createApplication(
        application,
      );

      if (result) {
        this.loggerService.log(
          'ApplicationResolver.createApplication() RES:201 end',
        );
        return this.applicationResponse.createResponse(
          'Application created successfully',
          HttpStatus.CREATED,
          true,
          [result],
        );
      } else {
        this.loggerService.log(
          'ApplicationResolver.createApplication() RES:400 end',
        );
        return this.applicationResponse.createResponse(
          'Failed to create application',
          HttpStatus.BAD_REQUEST,
          false,
          null,
        );
      }
    } catch (error) {
      this.loggerService.error(
        'ApplicationResolver.createApplication() error',
        error,
      );
      return this.applicationResponse.createResponse(
        'Error creating application',
        HttpStatus.INTERNAL_SERVER_ERROR,
        false,
        null,
      );
    }
  }

  @Unprotected()
  @Mutation(() => ApplicationStatusResponse, { name: 'updateFormsflowAppId' })
  @UsePipes(new GenericValidationPipe())
  async updateFormsflowAppId(
    @Args('appStatusInput') appStatusInput: UpdateApplicationStatusDto,
  ) {
    try {
      this.loggerService.log(
        'ApplicationResolver.updateFormsflowAppId() start',
      );
      const result = await this.applicationService.updateFormsflowAppId(
        appStatusInput,
      );

      if (result) {
        this.loggerService.log('ApplicationResolver.updateFormsflowAppId() RES:200 end');
        return this.applicationStatusResponse.createResponse(
          'Application status updated successfully',
          HttpStatus.OK,
          true,
          [result],
        );
      }
      else {
        this.loggerService.log('ApplicationResolver.updateFormsflowAppId()RES:404 end');
        return this.applicationStatusResponse.createResponse(
          'Note not found for update',
          HttpStatus.NOT_FOUND,
          false,
          null,
        );
      }

    } catch (error) {
      this.loggerService.error(
        'ApplicationResolver.updateFormsflowAppId() error',
        error,
      );
      return this.applicationStatusResponse.createResponse(
        'Error updating FormsflowAppId in ApplicationResolver.updateFormsflowAppId()',
        HttpStatus.INTERNAL_SERVER_ERROR,
        false,
        null,
      );
    }
  }
}
