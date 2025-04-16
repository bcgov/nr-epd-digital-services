import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceV2 } from '../../entities/invoiceV2.entity';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceV2)
    private readonly invoiceRepository: Repository<InvoiceV2>,
    private readonly loggerService: LoggerService,
  ) {}

  async getInvoicesByApplicationId(
    applicationId: number,
  ): Promise<InvoiceV2[]> {
    this.loggerService.log(
      `InvoiceService: getInvoicesByApplicationId: applicationId: ${applicationId}`,
    );
    let invoices: InvoiceV2[];
    try {
      invoices = await this.invoiceRepository.find({
        where: { application: { id: applicationId } },
        relations: ['line_items'],
      });
    } catch (error) {
      this.loggerService.error(
        `InvoiceService: getInvoicesByApplicationId: Error fetching invoices: ${error.message}`,
        null,
      );
      throw new Error(
        `Failed to fetch invoices for application ID ${applicationId}: ${error.message}`,
      );
    }
    this.loggerService.log(
      `InvoiceService: getInvoicesByApplicationId: Success.`,
    );
    return invoices;
  }
}
