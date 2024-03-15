import { Column, Entity, Index, OneToMany } from "typeorm";
import { SiteCrownLandContaminated } from "./siteCrownLandContaminated";

@Index("site_crown_land_status_cd_pkey", ["code"], { unique: true })
@Entity("site_crown_land_status_cd", { schema: "public" })
export class SiteCrownLandStatusCd {
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Column("character varying", { name: "description", length: 140 })
  description: string;

  @OneToMany(
    () => SiteCrownLandContaminated,
    (siteCrownLandContaminated) =>
      siteCrownLandContaminated.siteCrownLandStatusCode
  )
  siteCrownLandContaminateds: SiteCrownLandContaminated[];
}
