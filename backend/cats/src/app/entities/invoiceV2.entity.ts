import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { Person } from './person.entity';
import { InvoiceAttachment } from './invoiceAttachment.entity';
import { InvoiceItem } from './invoiceItem.entity';
import { InvoiceStatus } from '../utilities/enums/invoice/invoiceStatus.enum';

@Index('idx_invoice_v2_application_id', ['applicationId'])
@Index('idx_invoice_v2_person_id', ['personId'])
@Index('idx_invoice_v2_when_created', ['whenCreated'])
@Entity('invoice_v2')
export class InvoiceV2 {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'application_id' })
  applicationId: number;

  @Column('integer', { name: 'person_id' })
  personId: number;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column('timestamp without time zone', { name: 'issued_date' })
  issuedDate: Date;

  @Column('timestamp without time zone', { name: 'due_date' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
    name: 'invoice_status',
  })
  invoiceStatus: InvoiceStatus;

  @Column({ default: false, name: 'tax_exempt' })
  taxExempt: boolean;

  @Column({ default: false, name: 'pst_exempt' })
  pstExempt: boolean;

  @Column('int', { name: 'subtotal_in_cents' })
  subtotalInCents: number;

  @Column('int', { name: 'gst_in_cents' })
  gstInCents: number;

  @Column('int', { name: 'pst_in_cents' })
  pstInCents: number;

  @Column('int', { name: 'total_in_cents' })
  totalInCents: number;

  @Column({ type: 'text', nullable: true, name: 'invoice_notes' })
  invoiceNotes: string;

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

  @ManyToOne(() => Application, (application) => application.invoices)
  @JoinColumn([{ name: 'application_id', referencedColumnName: 'id' }])
  application: Application;

  @ManyToOne(() => Person, (person) => person.invoices)
  @JoinColumn([{ name: 'person_id', referencedColumnName: 'id' }])
  recipient: Person;

  @OneToMany(() => InvoiceItem, (lineItem) => lineItem.invoice, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  invoiceItems: InvoiceItem[];

  @OneToMany(() => InvoiceAttachment, (attachment) => attachment.invoice, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  invoiceAttachments: InvoiceAttachment[];
}
