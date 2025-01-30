import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { Person } from './person.entity';
import { TimesheetWeek } from './timesheetWeek.entity';
import { TimesheetDetail } from './timesheetDetail.entity';

@Index('idx_timesheet_application_id', ['applicationId'], {})
@Index('pk_timesheet', ['id'], { unique: true })
@Index('idx_timesheet_person_id', ['personId'], {})
@Index('idx_timesheet_week_start_date', ['weekStartDate'], {})
@Entity('timesheet', { schema: 'cats' })
export class Timesheet {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'application_id' })
  applicationId: number;

  @Column('integer', { name: 'person_id' })
  personId: number;

  @Column('date', { name: 'week_start_date' })
  weekStartDate: string;

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

  @ManyToOne(() => Application, (application) => application.timesheets)
  @JoinColumn([{ name: 'application_id', referencedColumnName: 'id' }])
  application: Application;

  @ManyToOne(() => Person, (person) => person.timesheets)
  @JoinColumn([{ name: 'person_id', referencedColumnName: 'id' }])
  person: Person;

  @ManyToOne(() => TimesheetWeek, (timesheetWeek) => timesheetWeek.timesheets)
  @JoinColumn([{ name: 'week_start_date', referencedColumnName: 'startDate' }])
  weekStartDate2: TimesheetWeek;

  @OneToMany(
    () => TimesheetDetail,
    (timesheetDetail) => timesheetDetail.timesheet,
  )
  timesheetDetails: TimesheetDetail[];
}
