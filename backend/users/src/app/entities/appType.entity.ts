import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppTypeDefaultService } from './appTypeDefaultService.entity';
import { Application } from './application.entity';

@Index('pk_app_type', ['id'], { unique: true })
@Entity('app_type', { schema: 'cats' })
export class AppType {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'abbrev', nullable: true, length: 20 })
  abbrev: string | null;

  @Column('character varying', { name: 'description', length: 250 })
  description: string;

  @Column('integer', { name: 'fore_colour' })
  foreColour: number;

  @Column('integer', { name: 'back_colour' })
  backColour: number;

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

  @OneToMany(
    () => AppTypeDefaultService,
    (appTypeDefaultService) => appTypeDefaultService.appType,
  )
  appTypeDefaultServices: AppTypeDefaultService[];

  @OneToMany(() => Application, (application) => application.appType)
  applications: Application[];
}
