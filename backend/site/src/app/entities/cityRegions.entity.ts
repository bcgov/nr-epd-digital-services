import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BceRegionCd } from "./bceRegionCd.entity";

@Index("cr_associated_region", ["bcerCode"], {})
@Index("city_regions_pkey", ["city"], { unique: true })
@Entity("city_regions", { schema: "public" })
export class CityRegions {
  @Column("character varying", { primary: true, name: "city", length: 30 })
  city: string;

  @Column("character varying", { name: "bcer_code", length: 6 })
  bcerCode: string;

  @ManyToOne(() => BceRegionCd, (bceRegionCd) => bceRegionCd.cityRegions)
  @JoinColumn([{ name: "bcer_code", referencedColumnName: "code" }])
  bcerCode2: BceRegionCd;
}