import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { StatusType } from './statusType.entity';

@Index('idx_app_status_application_id', ['applicationId'], {})
@Index('pk_app_status', ['id'], { unique: true })
@Index('idx_app_status_status_type_id', ['statusTypeId'], {})
@Entity('app_status')
export class AppStatus {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'application_id' })
  applicationId: number;

  @Column('integer', { name: 'status_type_id' })
  statusTypeId: number;

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

  @Column('character varying', { name: 'form_id', length: 50, nullable: true })
  formId: string | null;

  @Column('character varying', {
    name: 'submission_id',
    length: 50,
    nullable: true,
  })
  submissionId: string | null;

  @Column('bytea', { name: 'ts' })
  ts: Buffer;

  @OneToOne(() => Application, (application) => application.appStatus, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'application_id', referencedColumnName: 'id' }])
  application: Application;

  @ManyToOne(() => StatusType, (statusType) => statusType.appStatuses)
  @JoinColumn([{ name: 'status_type_id', referencedColumnName: 'id' }])
  statusType: StatusType;
}
