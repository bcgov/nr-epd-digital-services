import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthenticatedUser, Resource } from 'nest-keycloak-connect';
import { PersonNoteService } from '../../services/note/personNote.service';
import { HttpStatus, UsePipes } from '@nestjs/common';
import { GenericValidationPipe } from '../../utilities/validations/genericValidationPipe';
import { ViewPersonNote } from '../../dto/note/viewPersonNote.dto';
import { PersonNoteResponse } from '../../dto/response/note/personNoteResponse';
import { CreatePersonNote } from '../../dto/note/createPersonNote.dto';
import { UpdatePersonNote } from '../../dto/note/updatePersonNote.dto';
import { DeletePersonNote } from '../../dto/note/deletePersonNote.dto';

@Resolver(() => ViewPersonNote)
@Resource('user-service')
export class PersonNoteResolver {
  constructor(
    private readonly personNoteService: PersonNoteService,
    private readonly loggerService: LoggerService,
    private readonly personNoteResponse: GenericResponseProvider<
      ViewPersonNote[]
    >,
  ) {}

  @Query(() => PersonNoteResponse, { name: 'getPersonNotesByPersonId' })
  @UsePipes(new GenericValidationPipe())
  async getPersonNotesByPersonId(
    @Args('id', { type: () => Number }) id: number,
    @AuthenticatedUser() user: any,
  ) {
    const result = await this.personNoteService.getPersonNotesByPersonId(
      id,
      user,
    );
    if (result?.length > 0) {
      this.loggerService.log(
        'PersonNoteResolver.getPersonNotesByPersonId() RES:200 end',
      );
      return this.personNoteResponse.createResponse(
        'Notes fetched successfully',
        HttpStatus.OK,
        true,
        result,
      );
    } else {
      this.loggerService.log(
        'PersonNoteResolver.getPersonNotesByPersonId() RES:404 end',
      );
      return this.personNoteResponse.createResponse(
        `Notes data not found for person id: ${id}`,
        HttpStatus.NOT_FOUND,
        false,
        null,
      );
    }
  }

  @Mutation(() => PersonNoteResponse, { name: 'createPersonNote' })
  @UsePipes(new GenericValidationPipe())
  async createPersonNote(
    @Args('note', { type: () => CreatePersonNote }) note: CreatePersonNote,
    @AuthenticatedUser() user: any,
  ) {
    const result = await this.personNoteService.createPersonNote(note, user);
    if (result) {
      this.loggerService.log(
        'PersonNoteResolver.createPersonNote() RES:201 end',
      );
      return this.personNoteResponse.createResponse(
        'Note created successfully',
        HttpStatus.CREATED,
        true,
        [result],
      );
    } else {
      this.loggerService.log(
        'PersonNoteResolver.createPersonNote() RES:400 end',
      );
      return this.personNoteResponse.createResponse(
        'Failed to create note',
        HttpStatus.BAD_REQUEST,
        false,
        null,
      );
    }
  }

  @Mutation(() => PersonNoteResponse, { name: 'updatePersonNote' })
  @UsePipes(new GenericValidationPipe())
  async updatePeronNote(
    @Args('id', { type: () => String }) id: string,
    @Args('note', { type: () => UpdatePersonNote }) note: UpdatePersonNote,
    @AuthenticatedUser() user: any,
  ) {
    const result = await this.personNoteService.updatePersonNote(
      id,
      note,
      user,
    );
    if (result) {
      this.loggerService.log(
        'PersonNoteResolver.updatePersonNote() RES:200 end',
      );
      return this.personNoteResponse.createResponse(
        'Note updated successfully',
        HttpStatus.OK,
        true,
        [result],
      );
    } else {
      this.loggerService.log(
        'PersonNoteResolver.updatePersonNote() RES:404 end',
      );
      return this.personNoteResponse.createResponse(
        'Note not found for update',
        HttpStatus.NOT_FOUND,
        false,
        null,
      );
    }
  }

  @Mutation(() => PersonNoteResponse, { name: 'deletePersonNote' })
  @UsePipes(new GenericValidationPipe())
  async deletePersonNote(
    @Args('notes', { type: () => [DeletePersonNote] })
    notes: DeletePersonNote[],
    @AuthenticatedUser() user: any,
  ) {
    const result = await this.personNoteService.deletePersonNote(notes, user);
    if (result) {
      this.loggerService.log(
        'PersonNoteResolver.deletePersonNote() RES:200 end',
      );
      return this.personNoteResponse.createResponse(
        'Note deleted successfully',
        HttpStatus.OK,
        result,
        null,
      );
    } else {
      this.loggerService.log(
        'PersonNoteResolver.deletePersonNote() RES:404 end',
      );
      return this.personNoteResponse.createResponse(
        'Note not found for deletion',
        HttpStatus.NOT_FOUND,
        result,
        null,
      );
    }
  }
}
