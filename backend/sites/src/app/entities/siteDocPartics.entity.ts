import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { DocParticRoleCd } from "./docParticRoleCd.entity";
import { PeopleOrgs } from "./peopleOrgs.entity";
import { SiteDocs } from "./siteDocs.entity";
import { SitePartics } from "./sitePartics.entity";

@Index("sdp_classified_by_frgn", ["dprCode"], {})
@Index(
  "site_doc_partics_sdoc_id_psnorg_id_dpr_code_key",
  ["dprCode", "psnorgId", "sdocId"],
  { unique: true }
)
@Index("site_doc_partics_pkey", ["id"], { unique: true })
@Index("sdp_psnorg_frgn", ["psnorgId"], {})
@Index("sdp_rwm_flag", ["rwmFlag"], {})
@Index("sdp_playing_a_role_i_frgn", ["sdocId"], {})
@Index("sdp_played_by_frgn", ["spId"], {})
@Entity("site_doc_partics")
export class SiteDocPartics {
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Column("character varying", { name: "dpr_code", unique: true, length: 6 })
  dprCode: string;

  @Column("bigint", { name: "sdoc_id", unique: true })
  sdocId: string;

  @Column("bigint", { name: "sp_id" })
  spId: string;

  @Column("bigint", { name: "psnorg_id", unique: true })
  psnorgId: string;

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

  @ManyToOne(
    () => DocParticRoleCd,
    (docParticRoleCd) => docParticRoleCd.siteDocPartics
  )
  @JoinColumn([{ name: "dpr_code", referencedColumnName: "code" }])
  dprCode2: DocParticRoleCd;

  @ManyToOne(() => PeopleOrgs, (peopleOrgs) => peopleOrgs.siteDocPartics)
  @JoinColumn([{ name: "psnorg_id", referencedColumnName: "id" }])
  psnorg: PeopleOrgs;

  @ManyToOne(() => SiteDocs, (siteDocs) => siteDocs.siteDocPartics, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "sdoc_id", referencedColumnName: "id" }])
  sdoc: SiteDocs;

  @ManyToOne(() => SitePartics, (sitePartics) => sitePartics.siteDocPartics, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "sp_id", referencedColumnName: "id" }])
  sp: SitePartics;
}
