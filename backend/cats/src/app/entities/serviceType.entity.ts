import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Application } from './application.entity';

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
  @Column('integer', { name: 'assignment_factor' })
  assignmentFactor: number;

  @Field()
  @Column('character varying', { name: 'service_type' })
  serviceType: string;

  @OneToMany(() => Application, (application) => application.serviceType)
  applications: Application[];
}
