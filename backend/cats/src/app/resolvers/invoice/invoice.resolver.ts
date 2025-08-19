import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { LoggerService } from '../../logger/logger.service';
import { InvoiceResponse, InvoicesResponse } from '../../dto/response/invoice/invoiceResponse';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { HttpStatus } from '@nestjs/common';
import { ViewInvoice } from '../../dto/invoice/viewInvoice.dto';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { CreateInvoice } from '../../dto/invoice/createInvoice.dto';
import { UpdateInvoice } from '../../dto/invoice/updateInvoice.dto';

@Resolver()
export class InvoiceResolver {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly loggerService: LoggerService,
    private readonly invoiceRes: GenericResponseProvider<ViewInvoice>,
    private readonly invoicesRes: GenericResponseProvider<ViewInvoice[]>,
  ) {}


  @Query(() => InvoicesResponse, { name: 'getInvoices' })
  async getInvoices( @Args('applicationId', { type: () => Int }) applicationId: number) {
    try
    {
      this.loggerService.log(
        `InvoiceResolver: getInvoices: applicationId: ${applicationId}`,
      );
      const invoices = await this.invoiceService.getInvoices(applicationId);
      if(invoices?.length > 0){
       return this.invoicesRes.createResponse('Invoice records fetched successfully', HttpStatus.OK, true, invoices);
      }
      else{
       return this.invoicesRes.createResponse('No invoice records found', HttpStatus.NOT_FOUND, false, []);
      }
    }
    catch (error) {
      this.loggerService.error(
        `InvoiceResolver: getInvoices: Error fetching invoices: ${error.message}`,
        null,
      );
    }
  }
  
  @Query(() => InvoiceResponse, { name: 'getInvoiceById' })
  async getInvoiceById(@Args('invoiceId', { type: () => Int }) invoiceId: number){
    try
    {
      this.loggerService.log(
        `InvoiceResolver: getInvoiceById: invoiceId: ${invoiceId}`,
      );
      const invoice = await this.invoiceService.getInvoiceById(invoiceId);
      if(invoice){
       return this.invoiceRes.createResponse('Invoice record fetched successfully', HttpStatus.OK, true, invoice);
      }
      else{
       return this.invoiceRes.createResponse('Invoice record not found', HttpStatus.NOT_FOUND, false, null);
      }
    }
    catch (error) {
      this.loggerService.error(
        `InvoiceResolver: getInvoiceById: Error fetching invoice: ${error.message}`,
        null,
      );
    }
  }

  @Mutation(() => InvoiceResponse, { name: 'createInvoice' })
  async createInvoice(
    @Args('invoice',  { type: () => CreateInvoice }) invoice: CreateInvoice,
    @AuthenticatedUser() user: any) { 
      try
      {
        this.loggerService.log(`InvoiceResolver: createInvoice: invoice: ${JSON.stringify( invoice)}`);
        const result = await this.invoiceService.createInvoice(invoice, user);
        if(result){
          return this.invoiceRes.createResponse('Invoice created successfully', HttpStatus.OK, true, result);
        }
        else{
          return this.invoiceRes.createResponse('Failed to create invoice', HttpStatus.INTERNAL_SERVER_ERROR, false, null);
        }
      }
      catch (error) {
        this.loggerService.error(
          `InvoiceResolver: createInvoice: Error creating invoice: ${error.message}`,
          null,
        );
      }
  }

  @Mutation(() => InvoiceResponse, { name: 'deleteInvoice' })
  async deleteInvoice(@Args('invoiceId', { type: () => Int }) invoiceId: number){
    try
    {
      this.loggerService.log(
        `InvoiceResolver: deleteInvoice: invoiceId: ${invoiceId}`,
      );
      const result = await this.invoiceService.deleteInvoice(invoiceId);
      if(!!result){
        return this.invoiceRes.createResponse('Invoice deleted successfully', HttpStatus.OK, true);
      }
      else{
        return this.invoiceRes.createResponse('Invoice not found', HttpStatus.NOT_FOUND, false);
      }
    }
    catch (error) {
      this.loggerService.error(
        `InvoiceResolver: deleteInvoice: Error deleting invoice: ${error.message}`,
        null,
      );
      return this.invoiceRes.createResponse('Failed to delete invoice', HttpStatus.INTERNAL_SERVER_ERROR, false);
    }
  }

  @Mutation(() => InvoiceResponse, { name: 'updateInvoice' })
  async updateInvoice( 
    @Args('invoice',  { type: () => UpdateInvoice }) invoice: UpdateInvoice, 
    @AuthenticatedUser() user: any){
      try
      {
        this.loggerService.log(`InvoiceResolver: updateInvoice: invoice: ${JSON.stringify( invoice)}`);
        const result = await this.invoiceService.updateInvoice(invoice, user);
        if(result){
          return this.invoiceRes.createResponse('Invoice updated successfully', HttpStatus.OK, true, result);
        }
        else{
          return this.invoiceRes.createResponse('Invoice not found', HttpStatus.NOT_FOUND, false, null);
        }

      }
      catch (error) {
        this.loggerService.error(
          `InvoiceResolver: updateInvoice: Error updating invoice: ${error.message}`,
          null,
        );
      }
  }
}
