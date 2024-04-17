import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from "typeorm";
import { SiteCrownLandContaminated } from "./siteCrownLandContaminated.entity";

@ObjectType()
@Index("site_crown_land_status_cd_pkey", ["code"], { unique: true })
@Entity("site_crown_land_status_cd")
export class SiteCrownLandStatusCd {

  @Field()
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Field()
  @Column("character varying", { name: "description", length: 140 })
  description: string;

  @OneToMany(
    () => SiteCrownLandContaminated,
    (siteCrownLandContaminated) =>
      siteCrownLandContaminated.siteCrownLandStatusCode
  )
  siteCrownLandContaminateds: SiteCrownLandContaminated[];
}
