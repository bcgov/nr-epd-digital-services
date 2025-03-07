import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { Priority } from './priority.entity';

@Index('idx_app_priority_application_id', ['applicationId'], {})
@Index('pk_app_priority', ['id'], { unique: true })
@Index('idx_app_priority_priority_id', ['priorityId'], {})
@Entity('app_priority')
export class AppPriority {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'application_id' })
  applicationId: number;

  @Column('integer', { name: 'priority_id' })
  priorityId: number;

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

  @ManyToOne(() => Application, (application) => application.appPriorities)
  @JoinColumn([{ name: 'application_id', referencedColumnName: 'id' }])
  application: Application;

  @ManyToOne(() => Priority, (priority) => priority.appPriorities)
  @JoinColumn([{ name: 'priority_id', referencedColumnName: 'id' }])
  priority: Priority;
}
