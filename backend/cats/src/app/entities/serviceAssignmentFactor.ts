import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ParticipantRole } from './participantRole.entity';
import { ApplicationServiceType } from './applicationServiceType.entity';

@ObjectType()
@Entity('service_assignment_factor')
export class ServiceAssignmentFactor {
  @Field()
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: string;

  @Field()
  @Column('decimal', { name: 'assignment_factor', precision: 9, scale: 5 })
  assignmentFactor: number;

  @ManyToOne(() => ApplicationServiceType, (type) => type.id)
  @JoinColumn({ name: 'service_type_id' }) // This is crucial
  applicationServiceType: ApplicationServiceType;

  @ManyToOne(() => ParticipantRole, (role) => role.id)
  @JoinColumn({ name: 'role_id' }) // This is crucial
  role: ParticipantRole;
}
