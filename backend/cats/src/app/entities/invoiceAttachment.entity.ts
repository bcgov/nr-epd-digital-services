import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoiceV2 } from './invoiceV2.entity';

@Entity('invoice_attachment')
export class InvoiceAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'invoice_id' })
  invoiceId: number;

  @Column({ name: 'file_name', length: 255 })
  fileName: string;

  @Column({ name: 'file_size' })
  fileSize: number;

  @Column({ name: 'mime_type', length: 100 })
  mimeType: string;

  @Column({ name: 'object_storage_id', length: 255 })
  objectStorageId: string;

  @Column({ name: 'created_by', length: 100 })
  createdBy: string;

  @Column({ name: 'updated_by', length: 100, nullable: true })
  updatedBy?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => InvoiceV2, (invoice) => invoice.attachments)
  @JoinColumn({ name: 'invoice_id' })
  invoice: InvoiceV2;
}
