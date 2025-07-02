import { ObjectType, Field } from '@nestjs/graphql';
import { BaseHttpResponse } from '../baseHttpResponse';

@ObjectType()
export class InvoicePdfResponse extends BaseHttpResponse {
  @Field(() => String, {
    nullable: true,
    description: 'Base64 encoded PDF content',
  })
  pdfContent?: string;

  @Field(() => String, { nullable: false })
  filename: string;
}
