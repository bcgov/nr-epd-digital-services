import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { AppNote } from '../../entities/appNote.entity';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class ApplicationNotesService {
  constructor(
    @InjectRepository(AppNote)
    private readonly appNoteRepository: Repository<AppNote>,
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
}
