import { Field, InputType, Int } from '@nestjs/graphql';
import { BaseInvoice } from './baseInvoice.dto';
import { CreateInvoiceItem } from './invoiceItem/createInvoiceItem.dto';
import { CreateInvoiceAttachment } from './invoiceAttachments/createInvoiceAttachment.dto';

@InputType()
export class CreateInvoice extends BaseInvoice {
  @Field(() => Int)
  applicationId: number;

  @Field(() => [CreateInvoiceItem])
  invoiceItems: CreateInvoiceItem[];

  @Field(() => [CreateInvoiceAttachment], { nullable: true })
  invoiceAttachments?: CreateInvoiceAttachment[];
}
