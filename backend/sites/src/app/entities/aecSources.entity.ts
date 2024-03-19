import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { AecAssessments } from "./aecAssessments.entity";
import { SourceCd } from "./sourceCd.entity";

@Index("aecsrce_assessment_frgn_frgn", ["aecassAreaId", "siteId"], {})
@Index("aec_sources_pkey", ["id"], { unique: true })
@Index("aecsrce_source_cd_frgn", ["sourceCd"], {})
@Entity("aec_sources", { schema: "public" })
export class AecSources {
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Column("bigint", { name: "site_id" })
  siteId: string;

  @Column("character varying", { name: "aecass_area_id", length: 40 })
  aecassAreaId: string;

  @Column("character varying", {
    name: "source_cd",
    nullable: true,
    length: 80,
  })
  sourceCd: string | null;

  @Column("character varying", {
    name: "who_created",
    nullable: true,
    length: 30,
  })
  whoCreated: string | null;

  @Column("character varying", {
    name: "who_updated",
    nullable: true,
    length: 30,
  })
  whoUpdated: string | null;

  @Column("timestamp without time zone", {
    name: "when_created",
    nullable: true,
  })
  whenCreated: Date | null;

  @Column("timestamp without time zone", {
    name: "when_updated",
    nullable: true,
  })
  whenUpdated: Date | null;

  @Column("smallint", { name: "rwm_flag" })
  rwmFlag: number;

  @ManyToOne(
    () => AecAssessments,
    (aecAssessments) => aecAssessments.aecSources
  )
  @JoinColumn([
    { name: "site_id", referencedColumnName: "siteId" },
    { name: "aecass_area_id", referencedColumnName: "areaId" },
  ])
  aecAssessments: AecAssessments;

  @ManyToOne(() => SourceCd, (sourceCd) => sourceCd.aecSources)
  @JoinColumn([{ name: "source_cd", referencedColumnName: "code" }])
  sourceCd2: SourceCd;
}
