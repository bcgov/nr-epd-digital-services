import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceV2 } from '../../entities/invoiceV2.entity';
import { LoggerService } from '../../logger/logger.service';
import { plainToInstance } from 'class-transformer';
import { ViewInvoice } from '../../dto/invoice/viewInvoice.dto';
import { CreateInvoice } from '../../dto/invoice/createInvoice.dto';
import { UpdateInvoice } from '../../dto/invoice/updateInvoice.dto';
import { InvoiceItem } from '../../entities/invoiceItem.entity';
import { InvoiceAttachment } from '../../entities/invoiceAttachment.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceV2)
    private readonly invoiceRepository: Repository<InvoiceV2>,

    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepo: Repository<InvoiceItem>,

    @InjectRepository(InvoiceAttachment)
    private readonly invoiceAttachmentRepo: Repository<InvoiceAttachment>,
    
    private readonly loggerService: LoggerService,
  ) {}

  async getInvoices(applicationId : number){
    try 
    {
      this.loggerService.log(`InvoiceService.getInvoices() start`);
      if(applicationId <= 0)
      {
        this.loggerService.log(`Invalid applicationId: ${applicationId}`);
        return [];
      }
      else
      {
        this.loggerService.log(`Valid applicationId: ${applicationId}`);
        this.loggerService.log( `InvoiceService.getInvoices(): applicationId: ${applicationId}`);
        const invoices = await this.invoiceRepository.find({ 
          where: {applicationId: applicationId },
          order: {whenUpdated: 'DESC'}
        });
        this.loggerService.log(`InvoiceService.getInvoices(): End.`);
        return plainToInstance(ViewInvoice, invoices);
      }
    } 
    catch (error) 
    {
      this.loggerService.error(
        `InvoiceService: getInvoices: Error fetching invoices: ${error.message}`,
        null,
      );
      throw new Error(
        `Failed to fetch invoices for application ID ${applicationId}: ${error.message}`,
      );
    }
  }

  async getInvoiceById(id: number) {
    try {
      this.loggerService.log(`InvoiceService.getInvoiceById(): invoiceId: ${id} start`);
      if(id <= 0)
      {
        this.loggerService.log(`Invalid invoiceId: ${id}`);
        return null;
      }
      else
      {
        this.loggerService.log(`Valid invoiceId: ${id}`);
        const invoice = await this.invoiceRepository.findOne({
          where: { id: id },
          relations: ['invoiceItems', 'invoiceAttachments', 'application', 'recipient'],
        });
        this.loggerService.log(`InvoiceService.getInvoiceById(): End.`);
        if(!invoice)
        {
          this.loggerService.log(`InvoiceService.getInvoiceById(): invoiceId: ${id} not found`);
          return null;
        }
        const result = {
          ...invoice,
          personId: invoice?.recipient?.id.toString(),
          recipient: {
            key: invoice?.recipient?.id.toString(),
            value: `${invoice?.recipient?.firstName || ''} ${invoice?.recipient?.middleName || ''} ${invoice?.recipient?.lastName || ''}`.trim(),
          },
        }
        return plainToInstance(ViewInvoice, result);
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
  }

  async createInvoice(invoice: CreateInvoice, user: any){
    try {
      this.loggerService.log(`InvoiceService.createInvoice(): start`);

      if (!invoice.invoiceItems?.length) {
        this.loggerService.error(`InvoiceService: createInvoice: At least one invoice item is required.`, `${invoice?.invoiceItems?.length || 0}`);
        throw new Error("At least one invoice item is required.");
      }

      const invoiceEntity = this.invoiceRepository.create({
        ...invoice,
        personId: Number(invoice.personId),
        whoCreated: user?.givenName || 'SYSTEM',
        whoUpdated: user?.givenName || 'SYSTEM',
        invoiceItems: invoice.invoiceItems.map(item => this.invoiceItemRepo.create({
          ...item,
          whoCreated: user?.givenName || 'SYSTEM',
          whoUpdated: user?.givenName || 'SYSTEM',
        })),
        invoiceAttachments: (invoice.invoiceAttachments ?? []).map(att => this.invoiceAttachmentRepo.create({
          ...att,
          whoCreated: user?.givenName || 'SYSTEM',
          whoUpdated: user?.givenName || 'SYSTEM',
        })),
      });

      const createdInvoice = await this.invoiceRepository.save(invoiceEntity);

      const result = plainToInstance(ViewInvoice, {
        ...createdInvoice, 
        personId: createdInvoice.personId.toString(),
        recipient: {
          key: createdInvoice.personId.toString(),
          value: `${createdInvoice?.recipient?.firstName || ''} ${createdInvoice?.recipient?.middleName || ''} ${createdInvoice?.recipient?.lastName || ''}`.trim(),
        }
      });
      if(result){
        this.loggerService.log(`InvoiceService.createInvoice(): End`);
        return result;
      }
      else{
        this.loggerService.log(`InvoiceService.createInvoice(): End with no result`);
        return null;
      }
    }
    catch (error) {
      this.loggerService.error(`InvoiceService: createInvoice: Error creating invoice: ${error.message}`, null);
      throw new Error(`Failed to create invoice: ${error.message}`);
    }
  }

  async updateInvoice(invoice: UpdateInvoice, user: any): Promise<ViewInvoice> {
    try{
      if (!invoice.id) {
        throw new Error('Invoice ID is required');
      }

      if (!invoice.invoiceItems?.length) {
        throw new Error('At least one invoice item is required');
      }

      this.loggerService.log(`InvoiceService.updateInvoice(): Start`);

      const existingInvoice = await this.invoiceRepository.findOne({
        where: { id: invoice.id },
        relations: ['invoiceItems', 'invoiceAttachments', 'recipient'],
      });

      if (!existingInvoice) {
        throw new Error(`Invoice not found (ID ${invoice.id})`);
      }

      // Build lookup maps
      const existingItems = existingInvoice.invoiceItems;
      const existingItemsMap = new Map(existingItems.map(i => [i.id, i]));
      const existingAttachments = existingInvoice.invoiceAttachments;
      const existingAttachmentsMap = new Map(existingAttachments.map(a => [a.id, a]));

      const toUpdateItems = [];
      const toAddItems = [];
      for (const dtoItem of invoice.invoiceItems || []) {
        if (dtoItem.id && existingItemsMap.has(dtoItem.id)) 
        {
          toUpdateItems.push({
            ...existingItemsMap.get(dtoItem.id),
            ...dtoItem,
            whoUpdated: user?.givenName || 'SYSTEM',
          });
        } 
        else 
        {
          const { id, ...rest } = dtoItem;
          toAddItems.push({
            ...rest,
            invoiceId: existingInvoice.id,
            whoCreated: user?.givenName || 'SYSTEM',
            whoUpdated: user?.givenName || 'SYSTEM',
          });
        }
      }
      const toDeleteItems = existingItems.filter(i => !invoice.invoiceItems?.find(it => it.id === i.id));

      const toUpdateAttachments= [];
      const toAddAttachments = [];
      for (const dtoAtt of invoice.invoiceAttachments || []) {
        if (dtoAtt.id && existingAttachmentsMap.has(dtoAtt.id)) {
          toUpdateAttachments.push({
            ...existingAttachmentsMap.get(dtoAtt.id),
            ...dtoAtt,
            whoUpdated: user?.givenName || 'SYSTEM',
          });
        } else {
          toAddAttachments.push({
            ...dtoAtt,
            invoice: existingInvoice,
            whoCreated: user?.givenName || 'SYSTEM',
            whoUpdated: user?.givenName || 'SYSTEM',
          });
        }
      }
      const toDeleteAttachments = existingAttachments.filter(a => !invoice.invoiceAttachments?.find(at => at.id === a.id));

      await this.invoiceRepository.manager.transaction(async manager => {
        const itemRepo = manager.getRepository(InvoiceItem);
        const attRepo = manager.getRepository(InvoiceAttachment);
        const invRepo = manager.getRepository(InvoiceV2);

        if (toDeleteItems.length) await itemRepo.remove(toDeleteItems);
        if (toDeleteAttachments.length) await attRepo.remove(toDeleteAttachments);

        if (toUpdateItems.length) await itemRepo.save(itemRepo.create(toUpdateItems));
        if (toAddItems.length) await itemRepo.save(itemRepo.create(toAddItems));

        if (toUpdateAttachments.length) await attRepo.save(attRepo.create(toUpdateAttachments));
        if (toAddAttachments.length) await attRepo.save(attRepo.create(toAddAttachments));

        // const { invoiceItems, invoiceAttachments, ...rest } = invoice;
        const updatedInvoice = invRepo.create({
          ...existingInvoice,
          ...invoice,
          personId: Number(invoice.personId),
          whoUpdated: user?.givenName || 'SYSTEM',
        });

        delete (updatedInvoice as InvoiceV2).invoiceItems;
        delete (updatedInvoice as InvoiceV2).invoiceAttachments;
        await invRepo.save(updatedInvoice);
      });

      const fresh = await this.invoiceRepository.findOne({
        where: { id: invoice.id },
        relations: ['invoiceItems', 'invoiceAttachments', 'recipient'],
      });

      if (!fresh) throw new Error('Unexpected missing invoice after update.');

      const view = plainToInstance(ViewInvoice, {
        ...fresh,
        recipient: {
          ...fresh.recipient,
          key: fresh.recipient.id.toString(),
          value: [fresh.recipient.firstName, fresh.recipient.middleName, fresh.recipient.lastName]
            .filter(Boolean)
            .join(' '),
        },
      });

      this.loggerService.log(`InvoiceService.updateInvoice(): End`);
      return view;
    }
    catch (error) {
      this.loggerService.error(
        `InvoiceService: updateInvoice: Error updating invoice: ${error.message}`,
        null,
      );
      throw new Error(
        `Failed to update invoice with ID ${invoice.id}: ${error.message}`,
      );
    }
  
  }


  async deleteInvoice(id: number){
    try {
      this.loggerService.log(`InvoiceService.deleteInvoice(): invoiceId: ${id} start`);
      const result = await this.invoiceRepository.delete(id);
      if(!result.affected){
        this.loggerService.log(`InvoiceService.deleteInvoice(): invoiceId: ${id} not found`);
        this.loggerService.log(`InvoiceService.deleteInvoice(): End`);
        return result.affected;
      }
      else
      {
        this.loggerService.log(`InvoiceService.deleteInvoice(): invoiceId: ${id} deleted successfully`);
        this.loggerService.log(`InvoiceService.deleteInvoice(): End`);
        return result.affected;
      }
    }
    catch (error) {
      this.loggerService.error(`InvoiceService: deleteInvoice: Error deleting invoice: ${error.message}`, null);
      throw new Error(`Failed to delete invoice: ${error.message}`);
    }
  }

}
