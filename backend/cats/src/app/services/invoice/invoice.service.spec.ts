import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InvoiceV2 } from '../../entities/invoiceV2.entity';
import { LoggerService } from '../../logger/logger.service';
import { InvoiceCreateDto, InvoiceStatus } from '../../dto/invoice/invoice.dto';
import {
  InvoiceLineItemCreateDto,
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
            save: jest.fn(),
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

  describe('createInvoice', () => {
    it('should create and return an invoice when repository succeeds', async () => {
      const mockLineItemData: InvoiceLineItemCreateDto = {
        type: InvoiceLineItemType.SERVICE,
        description: 'Consulting services',
        quantity: 2,
        unitPriceInCents: 5000,
        totalInCents: 10000,
      };
      const mockInvoiceData: InvoiceCreateDto = {
        applicationId: 1,
        recipientId: 1,
        invoiceId: null,
        subject: 'Invoice 1',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: InvoiceStatus.PAID,
        taxExempt: false,
        subtotalInCents: 10000,
        gstInCents: 0,
        pstInCents: 0,
        totalInCents: 10000,
        lineItems: [mockLineItemData],
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
        createdBy: 'testUser',
        createdAt: new Date(),
        updatedBy: 'testUser',
        updatedAt: new Date(),
        lineItems: [mockLineItem],
      } as InvoiceV2;

      jest.spyOn(repository, 'save').mockResolvedValue(mockInvoice);

      const result = await service.createInvoice(mockInvoiceData, {
        username: 'testUser',
      });

      expect(repository.save).toHaveBeenCalledWith({
        ...mockInvoiceData,
        createdBy: 'testUser',
        updatedBy: 'testUser',
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
      const mockLineItemData: InvoiceLineItemCreateDto = {
        type: InvoiceLineItemType.SERVICE,
        description: 'Consulting services',
        quantity: 2,
        unitPriceInCents: 5000,
        totalInCents: 10000,
      };
      const mockInvoiceData: InvoiceCreateDto = {
        applicationId: 1,
        recipientId: 1,
        invoiceId: null,
        subject: 'Invoice 1',
        issuedDate: new Date(),
        dueDate: new Date(),
        status: InvoiceStatus.PAID,
        taxExempt: false,
        subtotalInCents: 10000,
        gstInCents: 0,
        pstInCents: 0,
        totalInCents: 10000,
        lineItems: [mockLineItemData],
      };

      const errorMessage = 'Database error';
      jest.spyOn(repository, 'save').mockRejectedValue(new Error(errorMessage));

      await expect(
        service.createInvoice(mockInvoiceData, { username: 'testUser' }),
      ).rejects.toThrow(`Failed to create invoice: ${errorMessage}`);

      expect(repository.save).toHaveBeenCalledWith({
        ...mockInvoiceData,
        createdBy: 'testUser',
        updatedBy: 'testUser',
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
});