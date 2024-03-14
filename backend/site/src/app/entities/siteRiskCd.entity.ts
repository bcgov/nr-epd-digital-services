import { Column, Entity, Index } from "typeorm";

@Index("site_risk_cd_pkey", ["code"], { unique: true })
@Entity("site_risk_cd", { schema: "public" })
export class SiteRiskCd {
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Column("character varying", { name: "description", length: 40 })
  description: string;
}
