import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository, In } from 'typeorm';

import { AppNote } from '../../entities/appNote.entity';
import { Application } from '../../entities/application.entity';
import { ApplicationSubmission } from '../../entities/applicationSubmission.entity';
import { LoggerService } from '../../logger/logger.service';
import {
  ChefsService,
  ChefsSubmissionNote,
} from '../chefs/chefs.service';

/** Skip redundant CHEFS API calls when sync was recent. */
const CHEFS_SYNC_TTL_MS = 60_000;

@Injectable()
export class ApplicationNotesService {
  private readonly lastChefsSyncAt = new Map<number, number>();

  constructor(
    @InjectRepository(AppNote)
    private readonly appNoteRepository: Repository<AppNote>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(ApplicationSubmission)
    private readonly applicationSubmissionRepository: Repository<ApplicationSubmission>,
    private readonly chefsService: ChefsService,
    private readonly loggerService: LoggerService,
  ) {}

  async getApplicationNotesByApplicationId(
    applicationId: number,
    syncChefs = false,
  ): Promise<AppNote[]> {
    try {
      this.loggerService.log(
        `ApplicationNotesService.getApplicationNotesByApplicationId: Getting notes for application ID ${applicationId} (syncChefs=${syncChefs})`,
      );

      if (syncChefs) {
        await this.syncChefsNotesForApplication(applicationId, true);
      }

      return await this.getLocalApplicationNotes(applicationId);
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

  private async getLocalApplicationNotes(
    applicationId: number,
  ): Promise<AppNote[]> {
    const notes = await this.appNoteRepository.find({
      where: {
        applicationId: applicationId,
      },
      order: {
        noteDate: 'DESC',
        createdDateTime: 'DESC',
      },
    });

    this.loggerService.log(
      `ApplicationNotesService.getLocalApplicationNotes: ${notes.length} notes found for application ID ${applicationId}.`,
    );

    return plainToInstance(AppNote, notes);
  }

  /**
   * Pull CHEFS submission notes into cats.app_note (idempotent via chefs_note_id).
   * Soft-fails so Notes tab still loads local notes if CHEFS is unavailable.
   */
  async syncChefsNotesForApplication(
    applicationId: number,
    force = false,
  ): Promise<void> {
    try {
      if (!force) {
        const lastSync = this.lastChefsSyncAt.get(applicationId);
        if (lastSync && Date.now() - lastSync < CHEFS_SYNC_TTL_MS) {
          this.loggerService.log(
            `ApplicationNotesService.syncChefsNotesForApplication: Skipping CHEFS sync for application ${applicationId}; synced ${Math.round((Date.now() - lastSync) / 1000)}s ago.`,
          );
          return;
        }
      }

      const submission = await this.applicationSubmissionRepository.findOne({
        where: { applicationId },
        order: { updatedDateTime: 'DESC' },
      });

      if (
        !submission?.chefsSubmissionId?.trim() ||
        !submission?.chefsFormId?.trim()
      ) {
        this.loggerService.log(
          `ApplicationNotesService.syncChefsNotesForApplication: No CHEFS submission for application ${applicationId}; skipping sync.`,
        );
        return;
      }

      const chefsNotes = await this.chefsService.getSubmissionNotes(
        submission.chefsFormId,
        submission.chefsSubmissionId,
      );

      this.lastChefsSyncAt.set(applicationId, Date.now());

      if (!chefsNotes.length) {
        return;
      }

      const chefsNoteIds = chefsNotes.map((n) => n.id).filter(Boolean);
      if (!chefsNoteIds.length) {
        return;
      }

      const existing = await this.appNoteRepository.find({
        where: {
          applicationId,
          chefsNoteId: In(chefsNoteIds),
        },
      });
      const existingByChefsId = new Map(
        existing
          .filter((n) => n.chefsNoteId)
          .map((n) => [n.chefsNoteId as string, n]),
      );

      const toSave: AppNote[] = [];

      for (const chefsNote of chefsNotes) {
        if (!chefsNote?.id || !chefsNote?.note?.trim()) {
          continue;
        }

        const mapped = this.mapChefsNoteToAppNoteFields(chefsNote);
        const current = existingByChefsId.get(chefsNote.id);

        if (!current) {
          toSave.push(
            this.appNoteRepository.create({
              applicationId,
              chefsNoteId: chefsNote.id,
              ...mapped,
              rowVersionCount: 0,
              ts: Buffer.from(''),
            }),
          );
          continue;
        }

        if (
          current.noteText !== mapped.noteText ||
          current.noteDate !== mapped.noteDate ||
          current.createdBy !== mapped.createdBy
        ) {
          current.noteText = mapped.noteText;
          current.noteDate = mapped.noteDate;
          current.createdBy = mapped.createdBy;
          current.updatedBy = mapped.updatedBy;
          current.updatedDateTime = mapped.updatedDateTime;
          toSave.push(current);
        }
      }

      if (toSave.length > 0) {
        await this.appNoteRepository.save(toSave);
        this.loggerService.log(
          `ApplicationNotesService.syncChefsNotesForApplication: Upserted ${toSave.length} CHEFS note(s) for application ${applicationId}.`,
        );
      }
    } catch (error) {
      this.loggerService.error(
        `ApplicationNotesService.syncChefsNotesForApplication: Failed syncing CHEFS notes for application ${applicationId}; continuing with local notes.`,
        error,
      );
    }
  }

  private mapChefsNoteToAppNoteFields(
    chefsNote: ChefsSubmissionNote,
  ): Pick<
    AppNote,
    | 'noteDate'
    | 'noteText'
    | 'createdBy'
    | 'createdDateTime'
    | 'updatedBy'
    | 'updatedDateTime'
  > {
    const createdAt = chefsNote.createdAt
      ? new Date(chefsNote.createdAt)
      : new Date();
    const updatedAt = chefsNote.updatedAt
      ? new Date(chefsNote.updatedAt)
      : createdAt;

    return {
      noteDate: createdAt.toISOString().split('T')[0],
      noteText: this.truncate(chefsNote.note.trim(), 4000),
      createdBy: this.truncate(
        (chefsNote.createdBy || 'CHEFS').trim(),
        20,
      ),
      createdDateTime: createdAt,
      updatedBy: this.truncate(
        (chefsNote.updatedBy || chefsNote.createdBy || 'CHEFS').trim(),
        20,
      ),
      updatedDateTime: updatedAt,
    };
  }

  private truncate(value: string, max: number): string {
    return value.length <= max ? value : value.slice(0, max);
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
        chefsNoteId: null,
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

      return this.getLocalApplicationNotes(applicationId);
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

      if (existingNote.chefsNoteId) {
        throw new HttpException(
          'CHEFS-synced notes cannot be edited in CATS',
          HttpStatus.BAD_REQUEST,
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

      return this.getLocalApplicationNotes(existingNote.applicationId);
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

      const chefsSynced = notesToDelete.filter((n) => n.chefsNoteId);
      if (chefsSynced.length > 0) {
        throw new HttpException(
          'CHEFS-synced notes cannot be deleted in CATS',
          HttpStatus.BAD_REQUEST,
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

      return this.getLocalApplicationNotes(applicationId);
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
