import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Permissions } from './permissions.entity';
import { Application } from './application.entity';
import { ApplicationServiceType } from './applicationServiceType.entity';

@ObjectType()
@Entity('permission_service_type')
export class PermissionServiceType {
  @Field()
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: string;

  @Field()
  @Column('integer', { name: 'permission_id' })
  permissionId: number;

  @Field()
  @Column('integer', { name: 'service_type_id' })
  serviceTypeId: number;

  @ManyToOne(
    () => Permissions,
    (entity) => entity.permissionServiceTypeMappings,
  )
  @JoinColumn([{ name: 'permission_id', referencedColumnName: 'id' }])
  permissions: Permissions;

  @ManyToOne(
    () => ApplicationServiceType,
    (entity) => entity.permissionServiceTypeMappings,
  )
  @JoinColumn([{ name: 'service_type_id', referencedColumnName: 'id' }])
  serviceTypes: ApplicationServiceType;
}
