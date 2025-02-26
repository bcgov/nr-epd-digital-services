import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { VapourUse } from './vapourUse.entity';

@Index('idx_app_vapour_use_application_id', ['applicationId'], {})
@Index('pk_app_vapour_use', ['id'], { unique: true })
@Index('idx_app_vapour_use_vapour_use_id', ['vapourUseId'], {})
@Entity('app_vapour_use')
export class AppVapourUse {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'application_id' })
  applicationId: number;

  @Column('integer', { name: 'vapour_use_id' })
  vapourUseId: number;

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

  @ManyToOne(() => Application, (application) => application.appVapourUses)
  @JoinColumn([{ name: 'application_id', referencedColumnName: 'id' }])
  application: Application;

  @ManyToOne(() => VapourUse, (vapourUse) => vapourUse.appVapourUses)
  @JoinColumn([{ name: 'vapour_use_id', referencedColumnName: 'id' }])
  vapourUse: VapourUse;
}
