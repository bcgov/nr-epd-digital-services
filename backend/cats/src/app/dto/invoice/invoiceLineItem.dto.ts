import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InvoiceLineItemDto {
  @Field(() => Int)
  id: number;

  @Field()
  type: string;

  @Field()
  description: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Int)
  unitPriceInCents: number;

  @Field(() => Int)
  totalInCents: number;
}
