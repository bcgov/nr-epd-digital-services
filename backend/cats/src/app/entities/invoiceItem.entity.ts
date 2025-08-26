import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoiceV2 } from './invoiceV2.entity';
import { InvoiceItemType } from '../utilities/enums/invoice/invoiceItemType.enum';

@Index('invoice_item_pkey', ['id'], { unique: true })
@Index('idx_invoice_item_invoice_id', ['invoiceId'])
@Index('idx_invoice_item_type', ['itemType'])
@Index('idx_invoice_item_when_created', ['whenCreated'])
@Entity('invoice_item')
export class InvoiceItem {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column({ name: 'invoice_id' })
  invoiceId: number;

  @Column({ type: 'enum', enum: InvoiceItemType, name: 'item_type' })
  itemType: InvoiceItemType;

  @Column({ name: 'description', length: 255 })
  description: string;

  @Column('int', { name: 'quantity' })
  quantity: number;

  @Column('int', { name: 'unit_price_in_cents' })
  unitPriceInCents: number;

  @Column('int', { name: 'total_in_cents' })
  totalInCents: number;

  @Column('character varying', { name: 'who_created', length: 30 })
  whoCreated: string;

  @Column('character varying', {
    name: 'who_updated',
    nullable: true,
    length: 30,
  })
  whoUpdated: string | null;

  @CreateDateColumn({
    name: 'when_created',
    type: 'timestamp without time zone',
  })
  whenCreated: Date;

  @UpdateDateColumn({
    name: 'when_updated',
    type: 'timestamp without time zone',
    nullable: true,
  })
  whenUpdated: Date | null;

  @ManyToOne(() => InvoiceV2, (invoice) => invoice.invoiceItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'invoice_id', referencedColumnName: 'id' }])
  invoice: InvoiceV2;
}
