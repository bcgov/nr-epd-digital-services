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
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
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
@Entity('app_participant')
export class AppParticipant {
  @Field()
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Field()
  applicationId: number;

  @Field()
  personId: number;

  @Field()
  participantRoleId: number;

  @Field()
  organizationId: number | null;

  @Field()
  isMainParticipant: boolean;

  @Field()
  effectiveStartDate: string;

  @Field()
  effectiveEndDate: string | null;

  @Field()
  rowVersionCount: number;

  @Field()
  createdBy: string;

  @Field()
  createdDateTime: Date;

  @Field()
  updatedBy: string;

  @Field()
  updatedDateTime: Date;

  @Field()
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

  @ManyToOne(() => Person, (person) => person.appParticipants)
  @JoinColumn([{ name: 'person_id', referencedColumnName: 'id' }])
  person: Person;
}
