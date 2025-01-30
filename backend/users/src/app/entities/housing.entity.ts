import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HousingType } from './housingType.entity';
import { YesNoCode } from './yesNoCode.entity';
import { HousingApplicationXref } from './housingApplicationXref.entity';

@Index('pk_housing', ['id'], { unique: true })
@Entity('housing', { schema: 'cats' })
export class Housing {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'number_of_units' })
  numberOfUnits: number;

  @Column('timestamp without time zone', { name: 'effective_date' })
  effectiveDate: Date;

  @Column('timestamp without time zone', {
    name: 'expiry_date',
    nullable: true,
  })
  expiryDate: Date | null;

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

  @ManyToOne(() => HousingType, (housingType) => housingType.housings)
  @JoinColumn([{ name: 'housing_type_id', referencedColumnName: 'id' }])
  housingType: HousingType;

  @ManyToOne(() => YesNoCode, (yesNoCode) => yesNoCode.housings)
  @JoinColumn([{ name: 'is_indigenous_led', referencedColumnName: 'id' }])
  isIndigenousLed: YesNoCode;

  @ManyToOne(() => YesNoCode, (yesNoCode) => yesNoCode.housings2)
  @JoinColumn([{ name: 'is_rental', referencedColumnName: 'id' }])
  isRental: YesNoCode;

  @ManyToOne(() => YesNoCode, (yesNoCode) => yesNoCode.housings3)
  @JoinColumn([{ name: 'is_social', referencedColumnName: 'id' }])
  isSocial: YesNoCode;

  @OneToMany(
    () => HousingApplicationXref,
    (housingApplicationXref) => housingApplicationXref.housing,
  )
  housingApplicationXrefs: HousingApplicationXref[];
}
