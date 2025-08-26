import { registerEnumType } from '@nestjs/graphql';

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
