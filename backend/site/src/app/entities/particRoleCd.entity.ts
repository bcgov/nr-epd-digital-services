import { Column, Entity, Index, OneToMany } from "typeorm";
import { SiteParticRoles } from "./siteParticRoles";

@Index("partic_role_cd_pkey", ["code"], { unique: true })
@Entity("partic_role_cd", { schema: "public" })
export class ParticRoleCd {
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Column("character varying", { name: "description", length: 40 })
  description: string;

  @OneToMany(
    () => SiteParticRoles,
    (siteParticRoles) => siteParticRoles.prCode2
  )
  siteParticRoles: SiteParticRoles[];
}
