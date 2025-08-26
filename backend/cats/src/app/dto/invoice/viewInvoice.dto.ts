import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseInvoice } from './baseInvoice.dto';
import { ViewInvoiceItem } from './invoiceItem/viewInvoiceItem.dto';
import { ViewInvoiceAttachment } from './invoiceAttachments/viewInvoiceAttachment.dto';
import { DropdownDto } from '../dropdown.dto';

@ObjectType()
export class ViewInvoice extends BaseInvoice {
  @Field(() => Int)
  applicationId: number;

  @Field(() => Int)
  id: number;

  @Field(() => String)
  whoUpdated: string;

  @Field(() => DropdownDto)
  recipient: DropdownDto;

  @Field(() => [ViewInvoiceItem])
  invoiceItems?: ViewInvoiceItem[];

  @Field(() => [ViewInvoiceAttachment])
  invoiceAttachments?: ViewInvoiceAttachment[];
}
