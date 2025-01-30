import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Timesheet } from './timesheet.entity';

@Index('idx_timesheet_week_end_date', ['endDate'], {})
@Index('pk_timesheet_week', ['startDate'], { unique: true })
@Entity('timesheet_week', { schema: 'cats' })
export class TimesheetWeek {
  @Column('date', { primary: true, name: 'start_date' })
  startDate: string;

  @Column('date', { name: 'end_date', nullable: true })
  endDate: string | null;

  @Column('character varying', {
    name: 'description',
    nullable: true,
    length: 63,
  })
  description: string | null;

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

  @OneToMany(() => Timesheet, (timesheet) => timesheet.weekStartDate2)
  timesheets: Timesheet[];
}
