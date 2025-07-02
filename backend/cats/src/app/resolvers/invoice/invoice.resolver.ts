import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { InvoiceV2 } from '../../entities/invoiceV2.entity';
import { InvoicesByApplicationIdResponse } from '../../dto/response/invoice/invoicesByApplicationIdResponse';
import { LoggerService } from '../../logger/logger.service';
import { InvoiceResponse } from '../../dto/response/invoice/invoiceResponse';
import {
  InvoiceInputDto as InvoiceInputDto,
  InvoiceDto,
  InvoiceStatus,
} from '../../dto/invoice/invoice.dto';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { ResponseDto } from '../../dto/response/response.dto';
import { GenericValidationPipe } from '../../utilities/validations/genericValidationPipe';
import { UsePipes } from '@nestjs/common';
import { InvoicePdfResponse } from '../../dto/response/invoice/invoicePdfResponse';

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
      notes: invoice.notes,
    }));

    response.httpStatusCode = 200;
    response.success = true;
    return response;
  }

  @Mutation(() => InvoiceResponse)
  async createInvoice(
    @Args('invoiceData') invoiceData: InvoiceInputDto,
    @AuthenticatedUser() user: any,
  ): Promise<InvoiceResponse> {
    this.loggerService.log(
      `InvoiceResolver: createInvoice: invoiceData: ${JSON.stringify(
        invoiceData,
      )}`,
    );
    const response = new InvoiceResponse();
    let result: InvoiceV2;

    try {
      result = await this.invoiceService.createInvoice(invoiceData, user);
    } catch (error) {
      this.loggerService.error(
        `InvoiceResolver: createInvoice: Error creating invoice: ${error.message}`,
        null,
      );
      response.httpStatusCode = 500;
      response.message = 'An error occurred while updating the invoice.';
      response.success = false;
      return response;
    }

    const createdInvoice: InvoiceDto = {
      id: result.id,
      applicationId: result.application?.id,
      recipientId: result.recipient?.id,
      invoiceId: result.invoiceId,
      subject: result.subject,
      issuedDate: result.issuedDate,
      dueDate: result.dueDate,
      status: result.status as InvoiceStatus,
      taxExempt: result.taxExempt,
      pstExempt: result.pstExempt,
      subtotalInCents: result.subtotalInCents,
      gstInCents: result.gstInCents,
      pstInCents: result.pstInCents,
      notes: result.notes,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      createdBy: result.createdBy,
      updatedBy: result.updatedBy,
      totalInCents: result.totalInCents,
      lineItems: result.lineItems.map((lineItem) => ({
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
    };

    response.invoice = createdInvoice;
    response.httpStatusCode = 201;
    response.success = true;
    return response;
  }

  @Mutation(() => InvoiceResponse)
  @UsePipes(new GenericValidationPipe())
  async updateInvoice(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateData') updateData: InvoiceInputDto,
    @AuthenticatedUser() user: any,
  ): Promise<InvoiceResponse> {
    this.loggerService.log(
      `InvoiceResolver: updateInvoice: invoiceId: ${id}, updateData: ${JSON.stringify(
        updateData,
      )}`,
    );
    const response = new InvoiceResponse();
    let result: InvoiceV2;
    try {
      result = await this.invoiceService.updateInvoice(id, updateData, user);
    } catch (error) {
      this.loggerService.error(
        `InvoiceResolver: updateInvoice: Error updating invoice: ${error.message}`,
        null,
      );
      response.httpStatusCode = 500;
      response.message = 'An error occurred while updating the invoice.';
      response.success = false;
      return response;
    }
    const updatedInvoice: InvoiceDto = {
      id: result.id,
      applicationId: result.application?.id,
      recipientId: result.recipient?.id,
      invoiceId: result.invoiceId,
      subject: result.subject,
      issuedDate: result.issuedDate,
      dueDate: result.dueDate,
      status: result.status,
      taxExempt: result.taxExempt,
      pstExempt: result.pstExempt,
      subtotalInCents: result.subtotalInCents,
      gstInCents: result.gstInCents,
      pstInCents: result.pstInCents,
      notes: result.notes,
      totalInCents: result.totalInCents,
      createdBy: result.createdBy,
      updatedBy: result.updatedBy,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      lineItems: result.lineItems.map((lineItem) => ({
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
    };

    response.invoice = updatedInvoice;
    response.httpStatusCode = 200;
    response.success = true;
    return response;
  }

  @Mutation(() => ResponseDto)
  async deleteInvoice(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ResponseDto> {
    this.loggerService.log(`InvoiceResolver: deleteInvoice: invoiceId: ${id}`);
    let response = new ResponseDto();
    try {
      await this.invoiceService.deleteInvoice(id);
    } catch (error) {
      this.loggerService.error(
        `InvoiceResolver: deleteInvoice: Error deleting invoice: ${error.message}`,
        null,
      );
      response.httpStatusCode = 500;
      response.message = 'An error occurred while deleting the invoice.';
      response.success = false;
      return response;
    }

    response.httpStatusCode = 200;
    response.success = true;
    response.message = 'Invoice deleted successfully.';
    return response;
  }

  @Query(() => InvoiceResponse)
  async getInvoiceById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<InvoiceResponse> {
    this.loggerService.log(`InvoiceResolver: getInvoiceById: invoiceId: ${id}`);
    const response = new InvoiceResponse();
    let invoice: InvoiceV2;

    try {
      invoice = await this.invoiceService.getInvoiceById(id);
    } catch (error) {
      this.loggerService.error(
        `InvoiceResolver: getInvoiceById: Error fetching invoice: ${error.message}`,
        null,
      );
      response.httpStatusCode = 500;
      response.message = 'An error occurred while fetching the invoice.';
      response.success = false;
      return response;
    }

    const invoiceDto: InvoiceDto = {
      id: invoice.id,
      applicationId: invoice.application?.id,
      recipientId: invoice.recipient?.id,
      invoiceId: invoice.invoiceId,
      subject: invoice.subject,
      issuedDate: invoice.issuedDate,
      dueDate: invoice.dueDate,
      status: invoice.status as InvoiceStatus,
      taxExempt: invoice.taxExempt,
      pstExempt: invoice.pstExempt,
      subtotalInCents: invoice.subtotalInCents,
      gstInCents: invoice.gstInCents,
      pstInCents: invoice.pstInCents,
      notes: invoice.notes,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      createdBy: invoice.createdBy,
      updatedBy: invoice.updatedBy,
      totalInCents: invoice.totalInCents,
      lineItems: invoice.lineItems.map((lineItem) => ({
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
    };

    response.invoice = invoiceDto;
    response.httpStatusCode = 200;
    response.success = true;
    return response;
  }

  @Query(() => InvoicePdfResponse)
  async downloadInvoicePdf(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<InvoicePdfResponse> {
    this.loggerService.log(
      `InvoiceResolver: downloadInvoicePdf: invoiceId: ${id}`,
    );
    const response = new InvoicePdfResponse();

    try {
      // Get the invoice first to determine filename
      const invoice = await this.invoiceService.getInvoiceById(id);
      const pdfBuffer = await this.invoiceService.generateInvoicePdf(id);

      // Convert buffer to Base64 string for GraphQL response
      const base64Content = pdfBuffer.toString('base64');

      // Create a filename for the PDF
      const filename = `invoice_${id}_${invoice.subject
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase()}.pdf`;

      // Populate response
      response.pdfContent = base64Content;
      response.filename = filename;
      response.httpStatusCode = 200;
      response.success = true;
      response.message = 'Invoice PDF generated successfully.';

      return response;
    } catch (error) {
      this.loggerService.error(
        `InvoiceResolver: downloadInvoicePdf: Error: ${error.message}`,
        null,
      );
      response.httpStatusCode = 500;
      response.message = 'An error occurred while generating the invoice PDF.';
      response.success = false;
      return response;
    }
  }
}
