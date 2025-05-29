import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { ApplicationNotesService } from './applicationNotes.service';
import { AppNote } from '../../entities/appNote.entity';
import { HttpException } from '@nestjs/common';
import { Application } from '../../entities/application.entity';

describe('ApplicationNotesService', () => {
  let service: ApplicationNotesService;
  let appNoteRepository: Repository<AppNote>;
  let applicationRepository: Repository<Application>;

  const mockUser = { name: 'Test User' };

  const mockNotes = [
    {
      id: 1,
      applicationId: 123,
      noteDate: '2025-01-01',
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
      noteDate: '2025-01-02',
      noteText: 'Test note 2',
      rowVersionCount: 1,
      createdBy: 'Test User',
      createdDateTime: new Date(),
      updatedBy: 'Test User',
      updatedDateTime: new Date(),
    },
    {
      id: 3,
      applicationId: 456,
      noteDate: '2025-01-03',
      noteText: 'Test note for different application',
      rowVersionCount: 1,
      createdBy: 'Test User',
      createdDateTime: new Date(),
      updatedBy: 'Test User',
      updatedDateTime: new Date(),
    },
  ] as AppNote[];

  const mockApplication = { id: 123 } as Application;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationNotesService,
        {
          provide: getRepositoryToken(AppNote),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Application),
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
    applicationRepository = module.get<Repository<Application>>(
      getRepositoryToken(Application),
    );
  });

  describe('getApplicationNotesByApplicationId', () => {
    it('should return notes for an application', async () => {
      jest.spyOn(appNoteRepository, 'find').mockResolvedValue(mockNotes);

      const result = await service.getApplicationNotesByApplicationId(123);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].noteText).toBe('Test note 1');
      expect(result[1].noteText).toBe('Test note 2');
      expect(result[2].noteText).toBe('Test note for different application');
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

  describe('createApplicationNote', () => {
    it('should create a note for an application', async () => {
      const testDate = new Date('2025-03-01');
      const noteText = 'New test note';
      const applicationId = 123;

      const mockCreatedNote = {
        id: 3,
        applicationId,
        noteDate: testDate.toISOString().split('T')[0],
        noteText,
        rowVersionCount: 0,
        createdBy: mockUser.name,
        createdDateTime: expect.any(Date),
      } as AppNote;

      jest
        .spyOn(applicationRepository, 'findOne')
        .mockResolvedValue(mockApplication);
      jest.spyOn(appNoteRepository, 'create').mockReturnValue(mockCreatedNote);
      jest.spyOn(appNoteRepository, 'save').mockResolvedValue(mockCreatedNote);
      jest
        .spyOn(service, 'getApplicationNotesByApplicationId')
        .mockResolvedValue([...mockNotes, mockCreatedNote]);

      const result = await service.createApplicationNote(
        applicationId,
        testDate,
        noteText,
        mockUser,
      );

      expect(result).toBeDefined();
      expect(result.length).toBe(4);
      expect(appNoteRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          applicationId,
          noteDate: testDate.toISOString().split('T')[0],
          noteText,
          createdBy: mockUser.name,
        }),
      );
      expect(appNoteRepository.save).toHaveBeenCalled();
      expect(service.getApplicationNotesByApplicationId).toHaveBeenCalledWith(
        applicationId,
      );
    });

    it('should throw an exception when application is not found', async () => {
      jest.spyOn(applicationRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.createApplicationNote(
          999, // Non-existent application ID
          new Date(),
          'Test note',
          mockUser,
        ),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an exception when save operation fails', async () => {
      jest
        .spyOn(applicationRepository, 'findOne')
        .mockResolvedValue(mockApplication);
      jest.spyOn(appNoteRepository, 'create').mockReturnValue({} as AppNote);
      jest.spyOn(appNoteRepository, 'save').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(
        service.createApplicationNote(123, new Date(), 'Test note', mockUser),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateApplicationNote', () => {
    it('should update an existing note', async () => {
      const noteId = 1;
      const testDate = new Date('2025-03-01');
      const noteText = 'Updated test note';

      const existingNote = {
        id: noteId,
        applicationId: 123,
        noteDate: '2025-01-01',
        noteText: 'Original note text',
        rowVersionCount: 1,
        createdBy: 'Test User',
        createdDateTime: new Date(),
        updatedBy: 'Test User',
        updatedDateTime: new Date(),
        ts: Buffer.from(''),
      } as AppNote;

      const updatedNote = {
        ...existingNote,
        noteDate: testDate.toISOString().split('T')[0],
        noteText,
        updatedBy: mockUser.name,
        updatedDateTime: expect.any(Date),
      };

      jest.spyOn(appNoteRepository, 'findOne').mockResolvedValue(existingNote);
      jest.spyOn(appNoteRepository, 'save').mockResolvedValue(updatedNote);
      jest
        .spyOn(service, 'getApplicationNotesByApplicationId')
        .mockResolvedValue([updatedNote, mockNotes[1]]);

      const result = await service.updateApplicationNote(
        noteId,
        testDate,
        noteText,
        mockUser,
      );

      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(appNoteRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: noteId,
          noteDate: testDate.toISOString().split('T')[0],
          noteText,
          updatedBy: mockUser.name,
        }),
      );
      expect(service.getApplicationNotesByApplicationId).toHaveBeenCalledWith(
        existingNote.applicationId,
      );
    });

    it('should throw an exception when note is not found', async () => {
      jest.spyOn(appNoteRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateApplicationNote(
          999,
          new Date(),
          'Updated note',
          mockUser,
        ),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an exception when save operation fails', async () => {
      const existingNote = mockNotes[0];

      jest.spyOn(appNoteRepository, 'findOne').mockResolvedValue(existingNote);
      jest.spyOn(appNoteRepository, 'save').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(
        service.updateApplicationNote(1, new Date(), 'Updated note', mockUser),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteApplicationNotes', () => {
    it('should delete specified notes and return remaining notes', async () => {
      const noteIdsToDelete = [1];
      const notesToDelete = [mockNotes[0]];
      const remainingNotes = [mockNotes[1]];

      jest
        .spyOn(appNoteRepository, 'find')
        .mockImplementation((options: any) => {
          if (options.where && options.where.id) {
            return Promise.resolve(notesToDelete);
          } else {
            return Promise.resolve(remainingNotes);
          }
        });

      jest
        .spyOn(appNoteRepository, 'remove')
        .mockResolvedValue(notesToDelete as any);
      jest
        .spyOn(service, 'getApplicationNotesByApplicationId')
        .mockResolvedValue(remainingNotes);

      const result = await service.deleteApplicationNotes(noteIdsToDelete);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
      expect(appNoteRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: In(noteIdsToDelete) },
        }),
      );
      expect(appNoteRepository.remove).toHaveBeenCalledWith(notesToDelete);
      expect(service.getApplicationNotesByApplicationId).toHaveBeenCalledWith(
        123,
      );
    });

    it('should throw an exception when no note IDs are provided', async () => {
      await expect(service.deleteApplicationNotes([])).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an exception when no notes are found', async () => {
      jest.spyOn(appNoteRepository, 'find').mockResolvedValue([]);

      await expect(service.deleteApplicationNotes([999])).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an exception when notes belong to different applications', async () => {
      jest
        .spyOn(appNoteRepository, 'find')
        .mockResolvedValue([mockNotes[0], mockNotes[2]]);

      await expect(service.deleteApplicationNotes([1, 3])).rejects.toThrow(
        HttpException,
      );
    });

    it('should handle partial matches and delete found notes', async () => {
      const foundNotes = [mockNotes[0]];

      jest.spyOn(appNoteRepository, 'find').mockResolvedValue(foundNotes);
      jest
        .spyOn(appNoteRepository, 'remove')
        .mockResolvedValue(foundNotes as any);
      jest
        .spyOn(service, 'getApplicationNotesByApplicationId')
        .mockResolvedValue([mockNotes[1]]);

      const result = await service.deleteApplicationNotes([1, 999]);

      expect(result).toBeDefined();
      expect(appNoteRepository.remove).toHaveBeenCalledWith(foundNotes);
    });

    it('should throw an exception when delete operation fails', async () => {
      jest.spyOn(appNoteRepository, 'find').mockResolvedValue([mockNotes[0]]);
      jest.spyOn(appNoteRepository, 'remove').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(service.deleteApplicationNotes([1])).rejects.toThrow(
        HttpException,
      );
    });
  });
});
