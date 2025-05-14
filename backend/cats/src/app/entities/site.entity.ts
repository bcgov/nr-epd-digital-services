import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Application } from './application.entity';
import { Region } from './region.entity';

/**
 *  DO NOT USE  - FETCH DATA FROM SITE SERVICE
 */
@Index('pk_site', ['id'], { unique: true })
@Entity('site')
export class Site {
  @Column('integer', { primary: true, name: 'id' })
  id: number;

  @Column('character varying', { name: 'common_name', length: 50 })
  commonName: string;

  @Column('character varying', {
    name: 'regional_file',
    nullable: true,
    length: 50,
  })
  regionalFile: string | null;

  @Column('character varying', {
    name: 'victoria_file',
    nullable: true,
    length: 50,
  })
  victoriaFile: string | null;

  @Column('character varying', { name: 'address', nullable: true, length: 50 })
  address: string | null;

  @Column('character varying', { name: 'city', nullable: true, length: 50 })
  city: string | null;

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

  @OneToMany(() => Application, (application) => application.site)
  applications: Application[];

  @ManyToOne(() => Region, (region) => region.sites)
  @JoinColumn([{ name: 'region_id', referencedColumnName: 'id' }])
  region: Region;
}
