import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { AecPcocs } from "./aecPcocs";
import { AecRemedApproaches } from "./aecRemedApproaches";
import { Sites } from "./sites";

@Index("aecremitems_pcoc_frgn", ["aecpcocId"], {})
@Index("aec_remed_items_pkey", ["aecpcocId", "aecremappId"], { unique: true })
@Index("aecremitems_remed_frgn", ["aecremId"], {})
@Index("aecremitems_sites_frgn", ["siteId"], {})
@Entity("aec_remed_items", { schema: "public" })
export class AecRemedItems {
  @Column("bigint", { primary: true, name: "aecremapp_id" })
  aecremappId: string;

  @Column("bigint", { primary: true, name: "aecpcoc_id" })
  aecpcocId: string;

  @Column("bigint", { name: "site_id" })
  siteId: string;

  @Column("bigint", { name: "aecrem_id" })
  aecremId: string;

  @Column("character varying", {
    name: "protection_category",
    nullable: true,
    length: 40,
  })
  protectionCategory: string | null;

  @Column("character varying", { name: "activity", nullable: true, length: 80 })
  activity: string | null;

  @Column("bigint", { name: "target_level", nullable: true })
  targetLevel: string | null;

  @Column("character varying", { name: "unit", nullable: true, length: 10 })
  unit: string | null;

  @Column("character varying", { name: "compound", nullable: true, length: 40 })
  compound: string | null;

  @Column("character varying", {
    name: "risk_objective",
    nullable: true,
    length: 40,
  })
  riskObjective: string | null;

  @Column("bigint", { name: "risk_calculated", nullable: true })
  riskCalculated: string | null;

  @Column("bigint", { name: "risk_remediated", nullable: true })
  riskRemediated: string | null;

  @Column("character varying", {
    name: "hazard_objective",
    nullable: true,
    length: 40,
  })
  hazardObjective: string | null;

  @Column("bigint", { name: "hazard_calculated", nullable: true })
  hazardCalculated: string | null;

  @Column("bigint", { name: "hazard_remediated", nullable: true })
  hazardRemediated: string | null;

  @Column("character varying", {
    name: "risk_assessment_activity",
    nullable: true,
    length: 80,
  })
  riskAssessmentActivity: string | null;

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

  @ManyToOne(() => AecPcocs, (aecPcocs) => aecPcocs.aecRemedItems)
  @JoinColumn([{ name: "aecpcoc_id", referencedColumnName: "id" }])
  aecpcoc: AecPcocs;

  @ManyToOne(
    () => AecRemedApproaches,
    (aecRemedApproaches) => aecRemedApproaches.aecRemedItems
  )
  @JoinColumn([{ name: "aecremapp_id", referencedColumnName: "id" }])
  aecremapp: AecRemedApproaches;

  @ManyToOne(() => Sites, (sites) => sites.aecRemedItems)
  @JoinColumn([{ name: "site_id", referencedColumnName: "id" }])
  site: Sites;
}
