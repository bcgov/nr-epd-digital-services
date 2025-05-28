import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { Person } from './person.entity';

@Index('pk_timesheet_day', ['id'], { unique: true })
@Index('idx_timesheet_day_application_id', ['applicationId'], {})
@Index('idx_timesheet_day_person_id', ['personId'], {})
@Entity('timesheet_day')
export class TimesheetDay {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'application_id' })
  applicationId: number;

  @Column('integer', { name: 'person_id' })
  personId: number;

  @Column('date', { name: 'date' })
  date: string;

  @Column('character varying', {
    name: 'description',
    nullable: true,
    length: 255,
  })
  description: string | null;

  @Column('numeric', { name: 'hours', nullable: true, precision: 5, scale: 2 })
  hours: string | null;

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

  @ManyToOne(() => Application)
  @JoinColumn([{ name: 'application_id', referencedColumnName: 'id' }])
  application: Application;

  @ManyToOne(() => Person)
  @JoinColumn([{ name: 'person_id', referencedColumnName: 'id' }])
  person: Person;
}
