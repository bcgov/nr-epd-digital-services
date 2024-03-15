import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Sites } from "./sites";

@Index("sa_rwm_flag", ["rwmFlag"], {})
@Index("sa_rwm_note_flag", ["rwmNoteFlag"], {})
@Index("sa_adjacent_to_frgn", ["siteId"], {})
@Index("site_assocs_pkey", ["siteId", "siteIdAssociatedWith"], { unique: true })
@Index("sa_associated_with_frgn", ["siteIdAssociatedWith"], {})
@Entity("site_assocs", { schema: "public" })
export class SiteAssocs {
  @Column("bigint", { primary: true, name: "site_id" })
  siteId: string;

  @Column("bigint", { primary: true, name: "site_id_associated_with" })
  siteIdAssociatedWith: string;

  @Column("timestamp without time zone", { name: "effective_date" })
  effectiveDate: Date;

  @Column("character varying", { name: "note", nullable: true, length: 255 })
  note: string | null;

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

  @Column("smallint", { name: "rwm_note_flag" })
  rwmNoteFlag: number;

  @Column("character varying", { name: "common_pid", length: 1 })
  commonPid: string;

  @ManyToOne(() => Sites, (sites) => sites.siteAssocs, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "site_id", referencedColumnName: "id" }])
  site: Sites;

  @ManyToOne(() => Sites, (sites) => sites.siteAssocs2, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "site_id_associated_with", referencedColumnName: "id" }])
  siteIdAssociatedWith2: Sites;
}
