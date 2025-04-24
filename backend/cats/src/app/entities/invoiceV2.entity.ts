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
  status: string;

  @Column({ default: false })
  taxExempt: boolean;

  @Column('int')
  subtotalInCents: number;

  @Column('int')
  gstInCents: number;

  @Column('int')
  pstInCents: number;

  @Column('int')
  totalInCents: number;

  @OneToMany(() => InvoiceLineItem, (lineItem) => lineItem.invoice, {
    cascade: true,
  })
  lineItems: InvoiceLineItem[];
}
