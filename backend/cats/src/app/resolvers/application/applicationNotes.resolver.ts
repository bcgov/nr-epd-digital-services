import { Args, Int, Query, Resolver, Mutation } from '@nestjs/graphql';
import { HttpStatus, UsePipes, HttpException } from '@nestjs/common';
import { AuthenticatedUser } from 'nest-keycloak-connect';
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

  @Mutation(() => ApplicationNotesResponse, {
    name: 'createApplicationNote',
  })
  @UsePipes(new GenericValidationPipe())
  async createApplicationNote(
    @Args('applicationId', { type: () => Int }) applicationId: number,
    @Args('noteDate', { type: () => Date }) noteDate: Date,
    @Args('noteText', { type: () => String }) noteText: string,
    @AuthenticatedUser() user: any,
  ) {
    const validationErrors = [];

    if (!user) {
      validationErrors.push('User is required');
    }

    if (!applicationId) {
      validationErrors.push('Application ID is required');
    }

    if (!noteDate) {
      validationErrors.push('Note date is required');
    }

    if (!noteText?.trim()) {
      validationErrors.push('Note text is required');
    }

    if (validationErrors.length > 0) {
      throw new HttpException(
        { message: 'Validation failed', errors: validationErrors },
        HttpStatus.BAD_REQUEST,
      );
    }

    this.loggerService.log(
      `ApplicationNotesResolver.createApplicationNote: Creating note for application ID ${applicationId}`,
    );

    const result = await this.applicationNotesService.createApplicationNote(
      applicationId,
      noteDate,
      noteText,
      user,
    );

    return this.genericResponseProvider.createResponse(
      'Application note created successfully',
      HttpStatus.CREATED,
      true,
      result,
    );
  }

  @Mutation(() => ApplicationNotesResponse, {
    name: 'updateApplicationNote',
  })
  @UsePipes(new GenericValidationPipe())
  async updateApplicationNote(
    @Args('noteId', { type: () => Int }) noteId: number,
    @Args('noteDate', { type: () => Date }) noteDate: Date,
    @Args('noteText', { type: () => String }) noteText: string,
    @AuthenticatedUser() user: any,
  ) {
    const validationErrors = [];

    if (!user) {
      validationErrors.push('User is required');
    }

    if (!noteId) {
      validationErrors.push('Note ID is required');
    }

    if (!noteDate) {
      validationErrors.push('Note date is required');
    }

    if (!noteText?.trim()) {
      validationErrors.push('Note text is required');
    }

    if (validationErrors.length > 0) {
      throw new HttpException(
        { message: 'Validation failed', errors: validationErrors },
        HttpStatus.BAD_REQUEST,
      );
    }

    this.loggerService.log(
      `ApplicationNotesResolver.updateApplicationNote: Updating note ID ${noteId}`,
    );

    const result = await this.applicationNotesService.updateApplicationNote(
      noteId,
      noteDate,
      noteText,
      user,
    );

    return this.genericResponseProvider.createResponse(
      'Application note updated successfully',
      HttpStatus.OK,
      true,
      result,
    );
  }

  @Mutation(() => ApplicationNotesResponse, {
    name: 'deleteApplicationNotes',
  })
  @UsePipes(new GenericValidationPipe())
  async deleteApplicationNotes(
    @Args('noteIds', { type: () => [Int] }) noteIds: number[],
    @AuthenticatedUser() user: any,
  ) {
    const validationErrors = [];

    if (!user) {
      validationErrors.push('User is required');
    }

    if (!noteIds || noteIds.length === 0) {
      validationErrors.push('At least one note ID is required');
    }

    if (validationErrors.length > 0) {
      throw new HttpException(
        { message: 'Validation failed', errors: validationErrors },
        HttpStatus.BAD_REQUEST,
      );
    }

    this.loggerService.log(
      `ApplicationNotesResolver.deleteApplicationNotes: Deleting notes with IDs ${noteIds.join(
        ', ',
      )}`,
    );

    const result =
      await this.applicationNotesService.deleteApplicationNotes(noteIds);

    return this.genericResponseProvider.createResponse(
      'Application notes deleted successfully',
      HttpStatus.OK,
      true,
      result,
    );
  }
}
