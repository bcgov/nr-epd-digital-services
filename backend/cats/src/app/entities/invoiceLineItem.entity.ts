import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InvoiceV2 } from './invoiceV2.entity';

@Entity('invoice_line_item')
export class InvoiceLineItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => InvoiceV2, (invoice) => invoice.lineItems)
  invoice: InvoiceV2;

  @Column({ type: 'enum', enum: ['service', 'expense', 'timesheet'] })
  type: string;

  @Column()
  description: string;

  @Column('int')
  quantity: number;

  @Column('int')
  unit_price_in_cents: number;

  @Column('int')
  total_in_cents: number;
}
