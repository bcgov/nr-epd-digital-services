import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseInvoiceAttachment } from './baseInvoiceAttachment.dto';

@ObjectType()
export class ViewInvoiceAttachment extends BaseInvoiceAttachment {
  @Field(() => Int)
  id: number;
}
