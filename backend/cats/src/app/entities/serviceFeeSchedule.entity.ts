import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Service } from './service.entity';

@Index('pk_service_fee_schedule', ['id'], { unique: true })
@Index('idx_service_fee_schedule_service_id', ['serviceId'], {})
@Entity('service_fee_schedule')
export class ServiceFeeSchedule {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'service_id' })
  serviceId: number;

  @Column('numeric', { name: 'fee', precision: 10, scale: 2 })
  fee: string;

  @Column('numeric', { name: 'credit_hours', precision: 8, scale: 2 })
  creditHours: string;

  @Column('numeric', { name: 'resubmission_fee', precision: 10, scale: 2 })
  resubmissionFee: string;

  @Column('numeric', {
    name: 'resubmission_credit_hours',
    precision: 8,
    scale: 2,
  })
  resubmissionCreditHours: string;

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

  @ManyToOne(() => Service, (service) => service.serviceFeeSchedules)
  @JoinColumn([{ name: 'service_id', referencedColumnName: 'id' }])
  service: Service;
}
