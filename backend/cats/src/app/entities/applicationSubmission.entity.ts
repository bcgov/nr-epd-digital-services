import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';

@Index('pk_application_submission', ['id'], { unique: true })
@Index('idx_application_submission_application_id', ['applicationId'], {})
@Index('idx_application_submission_chefs_form_id', ['chefsFormId'], {})
@Entity('application_submission')
export class ApplicationSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer', { name: 'application_id', nullable: true })
  applicationId: number | null;

  @Column('character varying', { name: 'chefs_form_id' })
  chefsFormId: string;

  @Column('character varying', { name: 'chefs_submission_id', unique: true })
  chefsSubmissionId: string;

  @Column('character varying', {
    name: 'chefs_form_version_id',
    nullable: true,
  })
  chefsFormVersionId: string | null;

  @Column('character varying', {
    name: 'chefs_confirmation_id',
    nullable: true,
  })
  chefsConfirmationId: string | null;

  @Column('jsonb', { name: 'form_data' })
  formData: Record<string, any>;

  @Column('timestamp with time zone', { name: 'received_at', nullable: true })
  receivedAt: Date | null;

  @Column('character varying', { name: 'created_by', length: 20 })
  createdBy: string;

  @Column('timestamp without time zone', { name: 'created_date_time' })
  createdDateTime: Date;

  @Column('character varying', { name: 'updated_by', length: 20 })
  updatedBy: string;

  @Column('timestamp without time zone', { name: 'updated_date_time' })
  updatedDateTime: Date;

  @ManyToOne(
    () => Application,
    (application) => application.applicationSubmissions,
  )
  @JoinColumn([{ name: 'application_id', referencedColumnName: 'id' }])
  application: Application;
}
