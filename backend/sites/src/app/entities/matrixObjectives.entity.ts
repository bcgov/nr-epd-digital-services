import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { ActivityCd } from "./activityCd.entity";
import { ContamCd } from "./contamCd.entity";
import { CriteriaCd } from "./criteriaCd.entity";
import { MediaCd } from "./mediaCd.entity";
import { ProtectionCategoryCd } from "./protectionCategoryCd.entity";
import { RemedSiteUseCd } from "./remedSiteUseCd.entity";

@Index(
  "matrix_objectives_pkey",
  [
    "activityCode",
    "contaminantCode",
    "criteriaCode",
    "levelValue",
    "mediaCode",
    "protcatCode",
    "remedSiteUseCode",
  ],
  { unique: true }
)
@Index("matobj_activity_frgn", ["activityCode"], {})
@Index(
  "matobj_usage_ind",
  [
    "activityCode",
    "contaminantCode",
    "criteriaCode",
    "mediaCode",
    "protcatCode",
    "remedSiteUseCode",
  ],
  {}
)
@Index("matobj_contam_frgn", ["contaminantCode"], {})
@Index("matobj_criteria_frgn", ["criteriaCode"], {})
@Index("matobj_media_frgn", ["mediaCode"], {})
@Index("matobj_protcat_frgn", ["protcatCode"], {})
@Index("matobj_remed_use_frgn", ["remedSiteUseCode"], {})
@Entity("matrix_objectives")
export class MatrixObjectives {
  @Column("character varying", {
    primary: true,
    name: "criteria_code",
    length: 10,
  })
  criteriaCode: string;

  @Column("character varying", { primary: true, name: "media_code", length: 6 })
  mediaCode: string;

  @Column("character varying", {
    primary: true,
    name: "contaminant_code",
    length: 50,
  })
  contaminantCode: string;

  @Column("character varying", {
    primary: true,
    name: "remed_site_use_code",
    length: 6,
  })
  remedSiteUseCode: string;

  @Column("character varying", {
    primary: true,
    name: "protcat_code",
    length: 40,
  })
  protcatCode: string;

  @Column("character varying", {
    primary: true,
    name: "activity_code",
    length: 6,
  })
  activityCode: string;

  @Column("character varying", { name: "ph_range", nullable: true, length: 15 })
  phRange: string | null;

  @Column("bigint", { primary: true, name: "level_value" })
  levelValue: string;

  @Column("character varying", { name: "units", length: 10 })
  units: string;

  @ManyToOne(() => ActivityCd, (activityCd) => activityCd.matrixObjectives)
  @JoinColumn([{ name: "activity_code", referencedColumnName: "code" }])
  activityCode2: ActivityCd;

  @ManyToOne(() => ContamCd, (contamCd) => contamCd.matrixObjectives)
  @JoinColumn([
    { name: "contaminant_code", referencedColumnName: "contaminant" },
  ])
  contaminantCode2: ContamCd;

  @ManyToOne(() => CriteriaCd, (criteriaCd) => criteriaCd.matrixObjectives)
  @JoinColumn([{ name: "criteria_code", referencedColumnName: "code" }])
  criteriaCode2: CriteriaCd;

  @ManyToOne(() => MediaCd, (mediaCd) => mediaCd.matrixObjectives)
  @JoinColumn([{ name: "media_code", referencedColumnName: "code" }])
  mediaCode2: MediaCd;

  @ManyToOne(
    () => ProtectionCategoryCd,
    (protectionCategoryCd) => protectionCategoryCd.matrixObjectives
  )
  @JoinColumn([{ name: "protcat_code", referencedColumnName: "code" }])
  protcatCode2: ProtectionCategoryCd;

  @ManyToOne(
    () => RemedSiteUseCd,
    (remedSiteUseCd) => remedSiteUseCd.matrixObjectives
  )
  @JoinColumn([{ name: "remed_site_use_code", referencedColumnName: "code" }])
  remedSiteUseCode2: RemedSiteUseCd;
}
