import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationNotesResolver } from './applicationNotes.resolver';
import { ApplicationNotesService } from '../../services/application/applicationNotes.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { HttpStatus, HttpException } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { AppNote } from '../../entities/appNote.entity';

describe('ApplicationNotesResolver', () => {
  let resolver: ApplicationNotesResolver;
  let service: ApplicationNotesService;
  let responseProvider: GenericResponseProvider<any>;

  const mockUser = { name: 'Test User' };

  const mockNoteData = [
    {
      id: 1,
      applicationId: 123,
      noteDate: '2023-01-01',
      noteText: 'Test note',
      createdBy: 'Test User',
      createdDateTime: new Date(),
      updatedBy: 'Test User',
      updatedDateTime: new Date(),
    },
  ] as AppNote[];

  const mockResponse = {
    message: 'Success',
    statusCode: HttpStatus.OK,
    success: true,
    data: mockNoteData,
  };

  const mockCreatedResponse = {
    message: 'Application note created successfully',
    statusCode: HttpStatus.CREATED,
    success: true,
    data: mockNoteData,
  };

  const mockUpdatedResponse = {
    message: 'Application note updated successfully',
    statusCode: HttpStatus.OK,
    success: true,
    data: mockNoteData,
  };

  const mockDeletedResponse = {
    message: 'Application notes deleted successfully',
    statusCode: HttpStatus.OK,
    success: true,
    data: mockNoteData,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationNotesResolver,
        {
          provide: ApplicationNotesService,
          useValue: {
            getApplicationNotesByApplicationId: jest.fn(),
            createApplicationNote: jest.fn(),
            updateApplicationNote: jest.fn(),
            deleteApplicationNotes: jest.fn(),
          },
        },
        {
          provide: GenericResponseProvider,
          useValue: {
            createResponse: jest.fn(),
          },
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

    resolver = module.get<ApplicationNotesResolver>(ApplicationNotesResolver);
    service = module.get<ApplicationNotesService>(ApplicationNotesService);
    responseProvider = module.get<GenericResponseProvider<any>>(
      GenericResponseProvider,
    );
  });

  describe('getApplicationNotesByApplicationId', () => {
    it('should call getApplicationNotesByApplicationId service method', async () => {
      jest
        .spyOn(service, 'getApplicationNotesByApplicationId')
        .mockResolvedValue(mockNoteData);
      jest
        .spyOn(responseProvider, 'createResponse')
        .mockReturnValue(mockResponse);

      const mockApplicationId = 123;

      const result = await resolver.getApplicationNotesByApplicationId(
        mockApplicationId,
      );

      expect(service.getApplicationNotesByApplicationId).toHaveBeenCalledWith(
        mockApplicationId,
      );
      expect(responseProvider.createResponse).toHaveBeenCalledWith(
        'Application notes fetched successfully',
        HttpStatus.OK,
        true,
        mockNoteData,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createApplicationNote', () => {
    it('should call createApplicationNote service method', async () => {
      const applicationId = 123;
      const noteDate = new Date();
      const noteText = 'New test note';

      jest
        .spyOn(service, 'createApplicationNote')
        .mockResolvedValue(mockNoteData);
      jest
        .spyOn(responseProvider, 'createResponse')
        .mockReturnValue(mockCreatedResponse);

      const result = await resolver.createApplicationNote(
        applicationId,
        noteDate,
        noteText,
        mockUser,
      );

      expect(service.createApplicationNote).toHaveBeenCalledWith(
        applicationId,
        noteDate,
        noteText,
        mockUser,
      );
      expect(responseProvider.createResponse).toHaveBeenCalledWith(
        'Application note created successfully',
        HttpStatus.CREATED,
        true,
        mockNoteData,
      );
      expect(result).toEqual(mockCreatedResponse);
    });

    it('should throw an exception when validation fails', async () => {
      const applicationId = 123;
      const noteDate = null;
      const noteText = '';

      await expect(
        resolver.createApplicationNote(
          applicationId,
          noteDate,
          noteText,
          mockUser,
        ),
      ).rejects.toThrow(HttpException);

      expect(service.createApplicationNote).not.toHaveBeenCalled();
    });
  });

  describe('updateApplicationNote', () => {
    it('should call updateApplicationNote service method', async () => {
      const noteId = 1;
      const noteDate = new Date();
      const noteText = 'Updated test note';

      jest
        .spyOn(service, 'updateApplicationNote')
        .mockResolvedValue(mockNoteData);
      jest
        .spyOn(responseProvider, 'createResponse')
        .mockReturnValue(mockUpdatedResponse);

      const result = await resolver.updateApplicationNote(
        noteId,
        noteDate,
        noteText,
        mockUser,
      );

      expect(service.updateApplicationNote).toHaveBeenCalledWith(
        noteId,
        noteDate,
        noteText,
        mockUser,
      );
      expect(responseProvider.createResponse).toHaveBeenCalledWith(
        'Application note updated successfully',
        HttpStatus.OK,
        true,
        mockNoteData,
      );
      expect(result).toEqual(mockUpdatedResponse);
    });

    it('should throw an exception when validation fails', async () => {
      const noteId = 1;
      const noteDate = null;
      const noteText = '';

      await expect(
        resolver.updateApplicationNote(noteId, noteDate, noteText, mockUser),
      ).rejects.toThrow(HttpException);

      expect(service.updateApplicationNote).not.toHaveBeenCalled();
    });
  });

  describe('deleteApplicationNotes', () => {
    it('should call deleteApplicationNotes service method', async () => {
      const noteIds = [1, 2];

      jest
        .spyOn(service, 'deleteApplicationNotes')
        .mockResolvedValue(mockNoteData);
      jest
        .spyOn(responseProvider, 'createResponse')
        .mockReturnValue(mockDeletedResponse);

      const result = await resolver.deleteApplicationNotes(noteIds, mockUser);

      expect(service.deleteApplicationNotes).toHaveBeenCalledWith(noteIds);
      expect(responseProvider.createResponse).toHaveBeenCalledWith(
        'Application notes deleted successfully',
        HttpStatus.OK,
        true,
        mockNoteData,
      );
      expect(result).toEqual(mockDeletedResponse);
    });

    it('should throw an exception when no note IDs are provided', async () => {
      const emptyNoteIds = [];

      await expect(
        resolver.deleteApplicationNotes(emptyNoteIds, mockUser),
      ).rejects.toThrow(HttpException);

      expect(service.deleteApplicationNotes).not.toHaveBeenCalled();
    });

    it('should throw an exception when user is not provided', async () => {
      const noteIds = [1, 2];
      const noUser = null;

      await expect(
        resolver.deleteApplicationNotes(noteIds, noUser),
      ).rejects.toThrow(HttpException);

      expect(service.deleteApplicationNotes).not.toHaveBeenCalled();
    });
  });
});
