import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response.dto';
import { ViewInvoice } from '../../invoice/viewInvoice.dto';

@ObjectType()
export class InvoiceResponse extends ResponseDto {
  @Field(() => ViewInvoice, { nullable: true })
  data: ViewInvoice | null;
}

@ObjectType()
export class InvoicesResponse extends ResponseDto {
  @Field(() => [ViewInvoice], { nullable: true })
  data: ViewInvoice[] | null;
}
