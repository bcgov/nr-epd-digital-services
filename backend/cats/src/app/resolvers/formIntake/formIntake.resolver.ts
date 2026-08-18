import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HttpStatus } from '@nestjs/common';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { LoggerService } from '../../logger/logger.service';
import { FormIntakeService } from '../../services/formIntake/formIntake.service';
import { getAvailableForms } from '../../services/formIntake/formIntake.constants';
import {
  ManualIntakeFormDto,
  ManualIntakeFormsResponse,
  ManualIntakeResponse,
  ManualIntakeResultDto,
} from '../../dto/formIntake.dto';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';

@Resolver()
export class FormIntakeResolver {
  constructor(
    private readonly formIntakeService: FormIntakeService,
    private readonly loggerService: LoggerService,
    private readonly formsResponseProvider: GenericResponseProvider<
      ManualIntakeFormDto[]
    >,
    private readonly intakeResponseProvider: GenericResponseProvider<ManualIntakeResultDto>,
  ) {}

  @Query(() => ManualIntakeFormsResponse, { name: 'getManualIntakeForms' })
  getManualIntakeForms() {
    return this.formsResponseProvider.createResponse(
      'Manual intake forms retrieved successfully',
      HttpStatus.OK,
      true,
      getAvailableForms(),
    );
  }

  @Mutation(() => ManualIntakeResponse, {
    name: 'processChefsSubmissionManually',
  })
  async processChefsSubmissionManually(
    @Args('appTypeAbbrev') appTypeAbbrev: string,
    @Args('chefsSubmissionId') chefsSubmissionId: string,
    @AuthenticatedUser() user: any,
  ) {
    this.loggerService.log(
      'FormIntakeResolver.processChefsSubmissionManually() start',
    );

    try {
      const submission = await this.formIntakeService.fetchAndProcessSubmission(
        appTypeAbbrev,
        chefsSubmissionId,
        user?.preferred_username ?? 'SYSTEM',
      );

      this.loggerService.log(
        'FormIntakeResolver.processChefsSubmissionManually() RES:200 end',
      );

      return this.intakeResponseProvider.createResponse(
        'Submission processed successfully',
        HttpStatus.OK,
        true,
        {
          submissionId: submission.id,
          applicationId: submission.applicationId ?? null,
        },
      );
    } catch (error) {
      this.loggerService.error(
        'FormIntakeResolver.processChefsSubmissionManually() error',
        error,
      );

      return this.intakeResponseProvider.createResponse(
        error.message || 'Failed to process submission',
        HttpStatus.INTERNAL_SERVER_ERROR,
        false,
        null,
      );
    }
  }
}
