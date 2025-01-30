import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Housing } from './housing.entity';

@Index('pk_yes_no_code', ['id'], { unique: true })
@Entity('yes_no_code')
export class YesNoCode {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'abbrev', nullable: true, length: 50 })
  abbrev: string | null;

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

  @OneToMany(() => Housing, (housing) => housing.isIndigenousLed)
  housings: Housing[];

  @OneToMany(() => Housing, (housing) => housing.isRental)
  housings2: Housing[];

  @OneToMany(() => Housing, (housing) => housing.isSocial)
  housings3: Housing[];
}
