import { Field, InputType, Int } from '@nestjs/graphql';
import { BaseInvoiceAttachment } from './baseInvoiceAttachment.dto';

@InputType()
export class UpdateInvoiceAttachment extends BaseInvoiceAttachment {
  @Field(() => Int, { nullable: true })
  id?: number;
}
