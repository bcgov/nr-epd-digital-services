import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppParticipant } from './appParticipant.entity';
import { Timesheet } from './timesheet.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Index('pk_person', ['id'], { unique: true })
@Entity('person')
export class Person {
  @Field()
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Field()
  firstName: string;

  @Field()
  middleName: string | null;

  @Field()
  lastName: string;

  @Field()
  isTaxExempt: boolean;

  @Field()
  isEnvConsultant: boolean;

  @Field()
  loginUserName: string | null;

  @Field()
  address_1: string | null;

  @Field()
  address_2: string | null;

  @Field()
  city: string | null;

  @Field()
  prov: string | null;

  @Field()
  country: string | null;

  @Field()
  postal: string | null;

  @Field()
  phone: string | null;

  @Field()
  mobile: string | null;

  @Field()
  fax: string | null;

  @Field()
  email: string | null;

  @Field()
  isActive: boolean;

  @Field()
  rowVersionCount: number;

  @Field()
  createdBy: string;

  @Field()
  createdDatetime: Date;

  @Field()
  updatedBy: string;

  @Field()
  updatedDatetime: Date;

  @Field()
  ts: Buffer;

  @OneToMany(() => AppParticipant, (appParticipant) => appParticipant.person)
  appParticipants: AppParticipant[];

  @OneToMany(() => Timesheet, (timesheet) => timesheet.person)
  timesheets: Timesheet[];
}
