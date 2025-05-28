import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppParticipant } from './appParticipant.entity';
import { Permissions } from './permissions.entity';

@Index('pk_participant_role', ['id'], { unique: true })
@Entity('participant_role')
export class ParticipantRole {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'abbrev', nullable: true, length: 20 })
  abbrev: string | null;

  @Column('character varying', { name: 'description', length: 250 })
  description: string;

  @Column('character varying', {
    name: 'role_type',
    length: 50,
    nullable: true,
  })
  roleType: string | null; // Example: Staff, Volunteer etc

  @Column('boolean', { name: 'is_ministry' })
  isMinistry: boolean;

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

  @OneToMany(
    () => AppParticipant,
    (appParticipant) => appParticipant.participantRole,
  )
  appParticipants: AppParticipant[];

  @Column('integer', { name: 'assignment_factor', nullable: true })
  assignmentFactor: number | null;

  @OneToMany(() => Permissions, (permissions) => permissions.roleId)
  permissions: Permissions[];
}
