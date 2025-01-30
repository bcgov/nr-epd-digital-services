import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { LandUse } from './landUse.entity';
import { ObjectType } from '@nestjs/graphql';
@ObjectType()
@Index('idx_app_land_use_application_id', ['applicationId'], {})
@Index('pk_app_land_use', ['id'], { unique: true })
@Index('idx_app_land_use_land_use_id', ['landUseId'], {})
@Entity('app_land_use')
export class AppLandUse {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'application_id' })
  applicationId: number;

  @Column('integer', { name: 'land_use_id' })
  landUseId: number;

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

  @ManyToOne(() => Application, (application) => application.appLandUses)
  @JoinColumn([{ name: 'application_id', referencedColumnName: 'id' }])
  application: Application;

  @ManyToOne(() => LandUse, (landUse) => landUse.appLandUses)
  @JoinColumn([{ name: 'land_use_id', referencedColumnName: 'id' }])
  landUse: LandUse;
}
