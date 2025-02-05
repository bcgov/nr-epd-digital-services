import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { Payment } from './payment.entity';

@Index('idx_invoice_application_id', ['applicationId'], {})
@Index(
  'uidx_invoice_application_id_invoice_num',
  ['applicationId', 'invoiceNum'],
  { unique: true },
)
@Index('pk_invoice', ['id'], { unique: true })
@Entity('invoice')
export class Invoice {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'application_id' })
  applicationId: number;

  @Column('smallint', { name: 'invoice_num' })
  invoiceNum: number;

  @Column('date', { name: 'sent_to_revenue_date', nullable: true })
  sentToRevenueDate: string | null;

  @Column('numeric', { name: 'invoice_subtotal_amt', precision: 10, scale: 2 })
  invoiceSubtotalAmt: string;

  @Column('numeric', { name: 'invoice_tax_amt', precision: 10, scale: 2 })
  invoiceTaxAmt: string;

  @Column('numeric', {
    name: 'invoice_total_amt',
    nullable: true,
    precision: 11,
    scale: 2,
  })
  invoiceTotalAmt: string | null;

  @Column('character varying', {
    name: 'comment',
    nullable: true,
    length: 4000,
  })
  comment: string | null;

  @Column('integer', { name: 'row_version_count' })
  rowVersionCount: number;

  @Column('character varying', { name: 'created_by', length: 20 })
  createdBy: string;

  @Column('timestamp without time zone', { name: 'created_date_time' })
  createdDateTime: Date;

  @Column('character varying', { name: 'updated_by', length: 20 })
  updatedBy: string;

  @Column('timestamp without time zone', { name: 'updated_date_time' })
  updatedDateTime: Date;

  @Column('bytea', { name: 'ts' })
  ts: Buffer;

  @ManyToOne(() => Application, (application) => application.invoices)
  @JoinColumn([{ name: 'application_id', referencedColumnName: 'id' }])
  application: Application;

  @OneToMany(() => Payment, (payment) => payment.invoice)
  payments: Payment[];
}
