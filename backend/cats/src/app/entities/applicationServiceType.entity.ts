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
import { PermissionServiceTypeMapping } from './permissionServiceTypeMapping';

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

  @OneToMany(() => Application, (application) => application.serviceType)
  applications: Application[];

  @OneToMany(
    () => PermissionServiceTypeMapping,
    (mapping) => mapping.serviceTypes,
  )
  permissionServiceTypeMappings: PermissionServiceTypeMapping[];
}
