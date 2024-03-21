import { Column, Entity, Index, OneToMany } from "typeorm";
import { Sites } from "./sites.entity";

@Index("site_risk_cd_pkey", ["code"], { unique: true })
@Entity("site_risk_cd")
export class SiteRiskCd {
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Column("character varying", { name: "description", length: 40 })
  description: string;

  @OneToMany(() => Sites, (sites) => sites.siteRiskCode2)
  sites: Sites[];
}
