import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { HttpStatus, UsePipes } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { GenericValidationPipe } from '../../utils/validations/genericValidationPipe';
import { ApplicationNotesService } from '../../services/application/applicationNotes.service';
import { AppNote } from '../../entities/appNote.entity';
import {
  AppNoteDto,
  ApplicationNotesResponse,
} from '../../dto/applicationNote.dto';

@Resolver(() => AppNoteDto)
export class ApplicationNotesResolver {
  constructor(
    private readonly applicationNotesService: ApplicationNotesService,
    private readonly genericResponseProvider: GenericResponseProvider<
      AppNote[]
    >,
    private readonly loggerService: LoggerService,
  ) {}

  @Query(() => ApplicationNotesResponse, {
    name: 'getApplicationNotesByApplicationId',
  })
  @UsePipes(new GenericValidationPipe())
  async getApplicationNotesByApplicationId(
    @Args('applicationId', { type: () => Int }) applicationId: number,
  ) {
    this.loggerService.log(
      `ApplicationNotesResolver.getApplicationNotesByApplicationId: Getting notes for application ID ${applicationId}`,
    );

    const result =
      await this.applicationNotesService.getApplicationNotesByApplicationId(
        applicationId,
      );

    this.loggerService.log(
      `ApplicationNotesResolver.getApplicationNotesByApplicationId: ${result.length} notes found.`,
    );

    return this.genericResponseProvider.createResponse(
      'Application notes fetched successfully',
      HttpStatus.OK,
      true,
      result,
    );
  }
}
