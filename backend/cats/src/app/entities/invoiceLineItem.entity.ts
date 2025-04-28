import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InvoiceV2 } from './invoiceV2.entity';
import { InvoiceLineItemType } from '../dto/invoice/invoiceLineItem.dto';

@Entity('invoice_line_item')
export class InvoiceLineItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => InvoiceV2, (invoice) => invoice.lineItems)
  invoice: InvoiceV2;

  @Column({ type: 'enum', enum: ['service', 'expense', 'timesheet'] })
  type: InvoiceLineItemType;

  @Column()
  description: string;

  @Column('int')
  quantity: number;

  @Column('int')
  unitPriceInCents: number;

  @Column('int')
  totalInCents: number;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
