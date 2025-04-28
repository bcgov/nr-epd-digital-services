import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum InvoiceLineItemType {
  SERVICE = 'service',
  EXPENSE = 'expense',
  TIMESHEET = 'timesheet',
}

registerEnumType(InvoiceLineItemType, {
  name: 'InvoiceLineItemType',
  description: 'The type of an invoice line item',
});

@ObjectType()
export class InvoiceLineItemDto {
  @Field(() => Int)
  id: number;

  @Field()
  type: InvoiceLineItemType;

  @Field()
  description: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Int)
  unitPriceInCents: number;

  @Field(() => Int)
  totalInCents: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  createdBy: string;

  @Field(() => String)
  updatedBy: string;
}

@InputType()
export class InvoiceLineItemCreateDto {
  @Field()
  type: InvoiceLineItemType;

  @Field()
  description: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Int)
  unitPriceInCents: number;

  @Field(() => Int)
  totalInCents: number;
}
