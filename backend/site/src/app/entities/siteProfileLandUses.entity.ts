import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { LandUseCd } from "./landUseCd";
import { SiteProfiles } from "./siteProfiles";

@Index(
  "site_profile_land_uses_pkey",
  ["lutCode", "siteId", "sprofDateCompleted"],
  { unique: true }
)
@Entity("site_profile_land_uses", { schema: "public" })
export class SiteProfileLandUses {
  @Column("bigint", { primary: true, name: "site_id" })
  siteId: string;

  @Column("timestamp without time zone", {
    primary: true,
    name: "sprof_date_completed",
  })
  sprofDateCompleted: Date;

  @Column("character varying", { primary: true, name: "lut_code", length: 6 })
  lutCode: string;

  @Column("character varying", { name: "who_created", length: 16 })
  whoCreated: string;

  @Column("timestamp without time zone", { name: "when_created" })
  whenCreated: Date;

  @ManyToOne(() => LandUseCd, (landUseCd) => landUseCd.siteProfileLandUses)
  @JoinColumn([{ name: "lut_code", referencedColumnName: "code" }])
  lutCode2: LandUseCd;

  @ManyToOne(
    () => SiteProfiles,
    (siteProfiles) => siteProfiles.siteProfileLandUses
  )
  @JoinColumn([
    { name: "site_id", referencedColumnName: "siteId" },
    { name: "sprof_date_completed", referencedColumnName: "dateCompleted" },
  ])
  siteProfiles: SiteProfiles;
}
