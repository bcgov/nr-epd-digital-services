import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { ParticRoleCd } from "./particRoleCd";
import { SitePartics } from "./sitePartics";

@Index("spr_classified_by_frgn", ["prCode"], {})
@Index("site_partic_roles_pkey", ["prCode", "spId"], { unique: true })
@Index("spr_rwm_flag", ["rwmFlag"], {})
@Index("spr_classifying_frgn", ["spId"], {})
@Entity("site_partic_roles", { schema: "public" })
export class SiteParticRoles {
  @Column("character varying", { primary: true, name: "pr_code", length: 6 })
  prCode: string;

  @Column("bigint", { primary: true, name: "sp_id" })
  spId: string;

  @Column("character varying", { name: "who_created", length: 30 })
  whoCreated: string;

  @Column("character varying", {
    name: "who_updated",
    nullable: true,
    length: 30,
  })
  whoUpdated: string | null;

  @Column("timestamp without time zone", { name: "when_created" })
  whenCreated: Date;

  @Column("timestamp without time zone", {
    name: "when_updated",
    nullable: true,
  })
  whenUpdated: Date | null;

  @Column("smallint", { name: "rwm_flag" })
  rwmFlag: number;

  @ManyToOne(() => ParticRoleCd, (particRoleCd) => particRoleCd.siteParticRoles)
  @JoinColumn([{ name: "pr_code", referencedColumnName: "code" }])
  prCode2: ParticRoleCd;

  @ManyToOne(() => SitePartics, (sitePartics) => sitePartics.siteParticRoles, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "sp_id", referencedColumnName: "id" }])
  sp: SitePartics;
}
