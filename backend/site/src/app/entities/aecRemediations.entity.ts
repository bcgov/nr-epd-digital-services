import { Column, Entity, Index } from "typeorm";

@Index("aec_remediations_pkey", ["id"], { unique: true })
@Index(
  "aec_remediations_site_id_plan_name_media_code_key",
  ["mediaCode", "planName", "siteId"],
  { unique: true }
)
@Index("aecrem_media_frgn", ["mediaCode"], {})
@Index("aecrem_sites_frgn", ["siteId"], {})
@Entity("aec_remediations", { schema: "public" })
export class AecRemediations {
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Column("bigint", { name: "site_id", unique: true })
  siteId: string;

  @Column("character varying", { name: "plan_name", unique: true, length: 40 })
  planName: string;

  @Column("character varying", { name: "media_code", unique: true, length: 6 })
  mediaCode: string;

  @Column("timestamp without time zone", { name: "plan_date", nullable: true })
  planDate: Date | null;

  @Column("character varying", {
    name: "remed_note",
    nullable: true,
    length: 2000,
  })
  remedNote: string | null;

  @Column("smallint", { name: "rwm_flag" })
  rwmFlag: number;

  @Column("smallint", { name: "rwm_note_flag" })
  rwmNoteFlag: number;

  @Column("character varying", { name: "who_created", length: 30 })
  whoCreated: string;

  @Column("timestamp without time zone", { name: "when_created" })
  whenCreated: Date;

  @Column("character varying", {
    name: "who_updated",
    nullable: true,
    length: 30,
  })
  whoUpdated: string | null;

  @Column("timestamp without time zone", {
    name: "when_updated",
    nullable: true,
  })
  whenUpdated: Date | null;
}
