import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { Housing } from './housing.entity';

@Index('pk_housing_application_xref', ['id'], { unique: true })
@Entity('housing_application_xref', { schema: 'cats' })
export class HousingApplicationXref {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

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

  @ManyToOne(
    () => Application,
    (application) => application.housingApplicationXrefs,
  )
  @JoinColumn([{ name: 'application_id', referencedColumnName: 'id' }])
  application: Application;

  @ManyToOne(() => Housing, (housing) => housing.housingApplicationXrefs)
  @JoinColumn([{ name: 'housing_id', referencedColumnName: 'id' }])
  housing: Housing;
}
