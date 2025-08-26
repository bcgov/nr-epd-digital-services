import { registerEnumType } from '@nestjs/graphql';

export enum InvoiceItemType {
  SERVICE = 'service',
  EXPENSE = 'expense',
  TIMESHEET = 'timesheet',
}

registerEnumType(InvoiceItemType, {
  name: 'InvoiceItemType',
  description: 'The type of an invoice line item',
});
