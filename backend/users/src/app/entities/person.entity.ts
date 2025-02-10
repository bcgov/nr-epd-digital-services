import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppParticipant } from './appParticipant.entity';
import { Timesheet } from './timesheet.entity';
// import { Field, ObjectType } from '@nestjs/graphql';

// @ObjectType()
@Index('pk_person', ['id'], { unique: true })
@Entity('person')
export class Person {
  // @Field(() => Number)
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  // @Field(() => String)
  @Column('character varying', { name: 'first_name', length: 50 })
  firstName: string;

  // @Field(() => String, { nullable: true })
  @Column('character varying', {
    name: 'middle_name',
    nullable: true,
    length: 50,
  })
  middleName: string | null;

  // @Field(() => String)
  @Column('character varying', { name: 'last_name', length: 50 })
  lastName: string;

  // @Field(() => Boolean)
  @Column('boolean', { name: 'is_tax_exempt' })
  isTaxExempt: boolean;

  // @Field(() => Boolean, { nullable: true })
  @Column('boolean', { name: 'is_env_consultant', nullable: true })
  isEnvConsultant: boolean;

  // @Field(() => String, { nullable: true })
  @Column('character varying', {
    name: 'login_user_name',
    nullable: true,
    length: 20,
  })
  loginUserName: string | null;

  // @Field(() => String, { nullable: true })
  @Column('character varying', {
    name: 'address_1',
    nullable: true,
    length: 50,
  })
  address_1: string | null;

  // @Field(() => String, { nullable: true })
  @Column('character varying', {
    name: 'address_2',
    nullable: true,
    length: 50,
  })
  address_2: string | null;

  // @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'city', nullable: true, length: 50 })
  city: string | null;

  // @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'prov', nullable: true, length: 2 })
  prov: string | null;

  // @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'country', nullable: true, length: 50 })
  country: string | null;

  // @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'postal', nullable: true, length: 15 })
  postal: string | null;

  // @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'phone', nullable: true, length: 50 })
  phone: string | null;

  // @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'mobile', nullable: true, length: 50 })
  mobile: string | null;

  // @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'fax', nullable: true, length: 50 })
  fax: string | null;

  // @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'email', nullable: true, length: 100 })
  email: string | null;

  // @Field(() => Boolean)
  @Column('boolean', { name: 'is_active' })
  isActive: boolean;

  // @Field(() => String, { nullable: true })
  @Column('integer', { name: 'row_version_count', nullable: true })
  rowVersionCount: number;

  // @Field(() => String)
  @Column('character varying', { name: 'created_by', length: 20 })
  createdBy: string;

  // @Field(() => String)
  @Column('timestamp without time zone', { name: 'created_datetime' })
  createdDatetime: Date;

  // @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'updated_by', length: 20, nullable: true })
  updatedBy: string;

  // @Field(() => String, { nullable: true })
  @Column('timestamp without time zone', { name: 'updated_datetime', nullable: true })
  updatedDatetime: Date;

  // @Field(() => String, { nullable: true })
  @Column('bytea', { name: 'ts', nullable: true })
  ts: Buffer;

  @OneToMany(() => AppParticipant, (appParticipant) => appParticipant.person)
  appParticipants: AppParticipant[];

  @OneToMany(() => Timesheet, (timesheet) => timesheet.person)
  timesheets: Timesheet[];
}
