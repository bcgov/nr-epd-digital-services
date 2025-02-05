import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { Organization } from './organization.entity';
import { ParticipantRole } from './participantRole.entity';
import { Person } from './person.entity';

@Index('idx_app_participant_application_id', ['applicationId'], {})
@Index(
  'uidx_application_id_participant_role_id',
  ['applicationId', 'participantRoleId'],
  { unique: true },
)
@Index('pk_app_participant', ['id'], { unique: true })
@Index('idx_app_participant_organization_id', ['organizationId'], {})
@Index('idx_app_participant_participant_role_id', ['participantRoleId'], {})
@Index('idx_app_participant_person_id', ['personId'], {})
@Entity('app_participant', { schema: 'cats' })
export class AppParticipant {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'application_id' })
  applicationId: number;

  @Column('integer', { name: 'person_id' })
  personId: number;

  @Column('integer', { name: 'participant_role_id' })
  participantRoleId: number;

  @Column('integer', { name: 'organization_id', nullable: true })
  organizationId: number | null;

  @Column('boolean', { name: 'is_main_participant' })
  isMainParticipant: boolean;

  @Column('date', { name: 'effective_start_date' })
  effectiveStartDate: string;

  @Column('date', { name: 'effective_end_date', nullable: true })
  effectiveEndDate: string | null;

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

  @ManyToOne(() => Application, (application) => application.appParticipants)
  @JoinColumn([{ name: 'application_id', referencedColumnName: 'id' }])
  application: Application;

  @ManyToOne(() => Organization, (organization) => organization.appParticipants)
  @JoinColumn([{ name: 'organization_id', referencedColumnName: 'id' }])
  organization: Organization;

  @ManyToOne(
    () => ParticipantRole,
    (participantRole) => participantRole.appParticipants,
  )
  @JoinColumn([{ name: 'participant_role_id', referencedColumnName: 'id' }])
  participantRole: ParticipantRole;

  // @ManyToOne(() => Person, (person) => person.appParticipants)
  // @JoinColumn([{ name: 'person_id', referencedColumnName: 'id' }])
  // person: Person;
}
