import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class InvoiceByApplicationIdDto {
  @Field(() => Int)
  id: number;

  @Field()
  issuedDate: Date;

  @Field()
  dueDate: Date;

  @Field()
  status: string;

  @Field(() => Int)
  totalInCents: number;
}
