import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppService } from './appService.entity';
import { AppTypeDefaultService } from './appTypeDefaultService.entity';
import { ServiceFeeSchedule } from './serviceFeeSchedule.entity';
import { ServiceServiceCategory } from './serviceServiceCategory.entity';

@Index('pk_service', ['id'], { unique: true })
@Entity('service', { schema: 'cats' })
export class Service {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'abbrev', nullable: true, length: 100 })
  abbrev: string | null;

  @Column('character varying', { name: 'description', length: 250 })
  description: string;

  @Column('boolean', { name: 'is_risk_assessment' })
  isRiskAssessment: boolean;

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

  @OneToMany(() => AppService, (appService) => appService.service)
  appServices: AppService[];

  @OneToMany(
    () => AppTypeDefaultService,
    (appTypeDefaultService) => appTypeDefaultService.service,
  )
  appTypeDefaultServices: AppTypeDefaultService[];

  @OneToMany(
    () => ServiceFeeSchedule,
    (serviceFeeSchedule) => serviceFeeSchedule.service,
  )
  serviceFeeSchedules: ServiceFeeSchedule[];

  @OneToMany(
    () => ServiceServiceCategory,
    (serviceServiceCategory) => serviceServiceCategory.service,
  )
  serviceServiceCategories: ServiceServiceCategory[];
}
