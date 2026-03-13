import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { ApplicationServiceType } from './applicationServiceType.entity';

@Index('pk_application_secondary_service_type', ['id'], { unique: true })
@Index('idx_app_secondary_service_type_app_id', ['applicationId'], {})
@Index('uq_app_secondary_service_type', ['applicationId', 'serviceTypeId'], {
  unique: true,
})
@Entity('application_secondary_service_type')
export class ApplicationSecondaryServiceType {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'application_id' })
  applicationId: number;

  @Column('integer', { name: 'service_type_id' })
  serviceTypeId: number;

  @Column('character varying', { name: 'created_by', length: 20 })
  createdBy: string;

  @Column('timestamp without time zone', { name: 'created_date_time' })
  createdDateTime: Date;

  @ManyToOne(
    () => Application,
    (application) => application.secondaryServiceTypes,
  )
  @JoinColumn([{ name: 'application_id', referencedColumnName: 'id' }])
  application: Application;

  @ManyToOne(() => ApplicationServiceType)
  @JoinColumn([{ name: 'service_type_id', referencedColumnName: 'id' }])
  serviceType: ApplicationServiceType;
}
