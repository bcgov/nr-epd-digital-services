import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { AppStatus } from './appStatus.entity';

@ObjectType()
@Index('pk_status_type', ['id'], { unique: true })
@Entity('status_type')
export class StatusType {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Field({ nullable: true })
  @Column('character varying', { name: 'abbrev', nullable: true, length: 50 })
  abbrev: string | null;

  @Field()
  @Column('character varying', { name: 'description', length: 250 })
  description: string;

  @Column('boolean', { name: 'is_active' })
  isActive: boolean;

  @Column('integer', { name: 'display_order' })
  displayOrder: number;

  @Column('integer', { name: 'row_version_count' })
  rowVersionCount: number;

  @Column('character varying', { name: 'created_by', length: 20 })
  createdBy: string;

  @Column('timestamp without time zone', { name: 'created_date_time' })
  createdDateTime: Date;

  @Column('character varying', { name: 'updated_by', length: 20 })
  updatedBy: string;

  @Column('timestamp without time zone', { name: 'updated_date_time' })
  updatedDateTime: Date;

  @Column('bytea', { name: 'ts' })
  ts: Buffer;

  @OneToMany(() => AppStatus, (appStatus) => appStatus.statusType)
  appStatuses: AppStatus[];
}
