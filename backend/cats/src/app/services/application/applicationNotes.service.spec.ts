import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { ApplicationNotesService } from './applicationNotes.service';
import { AppNote } from '../../entities/appNote.entity';
import { HttpException } from '@nestjs/common';

describe('ApplicationNotesService', () => {
  let service: ApplicationNotesService;
  let appNoteRepository: Repository<AppNote>;

  const mockNotes = [
    {
      id: 1,
      applicationId: 123,
      noteDate: '2023-01-01',
      noteText: 'Test note 1',
      rowVersionCount: 1,
      createdBy: 'Test User',
      createdDateTime: new Date(),
      updatedBy: 'Test User',
      updatedDateTime: new Date(),
    },
    {
      id: 2,
      applicationId: 123,
      noteDate: '2023-01-02',
      noteText: 'Test note 2',
      rowVersionCount: 1,
      createdBy: 'Test User',
      createdDateTime: new Date(),
      updatedBy: 'Test User',
      updatedDateTime: new Date(),
    },
  ] as AppNote[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationNotesService,
        {
          provide: getRepositoryToken(AppNote),
          useClass: Repository,
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ApplicationNotesService>(ApplicationNotesService);
    appNoteRepository = module.get<Repository<AppNote>>(
      getRepositoryToken(AppNote),
    );
  });

  describe('getApplicationNotesByApplicationId', () => {
    it('should return notes for an application', async () => {
      jest.spyOn(appNoteRepository, 'find').mockResolvedValue(mockNotes);

      const result = await service.getApplicationNotesByApplicationId(123);

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(result[0].noteText).toBe('Test note 1');
      expect(result[1].noteText).toBe('Test note 2');
      expect(appNoteRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            applicationId: 123,
          },
        }),
      );
    });

    it('should throw an exception when find operation fails', async () => {
      jest.spyOn(appNoteRepository, 'find').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(
        service.getApplicationNotesByApplicationId(123),
      ).rejects.toThrow(HttpException);
    });
  });
});
