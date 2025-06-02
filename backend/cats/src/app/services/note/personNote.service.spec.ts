import { PersonNoteService } from './personNote.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { PersonNote } from '../../entities/personNote.entity';
import { UserTypeEum } from '../../utilities/enums/userType';

describe('PersonNoteService', () => {
  let service: PersonNoteService;
  let repository: Repository<PersonNote>;
  let loggerService: LoggerService;

  beforeEach(() => {
    repository = {
      findOne: jest.fn(),
      findBy: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    } as unknown as Repository<PersonNote>;
    loggerService = {
      log: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as LoggerService;

    service = new PersonNoteService(repository, loggerService);
  });

  describe('getPersonNotesByPersonId', () => {
    it('should fetch notes successfully for valid personId and IDIR user', async () => {
      const user = { givenName: 'John', identity_provider: UserTypeEum.IDIR };
      const personId = 1;
      const mockNotes = [{ id: 1, noteDescription: 'Test note', createdBy: 'John', createdDatetime: new Date() }];
      repository.findBy = jest.fn().mockResolvedValue(mockNotes);

      const result = await service.getPersonNotesByPersonId(personId, user);
      expect(result).toEqual([
        {
          id: 1,
          noteDescription: 'Test note',
          user: 'John',
          date: mockNotes[0].createdDatetime,
        },
      ]);
    });

    it('should return empty array if no notes found for personId', async () => {
      const user = { givenName: 'John', identity_provider: UserTypeEum.IDIR };
      const personId = 1;
      repository.findBy = jest.fn().mockResolvedValue([]);

      const result = await service.getPersonNotesByPersonId(personId, user);
      expect(result).toEqual([]);
    });

    it('should return empty array if user does not have IDIR identity provider', async () => {
      const user = { givenName: 'John', identity_provider: 'Other' };
      const personId = 1;
      const result = await service.getPersonNotesByPersonId(personId, user);
      expect(result).toEqual([]);
    });
  });

  describe('createPersonNote', () => {
    it('should throw FORBIDDEN error if user does not have IDIR identity provider', async () => {
      const createNote = { personId: 1, noteDescription: 'Test note' };
      const user = {
        identity_provider: UserTypeEum.BCEID, // Not IDIR
      };

      await expect(service.createPersonNote(createNote, user)).rejects.toThrow(
        new HttpException('Failed to create note', HttpStatus.FORBIDDEN),
      );
    });

    it('should create a note if user has IDIR identity provider', async () => {
      const createNote = { personId: 1, noteDescription: 'Test note' };
      const user = {
        identity_provider: UserTypeEum.IDIR, // IDIR provider
        givenName: 'TestUser',
      };

      // Mock repository methods with the correct types
      const savedNote = {
        id: '1', // Change id to string to match the expected type
        personId: 1,
        noteDescription: 'Test note',
        createdBy: 'TestUser',
        createdDatetime: new Date()
      };

      jest.spyOn(repository, 'create').mockReturnValue(savedNote as any);
      jest.spyOn(repository, 'save').mockResolvedValue(savedNote as any);

      const result = await service.createPersonNote(createNote, user);

      expect(result).toBeDefined();
      expect(result.id).toBe(savedNote.id);
      expect(result.noteDescription).toBe(savedNote.noteDescription);
      expect(result.user).toBe(savedNote.createdBy);
    });
  });

  describe('updatePersonNote', () => {
    it('should throw an error when trying to update a non-existing note', async () => {
      const updateNote = { noteDescription: 'Updated note description' };
      const user = { identity_provider: UserTypeEum.IDIR, givenName: 'TestUser' };
      const noteId = 'non-existing-id';

      // Simulate note not found
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.updatePersonNote(noteId, updateNote, user)).rejects.toThrow(
        new HttpException('Failed to update note', HttpStatus.NOT_FOUND)
      );
    });

    it('should return the note without updating if no changes are detected', async () => {
      const updateNote = { noteDescription: 'Same description' }; // No actual change
      const user = { identity_provider: UserTypeEum.IDIR, givenName: 'TestUser' };
      const noteId = '1';

      // Create the mock with all required fields for PersonNote
      const existingNote = {
        id: noteId,
        noteDescription: 'Same description',
        createdBy: 'TestUser',
        createdDatetime: new Date(),
        personId: 1,
        updatedDatetime: new Date(),
        updatedBy: 'TestUser',
        deletedBy: null,
        deletedDatetime: null,
        person: {
          id: 1,
          firstName: 'John',
          middleName: 'A',
          lastName: 'Doe',
          isTaxExempt: false,
          isEnvConsultant: false,
          loginUserName: 'johndoe',
          address_1: '123 Main St',
          address_2: 'Apt 4B',
          city: 'Some City',
          prov: 'BC',
          country: 'Canada',
          postal: 'V1V1V1',
          phone: '123-456-7890',
          mobile: '987-654-3210',
          fax: '123-456-7891',
          email: 'john.doe@example.com',
          isActive: true,
          isDeleted: false,
          rowVersionCount: 1,
          createdBy: 'TestUser',
          createdDatetime: new Date(),
          updatedBy: null,
          updatedDatetime: null,
          personPermissions: []
        },
      };

      // Mock repository response for finding an existing note
      jest.spyOn(repository, 'findOne').mockResolvedValue(existingNote);

      // Call the service method
      const result = await service.updatePersonNote(noteId, updateNote, user);

      // Ensure all fields are correctly returned
      expect(result).toEqual({
        id: existingNote.id,
        noteDescription: existingNote.noteDescription,
        date: existingNote.updatedDatetime,
        user: existingNote.updatedBy
      });
    });
  });

  describe('deletePersonNote', () => {
    it('should return false when attempting to delete a non-existing note', async () => {
      const notesToDelete = [{ id: 'non-existing-id' }];
      const user = { identity_provider: UserTypeEum.IDIR, givenName: 'TestUser' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null); // Simulate note not found

      const result = await service.deletePersonNote(notesToDelete, user);

      expect(result).toBe(false);
    });

    it('should throw FORBIDDEN error if user does not have IDIR identity provider during deletion', async () => {
      const notesToDelete = [{ id: '1' }];
      const user = { identity_provider: 'BCEID', givenName: 'TestUser' };

      await expect(service.deletePersonNote(notesToDelete, user)).rejects.toThrow(
        new HttpException('Only users with IDIR identity provider are allowed to delete notes', HttpStatus.FORBIDDEN)
      );
    });
  });
});
