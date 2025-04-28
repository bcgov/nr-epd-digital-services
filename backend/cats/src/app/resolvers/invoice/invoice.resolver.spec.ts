import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceResolver } from './invoice.resolver';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { LoggerService } from '../../logger/logger.service';
import { InvoiceV2 } from '../../entities/invoiceV2.entity';
import { InvoiceStatus } from '../../dto/invoice/invoice.dto';

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
});
