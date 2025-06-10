import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceV2 } from '../../entities/invoiceV2.entity';
import { LoggerService } from '../../logger/logger.service';
import { InvoiceInputDto } from '../../dto/invoice/invoice.dto';

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
}
