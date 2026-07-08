import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { ParticipantRole } from './participantRole.entity';
import { PermissionServiceType } from './permissionServiceType';

/**
 * ApplicationServiceType Entity
 */
@ObjectType()
@Entity('application_service_type')
export class ApplicationServiceType {
  @Field()
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: string;

  @Field()
  @Column('character varying', { name: 'service_name' })
  serviceName: string;

  @Field()
  @Column('character varying', { name: 'service_type' })
  serviceType: string;

  // Needs to be saved in cents, similar to invoice entity
  @Field({ nullable: true })
  @Column('integer', { name: 'service_fee_in_cents', nullable: true })
  serviceFeeInCents: number | null;

  @OneToMany(() => Application, (application) => application.serviceType)
  applications: Application[];

  @OneToMany(() => PermissionServiceType, (mapping) => mapping.serviceTypes)
  permissionServiceTypeMappings: PermissionServiceType[];
}
