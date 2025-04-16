import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InvoiceV2 } from '../../entities/invoiceV2.entity';
import { LoggerService } from '../../logger/logger.service';

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
    repository = module.get<Repository<InvoiceV2>>(getRepositoryToken(InvoiceV2));
    loggerService = module.get<LoggerService>(LoggerService);
  });

  describe('getInvoicesByApplicationId', () => {
    it('should return invoices when repository succeeds', async () => {
      const mockInvoices: InvoiceV2[] = [
        {
          id: 1,
          application: null,
          lineItems: [],
          subject: 'Invoice 1',
          issuedDate: new Date(),
          dueDate: new Date(),
          status: 'PAID',
          recipient: null,
          invoiceId: null,
          taxExempt: false,
          subtotalInCents: 10000,
          gstInCents: 0,
          pstInCents: 0,
          totalInCents: 10000,
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(mockInvoices);

      const applicationId = 123;
      const result = await service.getInvoicesByApplicationId(applicationId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { application: { id: applicationId } },
        relations: ['line_items'],
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
        relations: ['line_items'],
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
});