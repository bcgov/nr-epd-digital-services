import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceResolver } from './invoice.resolver';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { LoggerService } from '../../logger/logger.service';
import { InvoiceV2 } from '../../entities/invoiceV2.entity';
import { InvoiceInputDto, InvoiceStatus } from '../../dto/invoice/invoice.dto';

describe('InvoiceResolver', () => {
  let resolver: InvoiceResolver;
  let invoiceService: InvoiceService;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceResolver,
        {
          provide: InvoiceService,
          useValue: {
            getInvoicesByApplicationId: jest.fn(),
            updateInvoice: jest.fn(),
            deleteInvoice: jest.fn(),
            getInvoiceById: jest.fn(),
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

    resolver = module.get<InvoiceResolver>(InvoiceResolver);
    invoiceService = module.get<InvoiceService>(InvoiceService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  describe('getInvoicesByApplicationId', () => {
    it('should return invoices when service succeeds', async () => {
      const mockInvoices: InvoiceV2[] = [
        {
          id: 1,
          application: null,
          lineItems: [],
          subject: 'Invoice 1',
          issuedDate: new Date(),
          dueDate: new Date(),
          status: InvoiceStatus.DRAFT,
          recipient: null,
          invoiceId: null,
          taxExempt: false,
          subtotalInCents: 10000,
          gstInCents: 0,
          pstInCents: 0,
          totalInCents: 10000,
          createdBy: 'test-user',
          updatedBy: 'test-user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest
        .spyOn(invoiceService, 'getInvoicesByApplicationId')
        .mockResolvedValue(mockInvoices);

      const applicationId = 123;
      const result = await resolver.getInvoicesByApplicationId(applicationId);

      expect(invoiceService.getInvoicesByApplicationId).toHaveBeenCalledWith(
        applicationId,
      );
      expect(result.success).toBe(true);
      expect(result.httpStatusCode).toBe(200);
      expect(result.invoices).toEqual(
        mockInvoices.map((invoice) => ({
          id: invoice.id,
          subject: invoice.subject,
          issuedDate: invoice.issuedDate,
          dueDate: invoice.dueDate,
          status: invoice.status,
          totalInCents: invoice.totalInCents,
        })),
      );
    });

    it('should handle errors when service fails', async () => {
      jest
        .spyOn(invoiceService, 'getInvoicesByApplicationId')
        .mockRejectedValue(new Error('Service error'));

      const applicationId = 123;
      const result = await resolver.getInvoicesByApplicationId(applicationId);

      expect(invoiceService.getInvoicesByApplicationId).toHaveBeenCalledWith(
        applicationId,
      );
      expect(loggerService.error).toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.httpStatusCode).toBe(500);
      expect(result.message).toBe('An error occurred while fetching invoices.');
    });
  });

  describe('updateInvoice', () => {
    it('should update an invoice successfully', async () => {
      const mockUpdatedInvoice: InvoiceV2 = {
        id: 1,
        application: null,
        lineItems: [],
        subject: 'Updated Invoice',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: InvoiceStatus.PAID,
        recipient: null,
        invoiceId: null,
        taxExempt: false,
        subtotalInCents: 20000,
        gstInCents: 1000,
        pstInCents: 500,
        totalInCents: 21500,
        createdBy: 'test-user',
        updatedBy: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(invoiceService, 'updateInvoice')
        .mockResolvedValue(mockUpdatedInvoice);

      const updateData: InvoiceInputDto = {
        applicationId: null,
        recipientId: null,
        invoiceId: null,
        subject: 'Updated Invoice',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: InvoiceStatus.PAID,
        taxExempt: false,
        subtotalInCents: 20000,
        gstInCents: 1000,
        pstInCents: 500,
        totalInCents: 21500,
        lineItems: [],
      };

      const user = { id: 'test-user' };
      const result = await resolver.updateInvoice(1, updateData, user);

      expect(invoiceService.updateInvoice).toHaveBeenCalledWith(
        1,
        updateData,
        user,
      );
      expect(result.success).toBe(true);
      expect(result.httpStatusCode).toBe(200);
      expect(result.invoice).toEqual({
        id: mockUpdatedInvoice.id,
        applicationId: mockUpdatedInvoice.application?.id,
        recipientId: mockUpdatedInvoice.recipient?.id,
        invoiceId: mockUpdatedInvoice.invoiceId,
        subject: mockUpdatedInvoice.subject,
        issuedDate: mockUpdatedInvoice.issuedDate,
        dueDate: mockUpdatedInvoice.dueDate,
        status: mockUpdatedInvoice.status,
        taxExempt: mockUpdatedInvoice.taxExempt,
        subtotalInCents: mockUpdatedInvoice.subtotalInCents,
        gstInCents: mockUpdatedInvoice.gstInCents,
        pstInCents: mockUpdatedInvoice.pstInCents,
        totalInCents: mockUpdatedInvoice.totalInCents,
        createdAt: mockUpdatedInvoice.createdAt,
        updatedAt: mockUpdatedInvoice.updatedAt,
        createdBy: mockUpdatedInvoice.createdBy,
        updatedBy: mockUpdatedInvoice.updatedBy,
        lineItems: [],
      });
    });

    it('should handle errors when update fails', async () => {
      jest
        .spyOn(invoiceService, 'updateInvoice')
        .mockRejectedValue(new Error('Service error'));

      const updateData: InvoiceInputDto = {
        applicationId: null,
        recipientId: null,
        invoiceId: null,
        subject: 'Updated Invoice',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: InvoiceStatus.PAID,
        taxExempt: false,
        subtotalInCents: 20000,
        gstInCents: 1000,
        pstInCents: 500,
        totalInCents: 21500,
        lineItems: [],
      };

      const user = { id: 'test-user' };
      const result = await resolver.updateInvoice(1, updateData, user);

      expect(invoiceService.updateInvoice).toHaveBeenCalledWith(
        1,
        updateData,
        user,
      );
      expect(loggerService.error).toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.httpStatusCode).toBe(500);
      expect(result.message).toBe(
        'An error occurred while updating the invoice.',
      );
    });
  });

  describe('deleteInvoice', () => {
    it('should delete an invoice successfully', async () => {
      jest.spyOn(invoiceService, 'deleteInvoice').mockResolvedValue(undefined);

      const invoiceId = 1;
      const result = await resolver.deleteInvoice(invoiceId);

      expect(invoiceService.deleteInvoice).toHaveBeenCalledWith(invoiceId);
      expect(result.success).toBe(true);
      expect(result.httpStatusCode).toBe(200);
      expect(result.message).toBe('Invoice deleted successfully.');
    });

    it('should handle errors when delete fails', async () => {
      jest
        .spyOn(invoiceService, 'deleteInvoice')
        .mockRejectedValue(new Error('Service error'));

      const invoiceId = 1;
      const user = { id: 'test-user' };
      const result = await resolver.deleteInvoice(invoiceId);

      expect(invoiceService.deleteInvoice).toHaveBeenCalledWith(invoiceId);
      expect(loggerService.error).toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.httpStatusCode).toBe(500);
      expect(result.message).toBe(
        'An error occurred while deleting the invoice.',
      );
    });
  });
  describe('getInvoiceById', () => {
    it('should return invoice when service succeeds', async () => {
      const mockInvoice: InvoiceV2 = {
        id: 1,
        application: null,
        lineItems: [],
        subject: 'Invoice 1',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: InvoiceStatus.DRAFT,
        recipient: null,
        invoiceId: null,
        taxExempt: false,
        subtotalInCents: 10000,
        gstInCents: 0,
        pstInCents: 0,
        totalInCents: 10000,
        createdBy: 'test-user',
        updatedBy: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(invoiceService, 'getInvoiceById')
        .mockResolvedValue(mockInvoice);

      const invoiceId = 1;
      const result = await resolver.getInvoiceById(invoiceId);

      expect(invoiceService.getInvoiceById).toHaveBeenCalledWith(invoiceId);
      expect(result.success).toBe(true);
      expect(result.httpStatusCode).toBe(200);
      expect(result.invoice).toEqual({
        id: mockInvoice.id,
        applicationId: mockInvoice.application?.id,
        recipientId: mockInvoice.recipient?.id,
        invoiceId: mockInvoice.invoiceId,
        subject: mockInvoice.subject,
        issuedDate: mockInvoice.issuedDate,
        dueDate: mockInvoice.dueDate,
        status: mockInvoice.status,
        taxExempt: mockInvoice.taxExempt,
        subtotalInCents: mockInvoice.subtotalInCents,
        gstInCents: mockInvoice.gstInCents,
        pstInCents: mockInvoice.pstInCents,
        createdAt: mockInvoice.createdAt,
        updatedAt: mockInvoice.updatedAt,
        createdBy: mockInvoice.createdBy,
        updatedBy: mockInvoice.updatedBy,
        totalInCents: mockInvoice.totalInCents,
        lineItems: mockInvoice.lineItems.map((lineItem) => ({
          id: lineItem.id,
          type: lineItem.type,
          description: lineItem.description,
          quantity: lineItem.quantity,
          unitPriceInCents: lineItem.unitPriceInCents,
          totalInCents: lineItem.totalInCents,
          createdAt: lineItem.createdAt,
          updatedAt: lineItem.updatedAt,
          createdBy: lineItem.createdBy,
          updatedBy: lineItem.updatedBy,
        })),
      });
    });

    it('should handle errors when service fails', async () => {
      jest
        .spyOn(invoiceService, 'getInvoiceById')
        .mockRejectedValue(new Error('Service error'));

      const invoiceId = 1;
      const result = await resolver.getInvoiceById(invoiceId);

      expect(invoiceService.getInvoiceById).toHaveBeenCalledWith(invoiceId);
      expect(loggerService.error).toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.httpStatusCode).toBe(500);
      expect(result.message).toBe(
        'An error occurred while fetching the invoice.',
      );
    });
  });
});
