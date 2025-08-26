import { Field, InputType, Int } from '@nestjs/graphql';
import { BaseInvoice } from './baseInvoice.dto';
import { UpdateInvoiceItem } from './invoiceItem/updateInvoiceItem.dto';
import { UpdateInvoiceAttachment } from './invoiceAttachments/updateInvoiceAttachment.dto';

@InputType()
export class UpdateInvoice extends BaseInvoice {
  @Field(() => Int)
  applicationId: number;

  @Field(() => Int)
  id: number;

  @Field(() => [UpdateInvoiceItem])
  invoiceItems: UpdateInvoiceItem[];

  @Field(() => [UpdateInvoiceAttachment], { nullable: true })
  invoiceAttachments?: UpdateInvoiceAttachment[];
}
