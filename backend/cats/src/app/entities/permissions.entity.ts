import {
  Column,
  Entity,
  In,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PersonPermission } from './personPermissions.entity';
import { ParticipantRole } from './participantRole.entity';

@Index('pk_person_permissions', ['id'], { unique: true })
@Entity('permissions')
export class Permissions {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'role_id' })
  roleId: number;

  @Column('character varying', { name: 'description', length: 250 })
  description: string;

  @Column('character varying', { name: 'created_by', length: 20 })
  createdBy: string;

  @Column('timestamp without time zone', { name: 'created_datetime' })
  createdDatetime: Date;

  @Column('character varying', {
    name: 'updated_by',
    length: 20,
    nullable: true,
  })
  updatedBy: string;

  @Column('timestamp without time zone', {
    name: 'updated_datetime',
    nullable: true,
  })
  updatedDatetime: Date;

  @ManyToOne(
    () => ParticipantRole,
    (participantRole) => participantRole.permissions,
  )
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: ParticipantRole;

  @OneToMany(
    () => PersonPermission,
    (personPermission) => personPermission.permission,
  )
  personPermissions: PersonPermission[];
}
