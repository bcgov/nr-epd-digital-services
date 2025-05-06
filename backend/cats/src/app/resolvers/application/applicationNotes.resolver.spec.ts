import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationNotesResolver } from './applicationNotes.resolver';
import { ApplicationNotesService } from '../../services/application/applicationNotes.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { HttpStatus } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { AppNote } from '../../entities/appNote.entity';

describe('ApplicationNotesResolver', () => {
  let resolver: ApplicationNotesResolver;
  let service: ApplicationNotesService;
  let responseProvider: GenericResponseProvider<any>;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationNotesResolver,
        {
          provide: ApplicationNotesService,
          useValue: {
            getApplicationNotesByApplicationId: jest.fn(),
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
});
