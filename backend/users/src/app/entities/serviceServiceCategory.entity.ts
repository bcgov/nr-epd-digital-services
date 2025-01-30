import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceCategory } from './serviceCategory.entity';
import { Service } from './service.entity';

@Index('pk_service_service_category', ['id'], { unique: true })
@Index(
  'idx_service_service_category_service_category_id',
  ['serviceCategoryId'],
  {},
)
@Index('idx_service_service_category_service_id', ['serviceId'], {})
@Entity('service_service_category', { schema: 'cats' })
export class ServiceServiceCategory {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'service_id' })
  serviceId: number;

  @Column('integer', { name: 'service_category_id' })
  serviceCategoryId: number;

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

  @ManyToOne(
    () => ServiceCategory,
    (serviceCategory) => serviceCategory.serviceServiceCategories,
  )
  @JoinColumn([{ name: 'service_category_id', referencedColumnName: 'id' }])
  serviceCategory: ServiceCategory;

  @ManyToOne(() => Service, (service) => service.serviceServiceCategories)
  @JoinColumn([{ name: 'service_id', referencedColumnName: 'id' }])
  service: Service;
}
