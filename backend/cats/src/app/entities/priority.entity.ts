import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppPriority } from './appPriority.entity';

@Index('pk_priority', ['id'], { unique: true })
@Entity('priority')
export class Priority {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'abbrev', nullable: true, length: 50 })
  abbrev: string | null;

  @Column('character varying', { name: 'description', length: 250 })
  description: string;

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

  @OneToMany(() => AppPriority, (appPriority) => appPriority.priority)
  appPriorities: AppPriority[];
}
