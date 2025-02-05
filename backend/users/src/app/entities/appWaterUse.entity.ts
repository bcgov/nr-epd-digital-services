import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { WaterUse } from './waterUse.entity';

@Index('idx_app_water_use_application_id', ['applicationId'], {})
@Index('pk_app_water_use', ['id'], { unique: true })
@Index('idx_app_water_use_water_use_id', ['waterUseId'], {})
@Entity('app_water_use', { schema: 'cats' })
export class AppWaterUse {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'application_id' })
  applicationId: number;

  @Column('integer', { name: 'water_use_id' })
  waterUseId: number;

  @Column('boolean', { name: 'is_current' })
  isCurrent: boolean;

  @Column('character varying', {
    name: 'comment',
    nullable: true,
    length: 4000,
  })
  comment: string | null;

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

  @ManyToOne(() => Application, (application) => application.appWaterUses)
  @JoinColumn([{ name: 'application_id', referencedColumnName: 'id' }])
  application: Application;

  @ManyToOne(() => WaterUse, (waterUse) => waterUse.appWaterUses)
  @JoinColumn([{ name: 'water_use_id', referencedColumnName: 'id' }])
  waterUse: WaterUse;
}
