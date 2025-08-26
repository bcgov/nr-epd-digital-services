import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { InvoiceV2 } from './invoiceV2.entity';

@Index('idx_invoice_attachment_invoice_id', ['invoiceId'])
@Index('idx_invoice_attachment_when_created', ['whenCreated'])
@Entity('invoice_attachment')
export class InvoiceAttachment {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column({ name: 'invoice_id' })
  invoiceId: number;

  @Column({ name: 'file_name', length: 255 })
  fileName: string;

  @Column('uuid', { name: 'bucket_id' })
  bucketId: string;

  @Column('uuid', { name: 'object_id' })
  objectId: string;

  @Column('character varying', { name: 'who_created', length: 30 })
  whoCreated: string;

  @Column('character varying', {
    name: 'who_updated',
    nullable: true,
    length: 30,
  })
  whoUpdated: string | null;

  @CreateDateColumn({ name: 'when_created', type: 'timestamp without time zone' })
  whenCreated: Date;

  @UpdateDateColumn({ name: 'when_updated', type: 'timestamp without time zone', nullable: true })
  whenUpdated: Date | null;

  @ManyToOne(() => InvoiceV2, (invoice) => invoice.invoiceAttachments, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'invoice_id', referencedColumnName: 'id' }])
  invoice: InvoiceV2;
}
