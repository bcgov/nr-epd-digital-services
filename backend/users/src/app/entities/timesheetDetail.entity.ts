import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Timesheet } from './timesheet.entity';

@Index(
  'uidx_timesheet_detail_timesheet_id_date_offset',
  ['dateOffset', 'timesheetId'],
  { unique: true },
)
@Index('pk_timesheet_detail', ['id'], { unique: true })
@Index('idx_timesheet_detail_timesheet_id', ['timesheetId'], {})
@Entity('timesheet_detail', { schema: 'cats' })
export class TimesheetDetail {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'timesheet_id' })
  timesheetId: number;

  @Column('smallint', { name: 'date_offset' })
  dateOffset: number;

  @Column('numeric', { name: 'hours', nullable: true, precision: 5, scale: 2 })
  hours: string | null;

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

  @ManyToOne(() => Timesheet, (timesheet) => timesheet.timesheetDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'timesheet_id', referencedColumnName: 'id' }])
  timesheet: Timesheet;
}
