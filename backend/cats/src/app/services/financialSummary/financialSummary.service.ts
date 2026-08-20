import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TimesheetDay } from '../../entities/timesheetDay.entity';
import { InvoiceV2 } from '../../entities/invoiceV2.entity';
import { InvoiceItem } from '../../entities/invoiceItem.entity';
import { Application } from '../../entities/application.entity';
import { InvoiceStatus } from '../../utilities/enums/invoice/invoiceStatus.enum';
import { InvoiceItemType } from '../../utilities/enums/invoice/invoiceItemType.enum';
import { FinancialSummaryDto } from '../../dto/financialSummary/financialSummary.dto';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class FinancialSummaryService {
  constructor(
    @InjectRepository(TimesheetDay)
    private readonly timesheetDayRepository: Repository<TimesheetDay>,
    @InjectRepository(InvoiceV2)
    private readonly invoiceRepository: Repository<InvoiceV2>,
    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly loggerService: LoggerService,
  ) {}

  async getFinancialSummary(
    applicationId: number,
  ): Promise<FinancialSummaryDto> {
    this.loggerService.log(
      `FinancialSummaryService.getFinancialSummary(): applicationId=${applicationId}`,
    );

    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
    });

    if (!application) {
      throw new HttpException(
        `Application with ID ${applicationId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const [totalHoursWorked, invoiceMetrics] = await Promise.all([
      this.calculateTotalHoursWorked(applicationId),
      this.calculateInvoiceMetrics(applicationId),
    ]);

    const summary: FinancialSummaryDto = {
      totalHoursWorked,
      totalHoursInvoiced: invoiceMetrics.totalHoursInvoiced,
      totalCostOfServicesInCents: invoiceMetrics.totalCostOfServicesInCents,
      totalAmountInvoicedInCents: invoiceMetrics.totalAmountInvoicedInCents,
      totalAmountPaidInCents: invoiceMetrics.totalAmountPaidInCents,
      outstandingBalanceInCents:
        invoiceMetrics.totalAmountInvoicedInCents -
        invoiceMetrics.totalAmountPaidInCents,
    };

    this.loggerService.log(
      `FinancialSummaryService.getFinancialSummary(): completed for applicationId=${applicationId}`,
    );

    return summary;
  }

  private async calculateTotalHoursWorked(
    applicationId: number,
  ): Promise<number> {
    const result = await this.timesheetDayRepository
      .createQueryBuilder('td')
      .select('COALESCE(SUM(td.hours), 0)', 'total')
      .where('td.application_id = :applicationId', { applicationId })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  private async calculateInvoiceMetrics(applicationId: number): Promise<{
    totalHoursInvoiced: number;
    totalCostOfServicesInCents: number;
    totalAmountInvoicedInCents: number;
    totalAmountPaidInCents: number;
  }> {
    const nonDraftStatuses = [
      InvoiceStatus.SENT,
      InvoiceStatus.RECEIVED,
      InvoiceStatus.PAID,
    ];

    const invoices = await this.invoiceRepository.find({
      where: {
        applicationId,
        invoiceStatus: In(nonDraftStatuses),
      },
      select: ['id', 'totalInCents', 'invoiceStatus'],
    });

    if (!invoices.length) {
      return {
        totalHoursInvoiced: 0,
        totalCostOfServicesInCents: 0,
        totalAmountInvoicedInCents: 0,
        totalAmountPaidInCents: 0,
      };
    }

    const invoiceIds = invoices.map((inv) => inv.id);

    const totalAmountInvoicedInCents = invoices.reduce(
      (sum, inv) => sum + inv.totalInCents,
      0,
    );

    const totalAmountPaidInCents = invoices
      .filter((inv) => inv.invoiceStatus === InvoiceStatus.PAID)
      .reduce((sum, inv) => sum + inv.totalInCents, 0);

    const items = await this.invoiceItemRepository.find({
      where: { invoiceId: In(invoiceIds) },
      select: ['quantity', 'totalInCents', 'itemType'],
    });

    const totalHoursInvoiced = items
      .filter((item) => item.itemType === InvoiceItemType.TIMESHEET)
      .reduce((sum, item) => sum + item.quantity, 0);

    const totalCostOfServicesInCents = items.reduce(
      (sum, item) => sum + item.totalInCents,
      0,
    );

    return {
      totalHoursInvoiced,
      totalCostOfServicesInCents,
      totalAmountInvoicedInCents,
      totalAmountPaidInCents,
    };
  }
}
