import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppParticipant } from './appParticipant.entity';

@Index('pk_organization', ['id'], { unique: true })
@Entity('organization', { schema: 'cats' })
export class Organization {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name', length: 250 })
  name: string;

  @Column('boolean', { name: 'is_tax_exempt' })
  isTaxExempt: boolean;

  @Column('boolean', { name: 'is_env_consultant' })
  isEnvConsultant: boolean;

  @Column('boolean', { name: 'is_ministry' })
  isMinistry: boolean;

  @Column('character varying', { name: 'address1', nullable: true, length: 50 })
  address1: string | null;

  @Column('character varying', { name: 'address2', nullable: true, length: 50 })
  address2: string | null;

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

  @Column('character varying', { name: 'email', nullable: true, length: 50 })
  email: string | null;

  @Column('boolean', { name: 'is_active' })
  isActive: boolean;

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

  @OneToMany(
    () => AppParticipant,
    (appParticipant) => appParticipant.organization,
  )
  appParticipants: AppParticipant[];
}
