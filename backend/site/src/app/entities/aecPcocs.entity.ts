import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { CriteriaLevelCd } from "./criteriaLevelCd";
import { AecMedias } from "./aecMedias";
import { AecAssessments } from "./aecAssessments";
import { AecRemedItems } from "./aecRemedItems";

@Index("aecpcoc_assessments_frgn_frgn", ["aecassAreaId", "siteId"], {})
@Index("aec_pcocs_pkey", ["id"], { unique: true })
@Index("aecpcocs_media_frgn_frgn", ["mediaId"], {})
@Entity("aec_pcocs", { schema: "public" })
export class AecPcocs {
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Column("bigint", { name: "media_id" })
  mediaId: string;

  @Column("bigint", { name: "site_id" })
  siteId: string;

  @Column("character varying", { name: "aecass_area_id", length: 40 })
  aecassAreaId: string;

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

  @ManyToOne(
    () => CriteriaLevelCd,
    (criteriaLevelCd) => criteriaLevelCd.aecPcocs
  )
  @JoinColumn([
    { name: "contaminant_cd", referencedColumnName: "contaminantCode" },
    { name: "criteria_cd", referencedColumnName: "criteriaCd" },
    { name: "media_cd", referencedColumnName: "mediaCd" },
    { name: "level_cd", referencedColumnName: "levelCode" },
  ])
  criteriaLevelCd: CriteriaLevelCd;

  @ManyToOne(() => AecMedias, (aecMedias) => aecMedias.aecPcocs)
  @JoinColumn([{ name: "media_id", referencedColumnName: "id" }])
  media: AecMedias;

  @ManyToOne(() => AecAssessments, (aecAssessments) => aecAssessments.aecPcocs)
  @JoinColumn([
    { name: "site_id", referencedColumnName: "siteId" },
    { name: "aecass_area_id", referencedColumnName: "areaId" },
  ])
  aecAssessments: AecAssessments;

  @OneToMany(() => AecRemedItems, (aecRemedItems) => aecRemedItems.aecpcoc)
  aecRemedItems: AecRemedItems[];
}
