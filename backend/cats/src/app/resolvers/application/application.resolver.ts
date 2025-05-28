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

@Resolver()
export class ApplicationResolver {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly loggerService: LoggerService,
    private readonly applicationResponse: GenericResponseProvider<
      ViewApplication[]
    >,
  ) {}

  @Unprotected()
  @Mutation(() => ApplicationResponse, { name: 'createApplication' })
  @UsePipes(new GenericValidationPipe())
  async createApplication(
    @Args('application', { type: () => CreateApplication })
    application: CreateApplication,
  ) {
    this.loggerService.log('ApplicationResolver.createApplication() start');
    const result = await this.applicationService.createApplication(application);

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
  }
}
