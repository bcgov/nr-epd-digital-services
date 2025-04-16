import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../../response/response.dto';
import { InvoiceByApplicationIdDto } from '../../invoice/invoice.dto';

@ObjectType()
export class InvoicesByApplicationIdResponse extends ResponseDto {
  @Field(() => [InvoiceByApplicationIdDto], { nullable: true })
  invoices?: InvoiceByApplicationIdDto[];
}
