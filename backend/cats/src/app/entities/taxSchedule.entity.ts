import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pk_tax_schedule', ['id'], { unique: true })
@Entity('tax_schedule')
export class TaxSchedule {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'tax_name', length: 20 })
  taxName: string;

  @Column('numeric', { name: 'tax_rate', precision: 5, scale: 4 })
  taxRate: string;

  @Column('date', { name: 'effective_start_date' })
  effectiveStartDate: string;

  @Column('date', { name: 'effective_end_date', nullable: true })
  effectiveEndDate: string | null;

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
}
