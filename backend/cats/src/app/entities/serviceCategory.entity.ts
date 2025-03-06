import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceCategoryType } from './serviceCategoryType.entity';
import { ServiceServiceCategory } from './serviceServiceCategory.entity';

@Index('pk_service_category', ['id'], { unique: true })
@Index(
  'idx_service_category_service_category_type_id',
  ['serviceCategoryTypeId'],
  {},
)
@Entity('service_category')
export class ServiceCategory {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'service_category_type_id' })
  serviceCategoryTypeId: number;

  @Column('character varying', { name: 'abbrev', nullable: true, length: 20 })
  abbrev: string | null;

  @Column('character varying', { name: 'description', length: 250 })
  description: string;

  @Column('boolean', { name: 'is_active' })
  isActive: boolean;

  @Column('integer', { name: 'display_order' })
  displayOrder: number;

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
    () => ServiceCategoryType,
    (serviceCategoryType) => serviceCategoryType.serviceCategories,
  )
  @JoinColumn([
    { name: 'service_category_type_id', referencedColumnName: 'id' },
  ])
  serviceCategoryType: ServiceCategoryType;

  @OneToMany(
    () => ServiceServiceCategory,
    (serviceServiceCategory) => serviceServiceCategory.serviceCategory,
  )
  serviceServiceCategories: ServiceServiceCategory[];
}
