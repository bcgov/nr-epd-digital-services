import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceV2 } from '../../entities/invoiceV2.entity';
import { LoggerService } from '../../logger/logger.service';
import { InvoiceInputDto } from '../../dto/invoice/invoice.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class InvoiceService {
  private cdogsApiUrl: string;
  private cdogsToken: string;

  constructor(
    @InjectRepository(InvoiceV2)
    private readonly invoiceRepository: Repository<InvoiceV2>,
    private readonly loggerService: LoggerService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.cdogsApiUrl = this.configService.get<string>('CDOGS_API_URL');
    this.cdogsToken = this.configService.get<string>('CDOGS_TOKEN');
  }

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
        relations: ['lineItems'],
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

  async createInvoice(
    invoiceData: InvoiceInputDto,
    user: any,
  ): Promise<InvoiceV2> {
    this.loggerService.log(
      `InvoiceService: createInvoice: invoiceData: ${JSON.stringify(
        invoiceData,
      )}`,
    );
    let invoice: InvoiceV2;
    try {
      invoice = await this.invoiceRepository.save({
        ...invoiceData,
        application: { id: invoiceData.applicationId },
        recipient: { id: invoiceData.recipientId },
        createdBy: user.name,
        updatedBy: user.name,
        lineItems: invoiceData.lineItems.map((item) => ({
          ...item,
          createdBy: user.name,
          updatedBy: user.name,
        })),
      });
    } catch (error) {
      this.loggerService.error(
        `InvoiceService: createInvoice: Error creating invoice: ${error.message}`,
        null,
      );
      throw new Error(`Failed to create invoice: ${error.message}`);
    }
    this.loggerService.log(`InvoiceService: createInvoice: Success.`);
    return invoice;
  }

  async updateInvoice(
    id: number,
    updateData: InvoiceInputDto,
    user: any,
  ): Promise<InvoiceV2> {
    this.loggerService.log(`InvoiceService: updateInvoice: invoiceId: ${id}`);
    let updatedInvoice: InvoiceV2;
    try {
      await this.invoiceRepository.save({
        ...updateData,
        id: id,
        updatedBy: user.username,
      });
      updatedInvoice = await this.invoiceRepository.findOne({
        where: { id: id },
        relations: ['lineItems', 'application', 'recipient'],
      });
      if (!updatedInvoice) {
        throw new Error(`Invoice with ID ${id} not found.`);
      }
    } catch (error) {
      this.loggerService.error(
        `InvoiceService: updateInvoice: Error updating invoice: ${error.message}`,
        null,
      );
      throw new Error(`Failed to update invoice: ${error.message}`);
    }
    this.loggerService.log(`InvoiceService: updateInvoice: Success.`);
    return updatedInvoice;
  }

  async deleteInvoice(id: number): Promise<boolean> {
    this.loggerService.log(`InvoiceService: deleteInvoice: invoiceId: ${id}`);
    try {
      const result = await this.invoiceRepository.delete(id);
      if (result.affected === 0) {
        throw new Error(`Invoice with ID ${id} not found.`);
      }
      this.loggerService.log(`InvoiceService: deleteInvoice: Success.`);
      return true;
    } catch (error) {
      this.loggerService.error(
        `InvoiceService: deleteInvoice: Error deleting invoice: ${error.message}`,
        null,
      );
      throw new Error(`Failed to delete invoice: ${error.message}`);
    }
  }

  async getInvoiceById(id: number): Promise<InvoiceV2> {
    this.loggerService.log(`InvoiceService: getInvoiceById: invoiceId: ${id}`);
    let invoice: InvoiceV2;
    try {
      invoice = await this.invoiceRepository.findOne({
        where: { id },
        relations: ['lineItems', 'application', 'recipient'],
      });

      if (!invoice) {
        throw new Error(`Invoice with ID ${id} not found.`);
      }
    } catch (error) {
      this.loggerService.error(
        `InvoiceService: getInvoiceById: Error fetching invoice: ${error.message}`,
        null,
      );
      throw new Error(
        `Failed to fetch invoice with ID ${id}: ${error.message}`,
      );
    }
    this.loggerService.log(`InvoiceService: getInvoiceById: Success.`);
    return invoice;
  }

  /**
   * Generates a PDF for the invoice using BC Government Common Document Generation Service (CDOGS)
   * @param id The invoice ID
   * @returns Buffer containing the PDF data
   */
  async generateInvoicePdf(id: number): Promise<Buffer> {
    this.loggerService.log(
      `InvoiceService: generateInvoicePdf: invoiceId: ${id}`,
    );
    try {
      // Get the invoice with all its data
      const invoice = await this.getInvoiceById(id);

      if (!invoice) {
        throw new Error(`Invoice with ID ${id} not found.`);
      }

      // Check for required environment variables
      if (!this.cdogsApiUrl || !this.cdogsToken) {
        this.loggerService.error(
          'InvoiceService: generateInvoicePdf: Missing CDOGS environment variables. Please ensure CDOGS_API_URL and CDOGS_TOKEN are set.',
          null,
        );

        throw new HttpException(
          'CDOGS service is not properly configured. Contact your administrator.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.loggerService.log(
        `InvoiceService: Preparing data for CDOGS API call`,
      );

      // Create template data for CDOGS based on invoice data
      const templateData = {
        invoice: {
          id: invoice.id,
          subject: invoice.subject,
          issuedDate: new Date(invoice.issuedDate).toLocaleDateString(),
          dueDate: new Date(invoice.dueDate).toLocaleDateString(),
          status: invoice.status,
          subtotalInCents: (invoice.subtotalInCents / 100).toFixed(2),
          gstInCents: (invoice.gstInCents / 100).toFixed(2),
          pstInCents: (invoice.pstInCents / 100).toFixed(2),
          totalInCents: (invoice.totalInCents / 100).toFixed(2),
          recipient: {
            id: invoice.recipient?.id,
            name:
              invoice.recipient?.firstName + ' ' + invoice.recipient?.lastName,
          },
          lineItems: invoice.lineItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: (item.unitPriceInCents / 100).toFixed(2),
            total: (item.totalInCents / 100).toFixed(2),
          })),
        },
      };

      // Read the invoice template - normally this would be a base64 encoded HTML template
      // For simplicity, we'll create a basic HTML template here
      // We need to use { and } characters for the Handlebars template
      // String is formatted with double braces for the templating system
      // TODO: Replace this with a proper template file read if needed
      const template = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice #\{\{invoice.id\}\}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 40px; color: #333; }
            .header { border-bottom: 1px solid #eee; padding-bottom: 20px; }
            .invoice-id { font-size: 24px; font-weight: bold; }
            .invoice-details { margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th { text-align: left; border-bottom: 2px solid #eee; padding: 10px 5px; }
            td { padding: 10px 5px; border-bottom: 1px solid #eee; }
            .totals { margin-top: 30px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="invoice-id">Invoice #\{\{invoice.id\}\}</div>
            <div>\{\{invoice.subject\}\}</div>
          </div>
          
          <div class="invoice-details">
            <div><strong>Issue Date:</strong> \{\{invoice.issuedDate\}\}</div>
            <div><strong>Due Date:</strong> \{\{invoice.dueDate\}\}</div>
            <div><strong>Status:</strong> \{\{invoice.status\}\}</div>
            <div><strong>Recipient:</strong> \{\{invoice.recipient.name\}\}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              \{\{#each invoice.lineItems\}\}
              <tr>
                <td>\{\{description\}\}</td>
                <td>\{\{quantity\}\}</td>
                <td>$\{\{unitPrice\}\}</td>
                <td>$\{\{total\}\}</td>
              </tr>
              \{\{/each\}\}
            </tbody>
          </table>
          
          <div class="totals">
            <div><strong>Subtotal:</strong> $\{\{invoice.subtotalInCents\}\}</div>
            <div><strong>GST:</strong> $\{\{invoice.gstInCents\}\}</div>
            <div><strong>PST:</strong> $\{\{invoice.pstInCents\}\}</div>
            <div><strong>Total:</strong> $\{\{invoice.totalInCents\}\}</div>
          </div>
        </body>
        </html>
      `;

      const base64Template = Buffer.from(template).toString('base64');

      // Prepare request payload
      const payload = {
        data: templateData,
        template: {
          content: base64Template,
          encodingType: 'base64',
          fileType: 'html',
        },
        options: {
          convertTo: 'pdf',
          reportName: `invoice-${invoice.id}`,
          overwrite: true,
        },
      };

      // Set up headers with authentication token
      const headers = {
        Authorization: `Bearer ${this.cdogsToken}`,
        'Content-Type': 'application/json',
      };

      this.loggerService.log(
        `InvoiceService: generateInvoicePdf: Calling CDOGS API`,
      );

      // Make the API call to CDOGS
      try {
        const response = await firstValueFrom(
          this.httpService.post(
            `${this.cdogsApiUrl}/template/render`,
            payload,
            {
              headers,
              responseType: 'arraybuffer',
            },
          ),
        );

        this.loggerService.log(`InvoiceService: generateInvoicePdf: Success.`);

        // Convert the response to a Buffer and return it
        return Buffer.from(response.data);
      } catch (error) {
        // Extract detailed error information if available
        const errorMessage = error?.response?.data
          ? typeof error.response.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response.data)
          : error.message;

        this.loggerService.error(
          `InvoiceService: generateInvoicePdf: CDOGS API Error: ${errorMessage}`,
          error.stack,
        );

        throw new HttpException(
          `Failed to generate invoice PDF: ${errorMessage}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      this.loggerService.error(
        `InvoiceService: generateInvoicePdf: Error generating PDF: ${error.message}`,
        error.stack,
      );

      if (error instanceof HttpException) {
        // Re-throw HttpExceptions as they already have proper status codes
        throw error;
      }

      // If this was a CDOGS API error, we may want to extract more details
      const responseError = error?.response?.data
        ? JSON.stringify(error.response.data)
        : error.message;

      throw new HttpException(
        `Failed to generate invoice PDF: ${responseError}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
