import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';
import { PaymentMethod } from './paymentMethod.entity';

@Index('pk_payment', ['id'], { unique: true })
@Index('idx_payment_invoice_id', ['invoiceId'], {})
@Index('idx_payment_payment_method_id', ['paymentMethodId'], {})
@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'invoice_id' })
  invoiceId: number;

  @Column('integer', { name: 'payment_method_id' })
  paymentMethodId: number;

  @Column('date', { name: 'payment_date' })
  paymentDate: string;

  @Column('numeric', { name: 'payment_amt', precision: 10, scale: 2 })
  paymentAmt: string;

  @Column('character varying', {
    name: 'cheque_number',
    nullable: true,
    length: 20,
  })
  chequeNumber: string | null;

  @Column('numeric', {
    name: 'cheque_amt',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  chequeAmt: string | null;

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

  @ManyToOne(() => Invoice, (invoice) => invoice.payments)
  @JoinColumn([{ name: 'invoice_id', referencedColumnName: 'id' }])
  invoice: Invoice;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.payments)
  @JoinColumn([{ name: 'payment_method_id', referencedColumnName: 'id' }])
  paymentMethod: PaymentMethod;
}
