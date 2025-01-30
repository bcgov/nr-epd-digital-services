import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';

@Index('idx_app_note_application_id', ['applicationId'], {})
@Index('pk_app_note', ['id'], { unique: true })
@Entity('app_note', { schema: 'cats' })
export class AppNote {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'application_id' })
  applicationId: number;

  @Column('date', { name: 'note_date' })
  noteDate: string;

  @Column('character varying', { name: 'note_text', length: 4000 })
  noteText: string;

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

  @ManyToOne(() => Application, (application) => application.appNotes)
  @JoinColumn([{ name: 'application_id', referencedColumnName: 'id' }])
  application: Application;
}
