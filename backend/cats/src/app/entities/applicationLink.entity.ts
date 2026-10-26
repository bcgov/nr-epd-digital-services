import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';

@Index('pk_application_link', ['id'], { unique: true })
@Index('idx_application_link_cssa_application_id', ['cssaApplicationId'], {})
@Entity('application_link')
export class ApplicationLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer', { name: 'cssa_application_id' })
  cssaApplicationId: number;

  @Column('integer', { name: 'target_application_id', nullable: true })
  targetApplicationId: number | null;

  @Column('character varying', { name: 'confirmation_id', nullable: true })
  confirmationId: string | null;

  @Column('character varying', { name: 'created_by', length: 20 })
  createdBy: string;

  @Column('timestamp without time zone', { name: 'created_date_time' })
  createdDateTime: Date;

  @Column('character varying', { name: 'updated_by', length: 20 })
  updatedBy: string;

  @Column('timestamp without time zone', { name: 'updated_date_time' })
  updatedDateTime: Date;

  @ManyToOne(() => Application)
  @JoinColumn([{ name: 'cssa_application_id', referencedColumnName: 'id' }])
  cssaApplication: Application;

  @ManyToOne(() => Application, { nullable: true })
  @JoinColumn([{ name: 'target_application_id', referencedColumnName: 'id' }])
  targetApplication: Application | null;
}
