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

describe('InvoiceService', () => {
  let service: InvoiceService;
  let repository: Repository<InvoiceV2>;
  let loggerService: LoggerService;

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
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    repository = module.get<Repository<InvoiceV2>>(
      getRepositoryToken(InvoiceV2),
    );
    loggerService = module.get<LoggerService>(LoggerService);
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
});
