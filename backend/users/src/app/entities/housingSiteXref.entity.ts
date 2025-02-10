import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pk_housing_site_xref', ['id'], { unique: true })
@Entity('housing_site_xref')
export class HousingSiteXref {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'site_id' })
  siteId: number;

  @Column('integer', { name: 'housing_id' })
  housingId: number;

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
}
