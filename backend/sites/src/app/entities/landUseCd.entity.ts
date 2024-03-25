import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from "typeorm";
import { LandHistories } from "./landHistories.entity";
import { SiteProfileLandUses } from "./siteProfileLandUses.entity";


@ObjectType()
@Index("land_use_cd_pkey", ["code"], { unique: true })
@Entity("land_use_cd")
export class LandUseCd {
  @Field()
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Field()
  @Column("character varying", { name: "description", length: 60 })
  description: string;

  @OneToMany(() => LandHistories, (landHistories) => landHistories.lutCode2)
  landHistories: LandHistories[];

  @OneToMany(
    () => SiteProfileLandUses,
    (siteProfileLandUses) => siteProfileLandUses.lutCode2
  )
  siteProfileLandUses: SiteProfileLandUses[];
}
