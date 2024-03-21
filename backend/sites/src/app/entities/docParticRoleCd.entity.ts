import { Column, Entity, Index, OneToMany } from "typeorm";
import { SiteDocPartics } from "./siteDocPartics.entity";

@Index("doc_partic_role_cd_pkey", ["code"], { unique: true })
@Entity("doc_partic_role_cd")
export class DocParticRoleCd {
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Column("character varying", { name: "description", length: 40 })
  description: string;

  @OneToMany(() => SiteDocPartics, (siteDocPartics) => siteDocPartics.dprCode2)
  siteDocPartics: SiteDocPartics[];
}
