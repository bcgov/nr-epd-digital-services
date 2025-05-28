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
      subtotalInCents: result.subtotalInCents,
      gstInCents: result.gstInCents,
      pstInCents: result.pstInCents,
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
      subtotalInCents: result.subtotalInCents,
      gstInCents: result.gstInCents,
      pstInCents: result.pstInCents,
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
}
