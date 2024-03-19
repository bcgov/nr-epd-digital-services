import { Column, Entity, Index, OneToMany } from "typeorm";
import { CityRegions } from "./cityRegions.entity";
import { Mailout } from "./mailout.entity";
import { PeopleOrgs } from "./peopleOrgs.entity";
import { Sites } from "./sites.entity";

@Index("bce_region_cd_pkey", ["code"], { unique: true })
@Entity("bce_region_cd", { schema: "public" })
export class BceRegionCd {
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Column("character varying", { name: "description", length: 40 })
  description: string;

  @OneToMany(() => CityRegions, (cityRegions) => cityRegions.bcerCode2)
  cityRegions: CityRegions[];

  @OneToMany(() => Mailout, (mailout) => mailout.bcerCode2)
  mailouts: Mailout[];

  @OneToMany(() => PeopleOrgs, (peopleOrgs) => peopleOrgs.bcerCode2)
  peopleOrgs: PeopleOrgs[];

  @OneToMany(() => Sites, (sites) => sites.bcerCode2)
  sites: Sites[];
}
