import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pk_application_fee_schedule', ['id'], { unique: true })
@Entity('application_fee_schedule')
export class ApplicationFeeSchedule {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('numeric', { name: 'hourly_fee', precision: 10, scale: 2 })
  hourlyFee: string;

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
