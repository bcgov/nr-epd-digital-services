import { Test, TestingModule } from '@nestjs/testing';
import { PersonNoteResolver } from './personNote.resolver';
import { PersonNoteService } from '../../services/note/personNote.service';
import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { PersonNoteResponse } from '../../dto/response/note/personNoteResponse';
import { CreatePersonNote } from '../../dto/note/createPersonNote.dto';
import { UpdatePersonNote } from '../../dto/note/updatePersonNote.dto';
import { DeletePersonNote } from '../../dto/note/deletePersonNote.dto';
import { HttpStatus } from '@nestjs/common';

describe('PersonNoteResolver', () => {
  let resolver: PersonNoteResolver;
  let personNoteService: PersonNoteService;
  let loggerService: LoggerService;
  let genericResponseProvider: GenericResponseProvider<PersonNoteResponse[]>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonNoteResolver,
        {
          provide: PersonNoteService,
          useValue: {
            getPersonNotesByPersonId: jest.fn(),
            createPersonNote: jest.fn(),
            updatePersonNote: jest.fn(),
            deletePersonNote: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
        {
          provide: GenericResponseProvider,
          useValue: {
            createResponse: jest.fn(
              (
                message: string,
                httpStatusCode: number,
                success: boolean,
                data?: PersonNoteResponse[],
              ) => ({
                message,
                httpStatusCode,
                success,
                data,
              }),
            ),
          },
        },
      ],
    }).compile();

    resolver = module.get<PersonNoteResolver>(PersonNoteResolver);
    personNoteService = module.get<PersonNoteService>(PersonNoteService);
    loggerService = module.get<LoggerService>(LoggerService);
    genericResponseProvider = module.get<GenericResponseProvider<PersonNoteResponse[]>>(GenericResponseProvider);
  });

  it('should return person notes successfully when found', async () => {
    const mockPersonNotes = [
        {
          id: '1',
          noteDescription: 'This is a note description',  // noteDescription instead of 'note'
          user: 'John Doe',  // user instead of 'note'
          date: new Date('2024-02-14'),  // Provide a date
        },
        {
          id: '2',
          noteDescription: 'This is another note description',
          user: 'Jane Smith',
          date: new Date('2024-02-15'),
        },
      ];
      

    const expectedResult = {
      message: 'Notes fetched successfully',
      httpStatusCode: HttpStatus.OK,
      success: true,
      data: mockPersonNotes,
    };

    jest.spyOn(personNoteService, 'getPersonNotesByPersonId').mockResolvedValue(mockPersonNotes);

    const result = await resolver.getPersonNotesByPersonId(1, { identity_provider: 'IDIR' });

    expect(result).toEqual(expectedResult);
    expect(personNoteService.getPersonNotesByPersonId).toHaveBeenCalledWith(1, { identity_provider: 'IDIR' });
    expect(genericResponseProvider.createResponse).toHaveBeenCalledWith(
      'Notes fetched successfully',
      HttpStatus.OK,
      true,
      mockPersonNotes,
    );
  });

  it('should return an error message if no person notes found', async () => {
    const expectedResult = {
      message: 'Notes data not found for person id: 1',
      httpStatusCode: HttpStatus.NOT_FOUND,
      success: false,
      data: null,
    };

    jest.spyOn(personNoteService, 'getPersonNotesByPersonId').mockResolvedValue([]);

    const result = await resolver.getPersonNotesByPersonId(1, { identity_provider: 'IDIR' });

    expect(result).toEqual(expectedResult);
    expect(personNoteService.getPersonNotesByPersonId).toHaveBeenCalledWith(1, { identity_provider: 'IDIR' });
    expect(genericResponseProvider.createResponse).toHaveBeenCalledWith(
      'Notes data not found for person id: 1',
      HttpStatus.NOT_FOUND,
      false,
      null,
    );
  });

  it('should create a person note successfully', async () => {
    const createNoteDto: CreatePersonNote =  {
        personId: 1,
        noteDescription: 'This is the note description',  // Replacing 'note' with 'noteDescription'
      };

    const createdNote = {
        id: '1',
        noteDescription: 'This is the note description',  // Replacing 'note' with 'noteDescription'
        user: 'John Doe',  // Add user property
        date: new Date('2024-02-14'),  // Add date property
    };
      
    const expectedResult = {
      message: 'Note created successfully',
      httpStatusCode: HttpStatus.CREATED,
      success: true,
      data: [createdNote],
    };

    jest.spyOn(personNoteService, 'createPersonNote').mockResolvedValue(createdNote);

    const result = await resolver.createPersonNote(createNoteDto, { identity_provider: 'IDIR' });

    expect(result).toEqual(expectedResult);
    expect(personNoteService.createPersonNote).toHaveBeenCalledWith(createNoteDto, { identity_provider: 'IDIR' });
    expect(genericResponseProvider.createResponse).toHaveBeenCalledWith(
      'Note created successfully',
      HttpStatus.CREATED,
      true,
      [createdNote],
    );
  });

  it('should return an error when creation of person note fails', async () => {
    const createNoteDto: CreatePersonNote = { personId: 1, noteDescription: 'Invalid note' };

    const expectedResult = {
      message: 'Failed to create note',
      httpStatusCode: HttpStatus.BAD_REQUEST,
      success: false,
      data: null,
    };

    jest.spyOn(personNoteService, 'createPersonNote').mockResolvedValue(null);

    const result = await resolver.createPersonNote(createNoteDto, { identity_provider: 'IDIR' });

    expect(result).toEqual(expectedResult);
    expect(personNoteService.createPersonNote).toHaveBeenCalledWith(createNoteDto, { identity_provider: 'IDIR' });
    expect(genericResponseProvider.createResponse).toHaveBeenCalledWith(
      'Failed to create note',
      HttpStatus.BAD_REQUEST,
      false,
      null,
    );
  });

  it('should update a person note successfully', async () => {
    const updateNoteDto: UpdatePersonNote = { noteDescription: 'Updated note' };
    const updatedNote = {
        id: '1',
        noteDescription: 'Updated note',  // Replacing 'note' with 'noteDescription'
        user: 'John Doe',  // Add user property
        date: new Date('2024-02-14'),  // Add date property
    };

    const expectedResult = {
      message: 'Note updated successfully',
      httpStatusCode: HttpStatus.OK,
      success: true,
      data: [updatedNote],
    };

    jest.spyOn(personNoteService, 'updatePersonNote').mockResolvedValue(updatedNote);

    const result = await resolver.updatePeronNote('1', updateNoteDto, { identity_provider: 'IDIR' });

    expect(result).toEqual(expectedResult);
    expect(personNoteService.updatePersonNote).toHaveBeenCalledWith('1', updateNoteDto, { identity_provider: 'IDIR' });
    expect(genericResponseProvider.createResponse).toHaveBeenCalledWith(
      'Note updated successfully',
      HttpStatus.OK,
      true,
      [updatedNote],
    );
  });

  it('should return an error when updating a non-existent note', async () => {
    const updateNoteDto: UpdatePersonNote = { noteDescription: 'Updated note' };

    const expectedResult = {
      message: 'Note not found for update',
      httpStatusCode: HttpStatus.NOT_FOUND,
      success: false,
      data: null,
    };

    jest.spyOn(personNoteService, 'updatePersonNote').mockResolvedValue(null);

    const result = await resolver.updatePeronNote('nonexistentId', updateNoteDto, { identity_provider: 'IDIR' });

    expect(result).toEqual(expectedResult);
    expect(personNoteService.updatePersonNote).toHaveBeenCalledWith('nonexistentId', updateNoteDto, { identity_provider: 'IDIR' });
    expect(genericResponseProvider.createResponse).toHaveBeenCalledWith(
      'Note not found for update',
      HttpStatus.NOT_FOUND,
      false,
      null,
    );
  });

  it('should delete person notes successfully', async () => {
    const deleteNotesDto: DeletePersonNote[] = [{ id: '1' }];
    const expectedResult = {
      message: 'Note deleted successfully',
      httpStatusCode: HttpStatus.OK,
      success: true,
      data: null,
    };

    jest.spyOn(personNoteService, 'deletePersonNote').mockResolvedValue(true);

    const result = await resolver.deletePersonNote(deleteNotesDto, { identity_provider: 'IDIR' });

    expect(result).toEqual(expectedResult);
    expect(personNoteService.deletePersonNote).toHaveBeenCalledWith(deleteNotesDto, { identity_provider: 'IDIR' });
    expect(genericResponseProvider.createResponse).toHaveBeenCalledWith(
      'Note deleted successfully',
      HttpStatus.OK,
      true,
      null,
    );
  });

  it('should return an error when deleting a non-existent note', async () => {
    const deleteNotesDto: DeletePersonNote[] = [{ id: 'nonexistentId' }];
    const expectedResult = {
      message: 'Note not found for deletion',
      httpStatusCode: HttpStatus.NOT_FOUND,
      success: false,
      data: null,
    };

    jest.spyOn(personNoteService, 'deletePersonNote').mockResolvedValue(false);

    const result = await resolver.deletePersonNote(deleteNotesDto, { identity_provider: 'IDIR' });

    expect(result).toEqual(expectedResult);
    expect(personNoteService.deletePersonNote).toHaveBeenCalledWith(deleteNotesDto, { identity_provider: 'IDIR' });
    expect(genericResponseProvider.createResponse).toHaveBeenCalledWith(
      'Note not found for deletion',
      HttpStatus.NOT_FOUND,
      false,
      null,
    );
  });
});
