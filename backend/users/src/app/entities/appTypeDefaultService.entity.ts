import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppType } from './appType.entity';
import { Service } from './service.entity';

@Index('idx_app_type_default_service_app_type_id', ['appTypeId'], {})
@Index('pk_app_type_default_service', ['id'], { unique: true })
@Index('idx_app_type_default_service_service_id', ['serviceId'], {})
@Entity('app_type_default_service')
export class AppTypeDefaultService {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'app_type_id' })
  appTypeId: number;

  @Column('integer', { name: 'service_id' })
  serviceId: number;

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

  @ManyToOne(() => AppType, (appType) => appType.appTypeDefaultServices)
  @JoinColumn([{ name: 'app_type_id', referencedColumnName: 'id' }])
  appType: AppType;

  @ManyToOne(() => Service, (service) => service.appTypeDefaultServices)
  @JoinColumn([{ name: 'service_id', referencedColumnName: 'id' }])
  service: Service;
}
