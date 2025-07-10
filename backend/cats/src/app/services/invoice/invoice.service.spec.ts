import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InvoiceV2 } from '../../entities/invoiceV2.entity';
import { LoggerService } from '../../logger/logger.service';
import { InvoiceInputDto, InvoiceStatus } from '../../dto/invoice/invoice.dto';
import {
  InvoiceLineItemInputDto,
  InvoiceLineItemType,
} from '../../dto/invoice/invoiceLineItem.dto';
import { InvoiceLineItem } from '../../entities/invoiceLineItem.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, of, throwError } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';

// Mock firstValueFrom
jest.mock('rxjs', () => ({
  ...jest.requireActual('rxjs'),
  firstValueFrom: jest.fn(),
  of: jest.requireActual('rxjs').of,
  throwError: jest.requireActual('rxjs').throwError,
}));

describe('InvoiceService', () => {
  let service: InvoiceService;
  let repository: Repository<InvoiceV2>;
  let loggerService: LoggerService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getRepositoryToken(InvoiceV2),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'CDOGS_API_URL')
                return 'https://cdogs.api.example.com/api/v2';
              if (key === 'CDOGS_TOKEN') return 'mock-cdogs-token';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    repository = module.get<Repository<InvoiceV2>>(
      getRepositoryToken(InvoiceV2),
    );
    loggerService = module.get<LoggerService>(LoggerService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();

    // Reset firstValueFrom mock behavior
    (firstValueFrom as jest.Mock).mockReset();
  });

  describe('getInvoicesByApplicationId', () => {
    it('should return invoices when repository succeeds', async () => {
      const mockInvoices: InvoiceV2[] = [
        {
          id: 1,
          application: null,
          lineItems: [],
          attachments: [],
          subject: 'Invoice 1',
          issuedDate: new Date(),
          dueDate: new Date(),
          status: InvoiceStatus.DRAFT,
          recipient: null,
          invoiceId: null,
          taxExempt: false,
          pstExempt: false,
          subtotalInCents: 10000,
          gstInCents: 0,
          pstInCents: 0,
          totalInCents: 10000,
          notes: 'Test invoice notes',
          createdBy: 'testUser',
          updatedBy: 'testUser',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(mockInvoices);

      const applicationId = 123;
      const result = await service.getInvoicesByApplicationId(applicationId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { application: { id: applicationId } },
        relations: ['lineItems'],
      });
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: getInvoicesByApplicationId: applicationId: ${applicationId}`,
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: getInvoicesByApplicationId: Success.`,
      );
      expect(result).toEqual(mockInvoices);
    });

    it('should log and throw an error when repository fails', async () => {
      const errorMessage = 'Database error';
      jest.spyOn(repository, 'find').mockRejectedValue(new Error(errorMessage));

      const applicationId = 123;

      await expect(
        service.getInvoicesByApplicationId(applicationId),
      ).rejects.toThrow(
        `Failed to fetch invoices for application ID ${applicationId}: ${errorMessage}`,
      );

      expect(repository.find).toHaveBeenCalledWith({
        where: { application: { id: applicationId } },
        relations: ['lineItems'],
      });
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: getInvoicesByApplicationId: applicationId: ${applicationId}`,
      );
      expect(loggerService.error).toHaveBeenCalledWith(
        `InvoiceService: getInvoicesByApplicationId: Error fetching invoices: ${errorMessage}`,
        null,
      );
    });
  });

  describe('createInvoice', () => {
    it('should create and return an invoice when repository succeeds', async () => {
      const mockLineItemData: InvoiceLineItemInputDto = {
        type: InvoiceLineItemType.SERVICE,
        description: 'Consulting services',
        quantity: 2,
        unitPriceInCents: 5000,
        totalInCents: 10000,
      };
      const mockInvoiceData: InvoiceInputDto = {
        applicationId: 1,
        recipientId: 1,
        invoiceId: null,
        subject: 'Invoice 1',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: InvoiceStatus.PAID,
        taxExempt: false,
        pstExempt: false,
        subtotalInCents: 10000,
        gstInCents: 0,
        pstInCents: 0,
        totalInCents: 10000,
        notes: 'Invoice for services rendered',
        lineItems: [
          {
            ...mockLineItemData,
            createdBy: 'testUser',
            createdAt: new Date(),
          },
        ],
      };

      const mockLineItem: InvoiceLineItem = {
        ...mockLineItemData,
        id: 1,
        invoice: null, // This isn't realistic, in reality it would lazily evaluate to the invoice.
        createdBy: 'testUser',
        createdAt: new Date(),
        updatedBy: 'testUser',
        updatedAt: new Date(),
      };
      const mockInvoice: InvoiceV2 = {
        ...mockInvoiceData,
        id: 1,
        application: null,
        recipient: null,
        invoice: null,
        attachments: [],
        createdBy: 'testUser',
        createdAt: new Date(),
        updatedBy: 'testUser',
        updatedAt: new Date(),
        lineItems: [mockLineItem],
      } as InvoiceV2;

      jest.spyOn(repository, 'save').mockResolvedValue(mockInvoice);

      const result = await service.createInvoice(mockInvoiceData, {
        name: 'testUser',
      });

      expect(repository.save).toHaveBeenCalledWith({
        ...mockInvoiceData,
        application: { id: mockInvoiceData.applicationId },
        recipient: { id: mockInvoiceData.recipientId },
        createdBy: 'testUser',
        updatedBy: 'testUser',
        lineItems: mockInvoiceData.lineItems.map((item) => ({
          ...item,
          createdBy: 'testUser',
          updatedBy: 'testUser',
        })),
      });
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: createInvoice: invoiceData: ${JSON.stringify(
          mockInvoiceData,
        )}`,
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: createInvoice: Success.`,
      );
      expect(result).toEqual(mockInvoice);
    });

    it('should log and throw an error when repository fails', async () => {
      const mockLineItemData: InvoiceLineItemInputDto = {
        type: InvoiceLineItemType.SERVICE,
        description: 'Consulting services',
        quantity: 2,
        unitPriceInCents: 5000,
        totalInCents: 10000,
      };
      const mockInvoiceData: InvoiceInputDto = {
        applicationId: 1,
        recipientId: 1,
        invoiceId: null,
        subject: 'Invoice 1',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: InvoiceStatus.PAID,
        taxExempt: false,
        pstExempt: false,
        subtotalInCents: 10000,
        gstInCents: 0,
        pstInCents: 0,
        totalInCents: 10000,
        notes: 'Test invoice notes for error case',
        lineItems: [mockLineItemData],
      };

      const errorMessage = 'Database error';
      jest.spyOn(repository, 'save').mockRejectedValue(new Error(errorMessage));

      await expect(
        service.createInvoice(mockInvoiceData, { name: 'testUser' }),
      ).rejects.toThrow(`Failed to create invoice: ${errorMessage}`);

      expect(repository.save).toHaveBeenCalledWith({
        ...mockInvoiceData,
        application: { id: mockInvoiceData.applicationId },
        recipient: { id: mockInvoiceData.recipientId },
        createdBy: 'testUser',
        updatedBy: 'testUser',
        lineItems: mockInvoiceData.lineItems.map((item) => ({
          ...item,
          createdBy: 'testUser',
          updatedBy: 'testUser',
        })),
      });
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: createInvoice: invoiceData: ${JSON.stringify(
          mockInvoiceData,
        )}`,
      );
      expect(loggerService.error).toHaveBeenCalledWith(
        `InvoiceService: createInvoice: Error creating invoice: ${errorMessage}`,
        null,
      );
    });
  });

  describe('updateInvoice', () => {
    it('should update and return an invoice when repository succeeds', async () => {
      const invoiceId = 1;
      const mockUpdateData: InvoiceInputDto = {
        applicationId: 1,
        recipientId: 1,
        invoiceId: null,
        subject: 'Updated Invoice',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: InvoiceStatus.PAID,
        taxExempt: false,
        pstExempt: false,
        subtotalInCents: 20000,
        gstInCents: 1000,
        pstInCents: 500,
        totalInCents: 21500,
        notes: 'Updated invoice notes',
        lineItems: [],
      };

      const mockUpdatedInvoice: InvoiceV2 = {
        id: invoiceId,
        application: null,
        lineItems: [],
        attachments: [],
        subject: 'Updated Invoice',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: InvoiceStatus.PAID,
        recipient: null,
        invoiceId: null,
        taxExempt: false,
        pstExempt: false,
        subtotalInCents: 20000,
        gstInCents: 1000,
        pstInCents: 500,
        totalInCents: 21500,
        notes: 'Updated invoice notes',
        createdBy: 'testUser',
        updatedBy: 'testUser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'save').mockResolvedValue(mockUpdatedInvoice);
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUpdatedInvoice);

      const result = await service.updateInvoice(invoiceId, mockUpdateData, {
        username: 'testUser',
      });

      expect(repository.save).toHaveBeenCalledWith({
        ...mockUpdateData,
        id: invoiceId,
        updatedBy: 'testUser',
      });
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: invoiceId },
        relations: ['lineItems', 'application', 'recipient'],
      });
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: updateInvoice: invoiceId: ${invoiceId}`,
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: updateInvoice: Success.`,
      );
      expect(result).toEqual(mockUpdatedInvoice);
    });

    it('should log and throw an error when invoice is not found after update', async () => {
      const invoiceId = 1;
      const mockUpdateData: InvoiceInputDto = {
        applicationId: 1,
        recipientId: 1,
        invoiceId: null,
        subject: 'Updated Invoice',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: InvoiceStatus.PAID,
        taxExempt: false,
        pstExempt: false,
        subtotalInCents: 20000,
        gstInCents: 1000,
        pstInCents: 500,
        totalInCents: 21500,
        notes: 'Updated invoice notes',
        lineItems: [],
      };

      jest.spyOn(repository, 'save').mockResolvedValue(undefined);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateInvoice(invoiceId, mockUpdateData, {
          username: 'testUser',
        }),
      ).rejects.toThrow(
        `Failed to update invoice: Invoice with ID ${invoiceId} not found.`,
      );

      expect(repository.save).toHaveBeenCalledWith({
        ...mockUpdateData,
        id: invoiceId,
        updatedBy: 'testUser',
      });
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: invoiceId },
        relations: ['lineItems', 'application', 'recipient'],
      });
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: updateInvoice: invoiceId: ${invoiceId}`,
      );
      expect(loggerService.error).toHaveBeenCalledWith(
        `InvoiceService: updateInvoice: Error updating invoice: Invoice with ID ${invoiceId} not found.`,
        null,
      );
    });

    it('should log and throw an error when repository fails', async () => {
      const invoiceId = 1;
      const mockUpdateData: InvoiceInputDto = {
        applicationId: 1,
        recipientId: 1,
        invoiceId: null,
        subject: 'Updated Invoice',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: InvoiceStatus.PAID,
        taxExempt: false,
        pstExempt: false,
        subtotalInCents: 20000,
        gstInCents: 1000,
        pstInCents: 500,
        totalInCents: 21500,
        notes: 'Updated invoice notes',
        lineItems: [],
      };

      const errorMessage = 'Database error';
      jest.spyOn(repository, 'save').mockRejectedValue(new Error(errorMessage));

      await expect(
        service.updateInvoice(invoiceId, mockUpdateData, {
          username: 'testUser',
        }),
      ).rejects.toThrow(`Failed to update invoice: ${errorMessage}`);

      expect(repository.save).toHaveBeenCalledWith({
        ...mockUpdateData,
        id: invoiceId,
        updatedBy: 'testUser',
      });
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: updateInvoice: invoiceId: ${invoiceId}`,
      );
      expect(loggerService.error).toHaveBeenCalledWith(
        `InvoiceService: updateInvoice: Error updating invoice: ${errorMessage}`,
        null,
      );
    });
  });

  describe('deleteInvoice', () => {
    it('should delete an invoice and return true when repository succeeds', async () => {
      const invoiceId = 1;
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.deleteInvoice(invoiceId);

      expect(repository.delete).toHaveBeenCalledWith(invoiceId);
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: deleteInvoice: invoiceId: ${invoiceId}`,
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: deleteInvoice: Success.`,
      );
      expect(result).toBe(true);
    });

    it('should log and throw an error when the invoice is not found', async () => {
      const invoiceId = 1;
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.deleteInvoice(invoiceId)).rejects.toThrow(
        `Invoice with ID ${invoiceId} not found.`,
      );

      expect(repository.delete).toHaveBeenCalledWith(invoiceId);
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: deleteInvoice: invoiceId: ${invoiceId}`,
      );
      expect(loggerService.error).toHaveBeenCalledWith(
        `InvoiceService: deleteInvoice: Error deleting invoice: Invoice with ID ${invoiceId} not found.`,
        null,
      );
    });

    it('should log and throw an error when repository fails', async () => {
      const invoiceId = 1;
      const errorMessage = 'Database error';
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValue(new Error(errorMessage));

      await expect(service.deleteInvoice(invoiceId)).rejects.toThrow(
        `Failed to delete invoice: ${errorMessage}`,
      );

      expect(repository.delete).toHaveBeenCalledWith(invoiceId);
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: deleteInvoice: invoiceId: ${invoiceId}`,
      );
      expect(loggerService.error).toHaveBeenCalledWith(
        `InvoiceService: deleteInvoice: Error deleting invoice: ${errorMessage}`,
        null,
      );
    });
  });
  describe('getInvoiceById', () => {
    it('should return the invoice when found', async () => {
      const invoiceId = 1;
      const mockInvoice = {
        id: invoiceId,
        lineItems: [],
        attachments: [],
        application: null,
        recipient: null,
        subject: 'Invoice 1',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: 'PAID',
        invoiceId: null,
        taxExempt: false,
        subtotalInCents: 10000,
        gstInCents: 0,
        pstInCents: 0,
        totalInCents: 10000,
        notes: 'Notes for invoice by ID test',
        createdBy: 'testUser',
        updatedBy: 'testUser',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockInvoice);

      const result = await service.getInvoiceById(invoiceId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: invoiceId },
        relations: ['lineItems', 'application', 'recipient'],
      });
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: getInvoiceById: invoiceId: ${invoiceId}`,
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: getInvoiceById: Success.`,
      );
      expect(result).toEqual(mockInvoice);
    });

    it('should log and throw an error when invoice is not found', async () => {
      const invoiceId = 2;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.getInvoiceById(invoiceId)).rejects.toThrow(
        `Failed to fetch invoice with ID ${invoiceId}: Invoice with ID ${invoiceId} not found.`,
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: invoiceId },
        relations: ['lineItems', 'application', 'recipient'],
      });
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: getInvoiceById: invoiceId: ${invoiceId}`,
      );
      expect(loggerService.error).toHaveBeenCalledWith(
        `InvoiceService: getInvoiceById: Error fetching invoice: Invoice with ID ${invoiceId} not found.`,
        null,
      );
    });

    it('should log and throw an error when repository fails', async () => {
      const invoiceId = 3;
      const errorMessage = 'Database error';
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error(errorMessage));

      await expect(service.getInvoiceById(invoiceId)).rejects.toThrow(
        `Failed to fetch invoice with ID ${invoiceId}: ${errorMessage}`,
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: invoiceId },
        relations: ['lineItems', 'application', 'recipient'],
      });
      expect(loggerService.log).toHaveBeenCalledWith(
        `InvoiceService: getInvoiceById: invoiceId: ${invoiceId}`,
      );
      expect(loggerService.error).toHaveBeenCalledWith(
        `InvoiceService: getInvoiceById: Error fetching invoice: ${errorMessage}`,
        null,
      );
    });
  });

  describe('generateInvoicePdf', () => {
    it('should generate a PDF buffer for a valid invoice ID', async () => {
      // Arrange
      const invoiceId = 1;
      const mockInvoice = {
        id: 1,
        subject: 'Test Invoice',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: 'draft',
        application: { id: 123 },
        recipient: {
          id: 456,
          firstName: 'John',
          lastName: 'Doe',
        },
        lineItems: [
          {
            id: 1,
            type: 'fee',
            description: 'Application Fee',
            quantity: 1,
            unitPriceInCents: 10000,
            totalInCents: 10000,
          },
        ],
        subtotalInCents: 10000,
        gstInCents: 500,
        pstInCents: 700,
        totalInCents: 11200,
      };

      jest
        .spyOn(service, 'getInvoiceById')
        .mockResolvedValue(mockInvoice as any);

      // Mock ConfigService to return valid values
      jest.spyOn(configService, 'get').mockImplementation((key) => {
        if (key === 'CDOGS_API_URL')
          return 'https://cdogs.api.example.com/api/v2';
        if (key === 'CDOGS_TOKEN') return 'mock-cdogs-token';
        return undefined;
      });

      // Mock HttpService post method
      const mockPdfBuffer = Buffer.from('mock pdf content');

      // Mock firstValueFrom to return a proper Axios response
      (firstValueFrom as jest.Mock).mockResolvedValue({
        data: mockPdfBuffer,
        headers: {
          'content-disposition': 'attachment; filename=invoice-1.pdf',
        },
        status: 200,
      });

      // Act
      const result = await service.generateInvoicePdf(invoiceId);

      // Assert
      expect(result).toBeInstanceOf(Buffer);
      expect(httpService.post).toHaveBeenCalledWith(
        'https://cdogs.api.example.com/api/v2/template/render',
        expect.objectContaining({
          data: expect.objectContaining({
            invoice: expect.objectContaining({
              id: invoiceId,
              subject: 'Test Invoice',
            }),
          }),
          template: expect.objectContaining({
            content: expect.any(String),
            encodingType: 'base64',
            fileType: 'html',
          }),
          options: expect.objectContaining({
            convertTo: 'pdf',
            reportName: `invoice-${invoiceId}`,
          }),
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-cdogs-token',
            'Content-Type': 'application/json',
          }),
          responseType: 'arraybuffer',
        }),
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        'InvoiceService: generateInvoicePdf: invoiceId: 1',
      );
      expect(loggerService.log).toHaveBeenCalledWith(
        'InvoiceService: generateInvoicePdf: Success.',
      );
    });

    it('should throw an error when invoice is not found', async () => {
      // Arrange
      const invoiceId = 999;
      jest
        .spyOn(service, 'getInvoiceById')
        .mockRejectedValue(new Error('Invoice with ID 999 not found.'));

      // Act & Assert
      await expect(service.generateInvoicePdf(invoiceId)).rejects.toThrow(
        'Failed to generate invoice PDF: Invoice with ID 999 not found.',
      );
      expect(loggerService.error).toHaveBeenCalled();
    });

    it('should throw an HttpException when CDOGS environment variables are missing', async () => {
      // Arrange
      const invoiceId = 123;
      const mockInvoice = {
        id: invoiceId,
        subject: 'Test Invoice',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: 'draft',
        lineItems: [],
        recipient: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      jest
        .spyOn(service, 'getInvoiceById')
        .mockResolvedValue(mockInvoice as any);

      // Mock ConfigService to return null values for the CDOGS env vars
      jest.spyOn(configService, 'get').mockReturnValue(null);

      // Force the service to re-read the config values
      // @ts-ignore - Accessing private property for testing
      service.cdogsApiUrl = null;
      // @ts-ignore - Accessing private property for testing
      service.cdogsToken = null;

      // Act
      let caughtError: any;
      try {
        await service.generateInvoicePdf(invoiceId);
        fail('Expected an HttpException to be thrown');
      } catch (error) {
        caughtError = error;
      }

      // Assert
      expect(caughtError).toBeInstanceOf(HttpException);
      expect(caughtError.message).toBe(
        'CDOGS service is not properly configured. Contact your administrator.',
      );
      expect(caughtError.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);

      expect(loggerService.error).toHaveBeenCalledWith(
        'InvoiceService: generateInvoicePdf: Missing CDOGS environment variables. Please ensure CDOGS_API_URL and CDOGS_TOKEN are set.',
        null,
      );

      // Ensure the HTTP request was not made
      expect(httpService.post).not.toHaveBeenCalled();
    });

    it('should throw an HttpException when the CDOGS API call fails', async () => {
      // Arrange
      const invoiceId = 123;
      const mockInvoice = {
        id: invoiceId,
        subject: 'Test Invoice',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: 'draft',
        lineItems: [],
        recipient: {
          firstName: 'John',
          lastName: 'Doe',
        },
        subtotalInCents: 10000,
        gstInCents: 500,
        pstInCents: 700,
        totalInCents: 11200,
      };

      jest
        .spyOn(service, 'getInvoiceById')
        .mockResolvedValue(mockInvoice as any);

      // Mock HttpService post method
      const errorDetail = { detail: 'Template processing error' };
      const stringifiedError = JSON.stringify(errorDetail);

      jest.spyOn(httpService, 'post').mockReturnValue({
        pipe: jest.fn(),
        toPromise: jest.fn(),
      } as any);

      // Mock firstValueFrom to reject with an error that matches the API's error format
      (firstValueFrom as jest.Mock).mockRejectedValue({
        message: 'API error',
        response: {
          data: errorDetail, // This will be stringified in the service
          status: 422,
        },
      });

      // Act
      let caughtError: any;
      try {
        await service.generateInvoicePdf(invoiceId);
        fail('Expected an error to be thrown');
      } catch (error) {
        caughtError = error;
      }

      // Assert
      expect(caughtError).toBeInstanceOf(HttpException);
      expect(caughtError.message).toBe(
        `Failed to generate invoice PDF: ${stringifiedError}`,
      );
      expect(caughtError.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);

      // Verify that the error logging happened properly
      expect(loggerService.error).toHaveBeenCalledTimes(2);

      // Check first call - CDOGS API Error
      expect(loggerService.error).toHaveBeenNthCalledWith(
        1,
        `InvoiceService: generateInvoicePdf: CDOGS API Error: ${stringifiedError}`,
        undefined,
      );

      // Check second call - Error generating PDF
      expect(loggerService.error).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(
          /InvoiceService: generateInvoicePdf: Error generating PDF:.*/,
        ),
        expect.any(String),
      );
    });

    it('should handle structured error data from the CDOGS API', async () => {
      // Arrange
      const invoiceId = 123;
      const mockInvoice = {
        id: invoiceId,
        subject: 'Test Invoice',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: 'draft',
        lineItems: [],
        recipient: {
          firstName: 'John',
          lastName: 'Doe',
        },
        subtotalInCents: 10000,
        gstInCents: 500,
        pstInCents: 700,
        totalInCents: 11200,
      };

      jest
        .spyOn(service, 'getInvoiceById')
        .mockResolvedValue(mockInvoice as any);

      // Create a structured error response that simulates an HTTP 422 error from CDOGS
      const errorData = {
        type: 'https://httpstatuses.com/422',
        title: 'Unprocessable Entity',
        status: 422,
        detail: 'Invalid template format',
      };

      const stringifiedError = JSON.stringify(errorData);

      const errorResponse = {
        message: 'Request failed with status code 422',
        response: {
          status: 422,
          statusText: 'Unprocessable Entity',
          data: errorData, // Non-string data to test JSON.stringify path
        },
        isAxiosError: true,
      };

      (firstValueFrom as jest.Mock).mockRejectedValue(errorResponse);

      // Act
      let caughtError: any;
      try {
        await service.generateInvoicePdf(invoiceId);
        fail('Expected an error to be thrown');
      } catch (error) {
        caughtError = error;
      }

      // Assert
      expect(caughtError).toBeInstanceOf(HttpException);
      expect(caughtError.message).toBe(
        `Failed to generate invoice PDF: ${stringifiedError}`,
      );

      // Verify that the error logging happened properly
      expect(loggerService.error).toHaveBeenCalledTimes(2);

      // Check first call - CDOGS API Error
      expect(loggerService.error).toHaveBeenNthCalledWith(
        1,
        `InvoiceService: generateInvoicePdf: CDOGS API Error: ${stringifiedError}`,
        undefined,
      );

      // Check second call - Error generating PDF
      expect(loggerService.error).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(
          /InvoiceService: generateInvoicePdf: Error generating PDF:.*/,
        ),
        expect.any(String),
      );
    });

    it('should throw an HttpException when the CDOGS API returns a 401 unauthorized', async () => {
      // Arrange
      const invoiceId = 123;
      const mockInvoice = {
        id: invoiceId,
        subject: 'Test Invoice',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: 'draft',
        lineItems: [],
        recipient: {
          firstName: 'John',
          lastName: 'Doe',
        },
        subtotalInCents: 10000,
        gstInCents: 500,
        pstInCents: 700,
        totalInCents: 11200,
      };

      jest
        .spyOn(service, 'getInvoiceById')
        .mockResolvedValue(mockInvoice as any);

      // Create an error that simulates an HTTP 401 error from CDOGS
      const errorData = {
        type: 'https://httpstatuses.com/401',
        title: 'Unauthorized',
        status: 401,
        detail: 'Access token is missing or invalid',
      };

      const stringifiedError = JSON.stringify(errorData);

      const errorResponse = {
        message: 'Request failed with status code 401',
        response: {
          status: 401,
          statusText: 'Unauthorized',
          data: errorData,
        },
        isAxiosError: true,
      };

      (firstValueFrom as jest.Mock).mockRejectedValue(errorResponse);

      // Act
      let caughtError: any;
      try {
        await service.generateInvoicePdf(invoiceId);
        fail('Expected an error to be thrown');
      } catch (error) {
        caughtError = error;
      }

      // Assert
      expect(caughtError).toBeInstanceOf(HttpException);
      expect(caughtError.message).toBe(
        `Failed to generate invoice PDF: ${stringifiedError}`,
      );
      expect(caughtError.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);

      // Verify that the error logging happened properly
      expect(loggerService.error).toHaveBeenCalledTimes(2);

      // Check first call - CDOGS API Error
      expect(loggerService.error).toHaveBeenNthCalledWith(
        1,
        `InvoiceService: generateInvoicePdf: CDOGS API Error: ${stringifiedError}`,
        undefined,
      );

      // Check second call - Error generating PDF
      expect(loggerService.error).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(
          /InvoiceService: generateInvoicePdf: Error generating PDF:.*/,
        ),
        expect.any(String),
      );

      expect(httpService.post).toHaveBeenCalledWith(
        'https://cdogs.api.example.com/api/v2/template/render',
        expect.anything(),
        expect.anything(),
      );
    });
  });
});
