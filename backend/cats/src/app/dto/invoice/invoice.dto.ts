import {
  ObjectType,
  Field,
  Int,
  registerEnumType,
  InputType,
} from '@nestjs/graphql';
import {
  InvoiceLineItemInputDto,
  InvoiceLineItemDto,
} from './invoiceLineItem.dto';

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  RECEIVED = 'received',
  PAID = 'paid',
}

registerEnumType(InvoiceStatus, {
  name: 'InvoiceStatus',
  description: 'The status of an invoice',
});

@ObjectType()
export class InvoiceDto {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  applicationId: number;

  @Field(() => Int)
  recipientId: number;

  @Field(() => Int, { nullable: true })
  invoiceId?: number;

  @Field(() => String)
  subject: string;

  @Field(() => Date)
  issuedDate: Date;

  @Field(() => Date)
  dueDate: Date;

  @Field(() => InvoiceStatus)
  status: InvoiceStatus;

  @Field(() => Boolean)
  taxExempt: boolean;

  @Field(() => Int)
  subtotalInCents: number;

  @Field(() => Int)
  gstInCents: number;

  @Field(() => Int)
  pstInCents: number;

  @Field(() => Int)
  totalInCents: number;

  @Field(() => String, { nullable: true })
  createdBy: string;

  @Field(() => String)
  updatedBy: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => [InvoiceLineItemDto])
  lineItems: InvoiceLineItemDto[];
}

@InputType()
export class InvoiceInputDto {
  @Field(() => Int)
  applicationId: number;

  @Field(() => Int)
  recipientId: number;

  @Field(() => Int, { nullable: true })
  invoiceId: number;

  @Field(() => String)
  subject: string;

  @Field(() => Date)
  issuedDate: Date;

  @Field(() => Date)
  dueDate: Date;

  @Field(() => InvoiceStatus)
  status: InvoiceStatus;

  @Field(() => Boolean)
  taxExempt: boolean;

  @Field(() => Int)
  subtotalInCents: number;

  @Field(() => Int)
  gstInCents: number;

  @Field(() => Int)
  pstInCents: number;

  @Field(() => Int)
  totalInCents: number;

  @Field(() => [InvoiceLineItemInputDto])
  lineItems: InvoiceLineItemInputDto[];
}

@ObjectType()
export class InvoiceByApplicationIdDto {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  subject: string;

  @Field()
  issuedDate: Date;

  @Field()
  dueDate: Date;

  @Field()
  status: string;

  @Field(() => Int)
  totalInCents: number;
}
