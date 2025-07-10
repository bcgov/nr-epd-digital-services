import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceAttachmentResolver } from './invoiceAttachment.resolver';
import { InvoiceAttachmentService } from '../../services/invoice/invoiceAttachment.service';
import { LoggerService } from '../../logger/logger.service';
import {
  InvoiceAttachmentInputDto,
  FileUploadInputDto,
  FileUploadMultipartInputDto,
} from '../../dto/invoice/invoiceAttachment.dto';
import { InvoiceAttachment } from '../../entities/invoiceAttachment.entity';

describe('InvoiceAttachmentResolver', () => {
  let resolver: InvoiceAttachmentResolver;
  let attachmentService: InvoiceAttachmentService;
  let loggerService: LoggerService;

  const mockUser = { name: 'Test User', id: 'user123' };

  const mockAttachment: InvoiceAttachment = {
    id: 1,
    invoiceId: 1,
    fileName: 'test-file.pdf',
    fileSize: 1024,
    mimeType: 'application/pdf',
    objectStorageId: 'obj-123',
    createdAt: new Date('2024-01-01'),
    createdBy: 'Test User',
    updatedAt: new Date('2024-01-01'),
    updatedBy: 'Test User',
    invoice: null,
  } as InvoiceAttachment;

  const mockMulterFile = {
    fieldname: 'file',
    originalname: 'test-file.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    size: 1024,
    buffer: Buffer.from('test file content'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceAttachmentResolver,
        {
          provide: InvoiceAttachmentService,
          useValue: {
            getInvoiceAttachments: jest.fn(),
            uploadFileAndCreateAttachment: jest.fn(),
            createAttachment: jest.fn(),
            deleteAttachment: jest.fn(),
            getOrCreateBucketForApplication: jest.fn(),
            getOrCreateChildBucket: jest.fn(),
            uploadFileToComs: jest.fn(),
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

    resolver = module.get<InvoiceAttachmentResolver>(InvoiceAttachmentResolver);
    attachmentService = module.get<InvoiceAttachmentService>(
      InvoiceAttachmentService,
    );
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getInvoiceAttachments', () => {
    it('should return attachments when service succeeds', async () => {
      const invoiceId = 1;
      const mockAttachments = [mockAttachment];

      jest
        .spyOn(attachmentService, 'getInvoiceAttachments')
        .mockResolvedValue(mockAttachments);

      const result = await resolver.getInvoiceAttachments(invoiceId);

      expect(result.success).toBe(true);
      expect(result.httpStatusCode).toBe(200);
      expect(result.message).toBe('Attachments retrieved successfully');
      expect(result.attachments).toHaveLength(1);
      expect(result.attachments[0].id).toBe(mockAttachment.id);
      expect(result.attachments[0].fileName).toBe(mockAttachment.fileName);
      expect(attachmentService.getInvoiceAttachments).toHaveBeenCalledWith(
        invoiceId,
      );
    });

    it('should handle service errors', async () => {
      const invoiceId = 1;
      const errorMessage = 'Database error';

      jest
        .spyOn(attachmentService, 'getInvoiceAttachments')
        .mockRejectedValue(new Error(errorMessage));

      const result = await resolver.getInvoiceAttachments(invoiceId);

      expect(result.success).toBe(false);
      expect(result.httpStatusCode).toBe(500);
      expect(result.message).toBe('Failed to retrieve attachments');
      expect(loggerService.error).toHaveBeenCalledWith(
        expect.stringContaining('getInvoiceAttachments: Error:'),
        expect.any(String),
      );
    });
  });

  describe('uploadFileToInvoice', () => {
    it('should upload file successfully', async () => {
      const input: FileUploadInputDto = {
        applicationId: 1,
        invoiceId: 1,
        fileName: 'test-file.pdf',
        fileContent: 'base64content',
        mimeType: 'application/pdf',
      };

      jest
        .spyOn(attachmentService, 'uploadFileAndCreateAttachment')
        .mockResolvedValue(mockAttachment);

      const result = await resolver.uploadFileToInvoice(input, mockUser);

      expect(result.success).toBe(true);
      expect(result.httpStatusCode).toBe(201);
      expect(result.message).toBe('File uploaded successfully');
      expect(result.objectStorageId).toBe(mockAttachment.objectStorageId);
      expect(result.attachment.id).toBe(mockAttachment.id);
      expect(
        attachmentService.uploadFileAndCreateAttachment,
      ).toHaveBeenCalledWith(input, mockUser);
    });

    it('should handle upload errors', async () => {
      const input: FileUploadInputDto = {
        applicationId: 1,
        invoiceId: 1,
        fileName: 'test-file.pdf',
        fileContent: 'base64content',
        mimeType: 'application/pdf',
      };
      const errorMessage = 'Upload failed';

      jest
        .spyOn(attachmentService, 'uploadFileAndCreateAttachment')
        .mockRejectedValue(new Error(errorMessage));

      const result = await resolver.uploadFileToInvoice(input, mockUser);

      expect(result.success).toBe(false);
      expect(result.httpStatusCode).toBe(500);
      expect(result.message).toBe(errorMessage);
      expect(loggerService.error).toHaveBeenCalledWith(
        expect.stringContaining('uploadFileToInvoice: Error:'),
        expect.any(String),
      );
    });
  });

  describe('createInvoiceAttachment', () => {
    it('should create attachment successfully', async () => {
      const input: InvoiceAttachmentInputDto = {
        invoiceId: 1,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        objectStorageId: 'obj-123',
      };

      jest
        .spyOn(attachmentService, 'createAttachment')
        .mockResolvedValue(mockAttachment);

      const result = await resolver.createInvoiceAttachment(input, mockUser);

      expect(result.success).toBe(true);
      expect(result.httpStatusCode).toBe(201);
      expect(result.message).toBe('Attachment created successfully');
      expect(result.attachment.id).toBe(mockAttachment.id);
      expect(result.attachment.fileName).toBe(mockAttachment.fileName);
      expect(attachmentService.createAttachment).toHaveBeenCalledWith(
        input,
        mockUser,
      );
    });

    it('should handle creation errors', async () => {
      const input: InvoiceAttachmentInputDto = {
        invoiceId: 1,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        objectStorageId: 'obj-123',
      };
      const errorMessage = 'Creation failed';

      jest
        .spyOn(attachmentService, 'createAttachment')
        .mockRejectedValue(new Error(errorMessage));

      const result = await resolver.createInvoiceAttachment(input, mockUser);

      expect(result.success).toBe(false);
      expect(result.httpStatusCode).toBe(500);
      expect(result.message).toBe(errorMessage);
      expect(loggerService.error).toHaveBeenCalledWith(
        expect.stringContaining('createInvoiceAttachment: Error:'),
        expect.any(String),
      );
    });
  });

  describe('deleteInvoiceAttachment', () => {
    it('should delete attachment successfully', async () => {
      const attachmentId = 1;

      jest
        .spyOn(attachmentService, 'deleteAttachment')
        .mockResolvedValue(undefined);

      const result = await resolver.deleteInvoiceAttachment(
        attachmentId,
        mockUser,
      );

      expect(result.success).toBe(true);
      expect(result.httpStatusCode).toBe(200);
      expect(result.message).toBe('Attachment deleted successfully');
      expect(attachmentService.deleteAttachment).toHaveBeenCalledWith(
        attachmentId,
        mockUser,
      );
    });

    it('should handle deletion errors', async () => {
      const attachmentId = 1;
      const errorMessage = 'Deletion failed';

      jest
        .spyOn(attachmentService, 'deleteAttachment')
        .mockRejectedValue(new Error(errorMessage));

      const result = await resolver.deleteInvoiceAttachment(
        attachmentId,
        mockUser,
      );

      expect(result.success).toBe(false);
      expect(result.httpStatusCode).toBe(500);
      expect(result.message).toBe(errorMessage);
      expect(loggerService.error).toHaveBeenCalledWith(
        expect.stringContaining('deleteInvoiceAttachment: Error:'),
        expect.any(String),
      );
    });

    it('should handle errors with custom status codes', async () => {
      const attachmentId = 1;
      const error = { message: 'Not found', status: 404 };

      jest
        .spyOn(attachmentService, 'deleteAttachment')
        .mockRejectedValue(error);

      const result = await resolver.deleteInvoiceAttachment(
        attachmentId,
        mockUser,
      );

      expect(result.success).toBe(false);
      expect(result.httpStatusCode).toBe(404);
      expect(result.message).toBe('Not found');
    });
  });

  describe('uploadFileToInvoiceMultipart', () => {
    it('should upload multipart file successfully', async () => {
      const input: FileUploadMultipartInputDto = {
        applicationId: 1,
        invoiceId: 1,
      };

      jest
        .spyOn(attachmentService, 'uploadFileAndCreateAttachment')
        .mockResolvedValue(mockAttachment);

      const result = await resolver.uploadFileToInvoiceMultipart(
        mockMulterFile,
        input,
        mockUser,
      );

      expect(result.success).toBe(true);
      expect(result.httpStatusCode).toBe(201);
      expect(result.message).toBe('File uploaded successfully');
      expect(result.objectStorageId).toBe(mockAttachment.objectStorageId);
      expect(result.attachment.id).toBe(mockAttachment.id);

      const expectedUploadData = {
        applicationId: input.applicationId,
        invoiceId: input.invoiceId,
        fileName: mockMulterFile.originalname,
        fileContent: mockMulterFile.buffer.toString('base64'),
        mimeType: mockMulterFile.mimetype,
      };
      expect(
        attachmentService.uploadFileAndCreateAttachment,
      ).toHaveBeenCalledWith(expectedUploadData, mockUser);
    });

    it('should handle missing file', async () => {
      const input: FileUploadMultipartInputDto = {
        applicationId: 1,
        invoiceId: 1,
      };

      const result = await resolver.uploadFileToInvoiceMultipart(
        null as any,
        input,
        mockUser,
      );

      expect(result.success).toBe(false);
      expect(result.httpStatusCode).toBe(500);
      expect(result.message).toBe('No file provided');
    });

    it('should handle upload errors', async () => {
      const input: FileUploadMultipartInputDto = {
        applicationId: 1,
        invoiceId: 1,
      };
      const errorMessage = 'Upload failed';

      jest
        .spyOn(attachmentService, 'uploadFileAndCreateAttachment')
        .mockRejectedValue(new Error(errorMessage));

      const result = await resolver.uploadFileToInvoiceMultipart(
        mockMulterFile,
        input,
        mockUser,
      );

      expect(result.success).toBe(false);
      expect(result.httpStatusCode).toBe(500);
      expect(result.message).toBe(errorMessage);
    });
  });

  describe('uploadFileToComsForInvoice', () => {
    it('should upload file to COMS successfully with invoice', async () => {
      const input: FileUploadInputDto = {
        applicationId: 1,
        invoiceId: 1,
        fileName: 'test-file.pdf',
        fileContent: 'base64content',
        mimeType: 'application/pdf',
      };

      const mockBucketResult = { success: true, bucketId: 'bucket-123' };
      const mockChildBucketResult = {
        success: true,
        bucketId: 'child-bucket-123',
      };
      const mockUploadResult = { success: true, objectId: 'obj-123' };

      jest
        .spyOn(attachmentService, 'getOrCreateBucketForApplication')
        .mockResolvedValue(mockBucketResult);
      jest
        .spyOn(attachmentService, 'getOrCreateChildBucket')
        .mockResolvedValue(mockChildBucketResult);
      jest
        .spyOn(attachmentService, 'uploadFileToComs')
        .mockResolvedValue(mockUploadResult);
      jest
        .spyOn(attachmentService, 'createAttachment')
        .mockResolvedValue(mockAttachment);

      const result = await resolver.uploadFileToComsForInvoice(input, mockUser);

      expect(result.success).toBe(true);
      expect(result.httpStatusCode).toBe(201);
      expect(result.message).toBe('File uploaded successfully to COMS');
      expect(result.objectStorageId).toBe('obj-123');
      expect(result.attachment?.id).toBe(mockAttachment.id);

      expect(
        attachmentService.getOrCreateBucketForApplication,
      ).toHaveBeenCalledWith(1);
      expect(attachmentService.getOrCreateChildBucket).toHaveBeenCalledWith(
        'bucket-123',
        1,
      );
      expect(attachmentService.uploadFileToComs).toHaveBeenCalledWith(
        'child-bucket-123',
        expect.any(Buffer),
        'test-file.pdf',
        'application/pdf',
      );
      expect(attachmentService.createAttachment).toHaveBeenCalledWith(
        expect.objectContaining({
          invoiceId: 1,
          fileName: 'test-file.pdf',
          objectStorageId: 'obj-123',
        }),
        mockUser,
      );
    });

    it('should upload file to COMS successfully without invoice', async () => {
      const input: FileUploadInputDto = {
        applicationId: 1,
        fileName: 'test-file.pdf',
        fileContent: 'base64content',
        mimeType: 'application/pdf',
      };

      const mockBucketResult = { success: true, bucketId: 'bucket-123' };
      const mockUploadResult = { success: true, objectId: 'obj-123' };

      jest
        .spyOn(attachmentService, 'getOrCreateBucketForApplication')
        .mockResolvedValue(mockBucketResult);
      jest
        .spyOn(attachmentService, 'uploadFileToComs')
        .mockResolvedValue(mockUploadResult);

      const result = await resolver.uploadFileToComsForInvoice(input, mockUser);

      expect(result.success).toBe(true);
      expect(result.httpStatusCode).toBe(201);
      expect(result.message).toBe('File uploaded successfully to COMS');
      expect(result.objectStorageId).toBe('obj-123');
      expect(result.attachment).toBeUndefined();

      expect(attachmentService.getOrCreateChildBucket).not.toHaveBeenCalled();
      expect(attachmentService.createAttachment).not.toHaveBeenCalled();
    });

    it('should handle bucket creation failure', async () => {
      const input: FileUploadInputDto = {
        applicationId: 1,
        invoiceId: 1,
        fileName: 'test-file.pdf',
        fileContent: 'base64content',
        mimeType: 'application/pdf',
      };

      const mockBucketResult = {
        success: false,
        error: 'Bucket creation failed',
      };

      jest
        .spyOn(attachmentService, 'getOrCreateBucketForApplication')
        .mockResolvedValue(mockBucketResult);

      const result = await resolver.uploadFileToComsForInvoice(input, mockUser);

      expect(result.success).toBe(false);
      expect(result.httpStatusCode).toBe(500);
      expect(result.message).toBe('Bucket creation failed');
    });

    it('should handle upload failure', async () => {
      const input: FileUploadInputDto = {
        applicationId: 1,
        invoiceId: 1,
        fileName: 'test-file.pdf',
        fileContent: 'base64content',
        mimeType: 'application/pdf',
      };

      const mockBucketResult = { success: true, bucketId: 'bucket-123' };
      const mockChildBucketResult = {
        success: true,
        bucketId: 'child-bucket-123',
      };
      const mockUploadResult = { success: false, error: 'Upload failed' };

      jest
        .spyOn(attachmentService, 'getOrCreateBucketForApplication')
        .mockResolvedValue(mockBucketResult);
      jest
        .spyOn(attachmentService, 'getOrCreateChildBucket')
        .mockResolvedValue(mockChildBucketResult);
      jest
        .spyOn(attachmentService, 'uploadFileToComs')
        .mockResolvedValue(mockUploadResult);

      const result = await resolver.uploadFileToComsForInvoice(input, mockUser);

      expect(result.success).toBe(false);
      expect(result.httpStatusCode).toBe(500);
      expect(result.message).toBe('Upload failed');
    });

    it('should handle child bucket creation failure gracefully', async () => {
      const input: FileUploadInputDto = {
        applicationId: 1,
        invoiceId: 1,
        fileName: 'test-file.pdf',
        fileContent: 'base64content',
        mimeType: 'application/pdf',
      };

      const mockBucketResult = { success: true, bucketId: 'bucket-123' };
      const mockChildBucketResult = {
        success: false,
        error: 'Child bucket failed',
      };
      const mockUploadResult = { success: true, objectId: 'obj-123' };

      jest
        .spyOn(attachmentService, 'getOrCreateBucketForApplication')
        .mockResolvedValue(mockBucketResult);
      jest
        .spyOn(attachmentService, 'getOrCreateChildBucket')
        .mockResolvedValue(mockChildBucketResult);
      jest
        .spyOn(attachmentService, 'uploadFileToComs')
        .mockResolvedValue(mockUploadResult);
      jest
        .spyOn(attachmentService, 'createAttachment')
        .mockResolvedValue(mockAttachment);

      const result = await resolver.uploadFileToComsForInvoice(input, mockUser);

      expect(result.success).toBe(true);
      expect(result.httpStatusCode).toBe(201);
      expect(result.message).toBe('File uploaded successfully to COMS');

      // Should use parent bucket when child bucket creation fails
      expect(attachmentService.uploadFileToComs).toHaveBeenCalledWith(
        'bucket-123',
        expect.any(Buffer),
        'test-file.pdf',
        'application/pdf',
      );
    });

    it('should handle general errors', async () => {
      const input: FileUploadInputDto = {
        applicationId: 1,
        invoiceId: 1,
        fileName: 'test-file.pdf',
        fileContent: 'base64content',
        mimeType: 'application/pdf',
      };

      jest
        .spyOn(attachmentService, 'getOrCreateBucketForApplication')
        .mockRejectedValue(new Error('General error'));

      const result = await resolver.uploadFileToComsForInvoice(input, mockUser);

      expect(result.success).toBe(false);
      expect(result.httpStatusCode).toBe(500);
      expect(result.message).toBe('General error');
      expect(loggerService.error).toHaveBeenCalledWith(
        expect.stringContaining('uploadFileToComsForInvoice: Error:'),
        expect.any(String),
      );
    });
  });
});
