import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository, In } from 'typeorm';

import { AppNote } from '../../entities/appNote.entity';
import { Application } from '../../entities/application.entity';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class ApplicationNotesService {
  constructor(
    @InjectRepository(AppNote)
    private readonly appNoteRepository: Repository<AppNote>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly loggerService: LoggerService,
  ) {}

  async getApplicationNotesByApplicationId(
    applicationId: number,
  ): Promise<AppNote[]> {
    try {
      this.loggerService.log(
        `ApplicationNotesService.getApplicationNotesByApplicationId: Getting notes for application ID ${applicationId}`,
      );

      const notes = await this.appNoteRepository.find({
        where: {
          applicationId: applicationId,
        },
        order: {
          noteDate: 'DESC',
        },
      });

      this.loggerService.log(
        `ApplicationNotesService.getApplicationNotesByApplicationId: ${notes.length} notes found.`,
      );

      return plainToInstance(AppNote, notes);
    } catch (error) {
      this.loggerService.error(
        `ApplicationNotesService.getApplicationNotesByApplicationId: Error getting notes for application ID ${applicationId}`,
        error,
      );
      throw new HttpException(
        error.message || 'Failed to fetch application notes',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createApplicationNote(
    applicationId: number,
    noteDate: Date,
    noteText: string,
    user: any,
  ): Promise<AppNote[]> {
    try {
      this.loggerService.log(
        `ApplicationNotesService.createApplicationNote: Creating note for application ID ${applicationId}`,
      );

      const application = await this.applicationRepository.findOne({
        where: { id: applicationId },
      });

      if (!application) {
        throw new HttpException(
          `Application with ID ${applicationId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const currentUser = user?.name || 'SYSTEM';
      const currentDateTime = new Date();

      const newNote = this.appNoteRepository.create({
        applicationId: applicationId,
        noteDate: noteDate.toISOString().split('T')[0],
        noteText: noteText,
        rowVersionCount: 0,
        createdBy: currentUser,
        createdDateTime: currentDateTime,
        updatedBy: currentUser,
        updatedDateTime: currentDateTime,
        ts: Buffer.from(''),
      });

      await this.appNoteRepository.save(newNote);

      this.loggerService.log(
        `ApplicationNotesService.createApplicationNote: Note created successfully for application ID ${applicationId}`,
      );

      return this.getApplicationNotesByApplicationId(applicationId);
    } catch (error) {
      this.loggerService.error(
        `ApplicationNotesService.createApplicationNote: Error creating note for application ID ${applicationId}`,
        error,
      );
      throw new HttpException(
        error.message || 'Failed to create application note',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateApplicationNote(
    noteId: number,
    noteDate: Date,
    noteText: string,
    user: any,
  ): Promise<AppNote[]> {
    try {
      this.loggerService.log(
        `ApplicationNotesService.updateApplicationNote: Updating note ID ${noteId}`,
      );

      const existingNote = await this.appNoteRepository.findOne({
        where: { id: noteId },
      });

      if (!existingNote) {
        throw new HttpException(
          `Note with ID ${noteId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const currentUser = user?.name || 'SYSTEM';
      const currentDateTime = new Date();

      existingNote.noteDate = noteDate.toISOString().split('T')[0];
      existingNote.noteText = noteText;
      existingNote.updatedBy = currentUser;
      existingNote.updatedDateTime = currentDateTime;

      await this.appNoteRepository.save(existingNote);

      this.loggerService.log(
        `ApplicationNotesService.updateApplicationNote: Note ID ${noteId} updated successfully`,
      );

      return this.getApplicationNotesByApplicationId(
        existingNote.applicationId,
      );
    } catch (error) {
      this.loggerService.error(
        `ApplicationNotesService.updateApplicationNote: Error updating note ID ${noteId}`,
        error,
      );
      throw new HttpException(
        error.message || 'Failed to update application note',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteApplicationNotes(noteIds: number[]): Promise<AppNote[]> {
    try {
      this.loggerService.log(
        `ApplicationNotesService.deleteApplicationNotes: Deleting notes with IDs ${noteIds.join(
          ', ',
        )}`,
      );

      if (!noteIds || noteIds.length === 0) {
        throw new HttpException(
          'At least one note ID is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const notesToDelete = await this.appNoteRepository.find({
        where: { id: In(noteIds) },
      });

      if (notesToDelete.length === 0) {
        throw new HttpException(
          'None of the specified notes were found',
          HttpStatus.NOT_FOUND,
        );
      }

      const applicationId = notesToDelete[0].applicationId;
      // Check if all notes belong to the same application
      const multipleApplications = notesToDelete.some(
        (note) => note.applicationId !== applicationId,
      );

      if (multipleApplications) {
        throw new HttpException(
          'All notes must belong to the same application',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.appNoteRepository.remove(notesToDelete);

      this.loggerService.log(
        `ApplicationNotesService.deleteApplicationNotes: Successfully deleted ${notesToDelete.length} notes.`,
      );

      return this.getApplicationNotesByApplicationId(applicationId);
    } catch (error) {
      this.loggerService.error(
        `ApplicationNotesService.deleteApplicationNotes: Error deleting notes`,
        error,
      );
      throw new HttpException(
        error.message || 'Failed to delete application notes',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
