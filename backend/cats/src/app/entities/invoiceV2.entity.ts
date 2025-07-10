import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Application } from './application.entity';
import { Person } from './person.entity';
import { InvoiceLineItem } from './invoiceLineItem.entity';
import { InvoiceAttachment } from './invoiceAttachment.entity';
import { InvoiceStatus } from '../dto/invoice/invoice.dto';

@Entity('invoice_v2')
export class InvoiceV2 {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Application, (application) => application.invoices)
  application: Application;

  @ManyToOne(() => Person, (person) => person.invoices)
  recipient: Person;

  // This is used to link to the old invoice table.
  @Column({ nullable: true })
  invoiceId: number;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column()
  issuedDate: Date;

  @Column()
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: ['draft', 'sent', 'received', 'paid'],
    default: 'draft',
  })
  status: InvoiceStatus;

  @Column({ default: false })
  taxExempt: boolean;

  @Column({ default: false })
  pstExempt: boolean;

  @Column('int')
  subtotalInCents: number;

  @Column('int')
  gstInCents: number;

  @Column('int')
  pstInCents: number;

  @Column('int')
  totalInCents: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

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

  @OneToMany(() => InvoiceLineItem, (lineItem) => lineItem.invoice, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  lineItems: InvoiceLineItem[];

  @OneToMany(() => InvoiceAttachment, (attachment) => attachment.invoice, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  attachments: InvoiceAttachment[];
}
