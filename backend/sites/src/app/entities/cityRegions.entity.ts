import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BceRegionCd } from "./bceRegionCd.entity";

@ObjectType()
@Index("cr_associated_region", ["bcerCode"], {})
@Index("city_regions_pkey", ["city"], { unique: true })
@Entity("city_regions")
export class CityRegions {
  @Field()
  @Column("character varying", { primary: true, name: "city", length: 30 })
  city: string;

  @Field()
  @Column("character varying", { name: "bcer_code", length: 6 })
  bcerCode: string;

  @ManyToOne(() => BceRegionCd, (bceRegionCd) => bceRegionCd.cityRegions)
  @JoinColumn([{ name: "bcer_code", referencedColumnName: "code" }])
  bcerCode2: BceRegionCd;
}
