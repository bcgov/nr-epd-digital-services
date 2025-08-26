import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppParticipant } from './appParticipant.entity';
import { Timesheet } from './timesheet.entity';
import { PersonNote } from './personNote.entity';
import { InvoiceV2 } from './invoiceV2.entity';
import { PersonPermission } from './personPermissions.entity';

@Index('pk_person', ['id'], { unique: true })
@Entity('person')
export class Person {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'first_name', length: 50 })
  firstName: string;

  @Column('character varying', {
    name: 'middle_name',
    nullable: true,
    length: 50,
  })
  middleName: string | null;

  @Column('character varying', { name: 'last_name', length: 50 })
  lastName: string;

  @Column('boolean', { name: 'is_tax_exempt' })
  isTaxExempt: boolean;

  @Column('boolean', { name: 'is_env_consultant', nullable: true })
  isEnvConsultant: boolean;

  @Column('character varying', {
    name: 'login_user_name',
    nullable: true,
    length: 20,
  })
  loginUserName: string | null;

  @Column('character varying', {
    name: 'address_1',
    nullable: true,
    length: 50,
  })
  address_1: string | null;

  @Column('character varying', {
    name: 'address_2',
    nullable: true,
    length: 50,
  })
  address_2: string | null;

  @Column('character varying', { name: 'city', nullable: true, length: 50 })
  city: string | null;

  @Column('character varying', { name: 'prov', nullable: true, length: 2 })
  prov: string | null;

  @Column('character varying', { name: 'country', nullable: true, length: 50 })
  country: string | null;

  @Column('character varying', { name: 'postal', nullable: true, length: 15 })
  postal: string | null;

  @Column('character varying', { name: 'phone', nullable: true, length: 50 })
  phone: string | null;

  @Column('character varying', { name: 'mobile', nullable: true, length: 50 })
  mobile: string | null;

  @Column('character varying', { name: 'fax', nullable: true, length: 50 })
  fax: string | null;

  @Column('character varying', { name: 'email', nullable: true, length: 100 })
  email: string | null;

  @Column('boolean', { name: 'is_active' })
  isActive: boolean;

  @Column('boolean', { name: 'is_deleted', nullable: true })
  isDeleted?: boolean;

  @Column('integer', { name: 'row_version_count', nullable: true })
  rowVersionCount: number;

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

  // Comment out for now, not sure if we need this
  // @Field(() => String)
  // @Column('bytea', { name: 'ts', nullable: true })
  // ts?: Buffer;

  @OneToMany(() => AppParticipant, (appParticipant) => appParticipant.person)
  appParticipants?: AppParticipant[];

  @OneToMany(() => Timesheet, (timesheet) => timesheet.person)
  timesheets?: Timesheet[];

  @OneToMany(() => PersonNote, (note) => note.person)
  notes?: PersonNote[];

  @OneToMany(() => InvoiceV2, (invoice) => invoice.recipient)
  invoices?: InvoiceV2[];

  @OneToMany(
    () => PersonPermission,
    (personPermission) => personPermission.person,
  )
  personPermissions: PersonPermission[];
}
