import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { FinancialSummaryResolver } from './financialSummary.resolver';
import { FinancialSummaryService } from '../../services/financialSummary/financialSummary.service';
import { LoggerService } from '../../logger/logger.service';
import { FinancialSummaryDto } from '../../dto/financialSummary/financialSummary.dto';

describe('FinancialSummaryResolver', () => {
  let resolver: FinancialSummaryResolver;
  let service: FinancialSummaryService;

  const mockFinancialSummaryService = {
    getFinancialSummary: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancialSummaryResolver,
        {
          provide: FinancialSummaryService,
          useValue: mockFinancialSummaryService,
        },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    resolver = module.get<FinancialSummaryResolver>(FinancialSummaryResolver);
    service = module.get<FinancialSummaryService>(FinancialSummaryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFinancialSummary', () => {
    it('should return financial summary on success', async () => {
      const mockSummary: FinancialSummaryDto = {
        totalHoursWorked: 120.5,
        totalHoursInvoiced: 80,
        totalCostOfServicesInCents: 500000,
        totalAmountInvoicedInCents: 450000,
        totalAmountPaidInCents: 200000,
        outstandingBalanceInCents: 250000,
      };

      mockFinancialSummaryService.getFinancialSummary.mockResolvedValue(
        mockSummary,
      );

      const result = await resolver.getFinancialSummary(1);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSummary);
      expect(
        mockFinancialSummaryService.getFinancialSummary,
      ).toHaveBeenCalledWith(1);
    });

    it('should return error response when service throws', async () => {
      const error = new Error('Application not found');
      (error as any).status = HttpStatus.NOT_FOUND;
      mockFinancialSummaryService.getFinancialSummary.mockRejectedValue(error);

      const result = await resolver.getFinancialSummary(999);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.message).toBe('Application not found');
    });
  });
});
