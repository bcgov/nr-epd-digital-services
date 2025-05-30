import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn, Unique } from 'typeorm';
import { Person } from './person.entity';
import { Permissions } from './permissions.entity';

@Unique('UQ_person_permission', ['personId', 'permissionId'])
@Entity('person_permissions')
export class PersonPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column( 'integer', {name: 'person_id'})
  personId: number;

  @Column( 'integer', {name: 'permission_id'})
  permissionId: number;

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

  @ManyToOne(() => Person, person => person.personPermissions, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'person_id', referencedColumnName: 'id' }])
  person: Person;

  @ManyToOne(() => Permissions, permission => permission.personPermissions, { eager: true })
  @JoinColumn([{ name: 'permission_id', referencedColumnName: 'id' }])
  permission: Permissions;
}
