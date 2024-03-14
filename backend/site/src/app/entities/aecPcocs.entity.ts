import { Column, Entity, Index } from "typeorm";

@Index("aecpcoc_assessments_frgn_frgn", ["aecassAreaId", "siteId"], {})
@Index("aec_pcocs_pkey", ["id"], { unique: true })
@Index("aecpcocs_media_frgn_frgn", ["mediaId"], {})
@Entity("aec_pcocs", { schema: "public" })
export class AecPcocs {
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Column("bigint", { name: "media_id" })
  mediaId: string;

  @Column("character varying", { name: "media_cd", nullable: true, length: 6 })
  mediaCd: string | null;

  @Column("bigint", { name: "site_id" })
  siteId: string;

  @Column("character varying", { name: "aecass_area_id", length: 40 })
  aecassAreaId: string;

  @Column("character varying", { name: "contaminant_cd", length: 50 })
  contaminantCd: string;

  @Column("character varying", {
    name: "criteria_cd",
    nullable: true,
    length: 10,
  })
  criteriaCd: string | null;

  @Column("character varying", { name: "level_cd", nullable: true, length: 6 })
  levelCd: string | null;

  @Column("character", { name: "selected", nullable: true, length: 1 })
  selected: string | null;

  @Column("character varying", {
    name: "who_created",
    nullable: true,
    length: 30,
  })
  whoCreated: string | null;

  @Column("timestamp without time zone", {
    name: "when_created",
    nullable: true,
  })
  whenCreated: Date | null;

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
