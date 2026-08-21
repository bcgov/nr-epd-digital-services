import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { FinancialSummaryService } from './financialSummary.service';
import { TimesheetDay } from '../../entities/timesheetDay.entity';
import { InvoiceV2 } from '../../entities/invoiceV2.entity';
import { InvoiceItem } from '../../entities/invoiceItem.entity';
import { Application } from '../../entities/application.entity';
import { LoggerService } from '../../logger/logger.service';
import { InvoiceStatus } from '../../utilities/enums/invoice/invoiceStatus.enum';
import { InvoiceItemType } from '../../utilities/enums/invoice/invoiceItemType.enum';

describe('FinancialSummaryService', () => {
  let service: FinancialSummaryService;

  const mockTimesheetDayRepository = {
    createQueryBuilder: jest.fn(),
  };

  const mockInvoiceRepository = {
    find: jest.fn(),
  };

  const mockInvoiceItemRepository = {
    find: jest.fn(),
  };

  const mockApplicationRepository = {
    findOne: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancialSummaryService,
        {
          provide: getRepositoryToken(TimesheetDay),
          useValue: mockTimesheetDayRepository,
        },
        {
          provide: getRepositoryToken(InvoiceV2),
          useValue: mockInvoiceRepository,
        },
        {
          provide: getRepositoryToken(InvoiceItem),
          useValue: mockInvoiceItemRepository,
        },
        {
          provide: getRepositoryToken(Application),
          useValue: mockApplicationRepository,
        },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    service = module.get<FinancialSummaryService>(FinancialSummaryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFinancialSummary', () => {
    const applicationId = 1;

    it('should throw HttpException when application not found', async () => {
      mockApplicationRepository.findOne.mockResolvedValue(null);

      await expect(service.getFinancialSummary(applicationId)).rejects.toThrow(
        HttpException,
      );
    });

    it('should return all zeros when no timesheets or invoices exist', async () => {
      mockApplicationRepository.findOne.mockResolvedValue({
        id: applicationId,
      });

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: '0' }),
      };
      mockTimesheetDayRepository.createQueryBuilder.mockReturnValue(
        queryBuilder,
      );
      mockInvoiceRepository.find.mockResolvedValue([]);

      const result = await service.getFinancialSummary(applicationId);

      expect(result).toEqual({
        totalHoursWorked: 0,
        totalHoursInvoiced: 0,
        totalCostOfServicesInCents: 0,
        totalAmountInvoicedInCents: 0,
        totalAmountPaidInCents: 0,
        outstandingBalanceInCents: 0,
      });
    });

    it('should calculate total hours worked from timesheet days', async () => {
      mockApplicationRepository.findOne.mockResolvedValue({
        id: applicationId,
      });

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: '42.50' }),
      };
      mockTimesheetDayRepository.createQueryBuilder.mockReturnValue(
        queryBuilder,
      );
      mockInvoiceRepository.find.mockResolvedValue([]);

      const result = await service.getFinancialSummary(applicationId);

      expect(result.totalHoursWorked).toBe(42.5);
    });

    it('should calculate invoice metrics correctly', async () => {
      mockApplicationRepository.findOne.mockResolvedValue({
        id: applicationId,
      });

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: '100.00' }),
      };
      mockTimesheetDayRepository.createQueryBuilder.mockReturnValue(
        queryBuilder,
      );

      const mockInvoices = [
        { id: 1, totalInCents: 50000, invoiceStatus: InvoiceStatus.SENT },
        { id: 2, totalInCents: 30000, invoiceStatus: InvoiceStatus.PAID },
        { id: 3, totalInCents: 20000, invoiceStatus: InvoiceStatus.RECEIVED },
      ];
      mockInvoiceRepository.find.mockResolvedValue(mockInvoices);

      const mockItems = [
        {
          invoiceId: 1,
          quantity: 10,
          totalInCents: 25000,
          itemType: InvoiceItemType.TIMESHEET,
        },
        {
          invoiceId: 1,
          quantity: 1,
          totalInCents: 5000,
          itemType: InvoiceItemType.EXPENSE,
        },
        {
          invoiceId: 2,
          quantity: 8,
          totalInCents: 20000,
          itemType: InvoiceItemType.TIMESHEET,
        },
        {
          invoiceId: 3,
          quantity: 5,
          totalInCents: 12500,
          itemType: InvoiceItemType.SERVICE,
        },
      ];
      mockInvoiceItemRepository.find.mockResolvedValue(mockItems);

      const result = await service.getFinancialSummary(applicationId);

      expect(result.totalHoursInvoiced).toBe(18);

      expect(result.totalCostOfServicesInCents).toBe(62500);

      expect(result.totalAmountInvoicedInCents).toBe(100000);

      expect(result.totalAmountPaidInCents).toBe(30000);

      expect(result.outstandingBalanceInCents).toBe(70000);
    });

    it('should handle null hours in timesheet query result', async () => {
      mockApplicationRepository.findOne.mockResolvedValue({
        id: applicationId,
      });

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: null }),
      };
      mockTimesheetDayRepository.createQueryBuilder.mockReturnValue(
        queryBuilder,
      );
      mockInvoiceRepository.find.mockResolvedValue([]);

      const result = await service.getFinancialSummary(applicationId);

      expect(result.totalHoursWorked).toBe(0);
    });
  });
});
