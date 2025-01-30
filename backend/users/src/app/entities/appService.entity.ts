import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { Service } from './service.entity';

@Index('idx_app_service_application_id', ['applicationId'], {})
@Index('pk_app_service', ['id'], { unique: true })
@Index('idx_app_service_service_id', ['serviceId'], {})
@Entity('app_service', { schema: 'cats' })
export class AppService {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'application_id' })
  applicationId: number;

  @Column('integer', { name: 'service_id' })
  serviceId: number;

  @Column('boolean', { name: 'is_resubmission' })
  isResubmission: boolean;

  @Column('numeric', { name: 'default_credit_hours', precision: 8, scale: 2 })
  defaultCreditHours: string;

  @Column('numeric', { name: 'default_fee', precision: 10, scale: 2 })
  defaultFee: string;

  @Column('numeric', {
    name: 'override_credit_hours',
    nullable: true,
    precision: 8,
    scale: 2,
  })
  overrideCreditHours: string | null;

  @Column('numeric', {
    name: 'override_fee',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  overrideFee: string | null;

  @Column('numeric', { name: 'fee', precision: 10, scale: 2 })
  fee: string;

  @Column('numeric', { name: 'credit_hours', precision: 8, scale: 2 })
  creditHours: string;

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

  @ManyToOne(() => Application, (application) => application.appServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'application_id', referencedColumnName: 'id' }])
  application: Application;

  @ManyToOne(() => Service, (service) => service.appServices)
  @JoinColumn([{ name: 'service_id', referencedColumnName: 'id' }])
  service: Service;
}
