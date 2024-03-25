import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { LandUseCd } from "./landUseCd.entity";
import { SiteProfiles } from "./siteProfiles.entity";

@ObjectType()
@Index(
  "site_profile_land_uses_pkey",
  ["lutCode", "siteId", "sprofDateCompleted"],
  { unique: true }
)
@Entity("site_profile_land_uses")
export class SiteProfileLandUses {
  
  @Field()
  @Column("bigint", { primary: true, name: "site_id" })
  siteId: string;
  
  @Field()
  @Column("timestamp without time zone", {
    primary: true,
    name: "sprof_date_completed",
  })
  sprofDateCompleted: Date;
  
  @Field()
  @Column("character varying", { primary: true, name: "lut_code", length: 6 })
  lutCode: string;
  
  @Field()
  @Column("character varying", { name: "who_created", length: 16 })
  whoCreated: string;
  
  @Field()
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
