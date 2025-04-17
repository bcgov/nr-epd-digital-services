import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { InvoiceV2 } from '../../entities/invoiceV2.entity';
import { InvoicesByApplicationIdResponse } from '../../dto/response/invoice/invoicesByApplicationIdResponse';
import { LoggerService } from '../../logger/logger.service';

@Resolver()
export class InvoiceResolver {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly loggerService: LoggerService,
  ) {}

  @Query(() => InvoicesByApplicationIdResponse)
  async getInvoicesByApplicationId(
    @Args('applicationId', { type: () => Int }) applicationId: number,
  ): Promise<InvoicesByApplicationIdResponse> {
    this.loggerService.log(
      `InvoiceResolver: getInvoicesByApplicationId: applicationId: ${applicationId}`,
    );
    const response = new InvoicesByApplicationIdResponse();
    let invoices: InvoiceV2[];

    try {
      invoices = await this.invoiceService.getInvoicesByApplicationId(
        applicationId,
      );
    } catch (error) {
      this.loggerService.error(
        `InvoiceResolver: getInvoicesByApplicationId: Error fetching invoices: ${error.message}`,
        null,
      );
      response.httpStatusCode = 500;
      response.message = 'An error occurred while fetching invoices.';
      response.success = false;
      return response;
    }

    response.invoices = invoices.map((invoice) => ({
      id: invoice.id,
      subject: invoice.subject,
      issuedDate: invoice.issuedDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      totalInCents: invoice.totalInCents,
    }));

    response.httpStatusCode = 200;
    response.success = true;
    return response;
  }
}
