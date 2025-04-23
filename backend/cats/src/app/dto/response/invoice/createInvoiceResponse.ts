import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response.dto';
import { InvoiceDto } from '../../invoice/invoice.dto';

@ObjectType()
export class CreateInvoiceResponse extends ResponseDto {
  @Field(() => [InvoiceDto], { nullable: true })
  invoice?: InvoiceDto;
}
