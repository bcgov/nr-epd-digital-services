import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { AecPcocs } from "./aecPcocs.entity";
import { ContamCd } from "./contamCd.entity";
import { CriteriaCd } from "./criteriaCd.entity";
import { MediaCd } from "./mediaCd.entity";
import { RemedSiteUseCd } from "./remedSiteUseCd.entity";

@Index(
  "criteria_code_table_ind",
  ["contaminantCode", "criteriaCd", "levelCode", "mediaCd", "remedSiteUseCd"],
  { unique: true }
)
@Index("criteria_contam_cd_frgn", ["contaminantCode"], {})
@Index(
  "criteria_level_cd_pkey",
  ["contaminantCode", "criteriaCd", "levelCode", "mediaCd"],
  { unique: true }
)
@Index(
  "criteria_code_use_ind",
  ["contaminantCode", "criteriaCd", "mediaCd", "remedSiteUseCd"],
  {}
)
@Index("criteria_code_ind", ["criteriaCd"], {})
@Index("criteria_media_cd_frgn", ["mediaCd"], {})
@Index("criteria_remed_use_frgn", ["remedSiteUseCd"], {})
@Entity("criteria_level_cd")
export class CriteriaLevelCd {
  @Column("character varying", {
    primary: true,
    name: "contaminant_code",
    length: 50,
  })
  contaminantCode: string;

  @Column("character varying", {
    primary: true,
    name: "criteria_cd",
    length: 10,
  })
  criteriaCd: string;

  @Column("character varying", { primary: true, name: "media_cd", length: 6 })
  mediaCd: string;

  @Column("character varying", { primary: true, name: "level_code", length: 6 })
  levelCode: string;

  @Column("character varying", {
    name: "remed_site_use_cd",
    nullable: true,
    length: 6,
  })
  remedSiteUseCd: string | null;

  @Column("bigint", { name: "lower_level", nullable: true })
  lowerLevel: string | null;

  @Column("bigint", { name: "upper_level", nullable: true })
  upperLevel: string | null;

  @Column("character varying", { name: "units", nullable: true, length: 10 })
  units: string | null;

  @Column("character varying", { name: "level_description", length: 80 })
  levelDescription: string;

  @OneToMany(() => AecPcocs, (aecPcocs) => aecPcocs.criteriaLevelCd)
  aecPcocs: AecPcocs[];

  @ManyToOne(() => ContamCd, (contamCd) => contamCd.criteriaLevelCds)
  @JoinColumn([
    { name: "contaminant_code", referencedColumnName: "contaminant" },
  ])
  contaminantCode2: ContamCd;

  @ManyToOne(() => CriteriaCd, (criteriaCd) => criteriaCd.criteriaLevelCds)
  @JoinColumn([{ name: "criteria_cd", referencedColumnName: "code" }])
  criteriaCd2: CriteriaCd;

  @ManyToOne(() => MediaCd, (mediaCd) => mediaCd.criteriaLevelCds)
  @JoinColumn([{ name: "media_cd", referencedColumnName: "code" }])
  mediaCd2: MediaCd;

  @ManyToOne(
    () => RemedSiteUseCd,
    (remedSiteUseCd) => remedSiteUseCd.criteriaLevelCds
  )
  @JoinColumn([{ name: "remed_site_use_cd", referencedColumnName: "code" }])
  remedSiteUseCd2: RemedSiteUseCd;
}
