import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { AecPcocs } from "./aecPcocs.entity";
import { AecRemedApproaches } from "./aecRemedApproaches.entity";
import { Sites } from "./sites.entity";

@ObjectType()
@Index("aecremitems_pcoc_frgn", ["aecpcocId"], {})
@Index("aec_remed_items_pkey", ["aecpcocId", "aecremappId"], { unique: true })
@Index("aecremitems_remed_frgn", ["aecremId"], {})
@Index("aecremitems_sites_frgn", ["siteId"], {})
@Entity("aec_remed_items")
export class AecRemedItems {
  @Field()
  @Column("bigint", { primary: true, name: "aecremapp_id" })
  aecremappId: string;

  @Field()
  @Column("bigint", { primary: true, name: "aecpcoc_id" })
  aecpcocId: string;

  @Field()
  @Column("bigint", { name: "site_id" })
  siteId: string;

  @Field()
  @Column("bigint", { name: "aecrem_id" })
  aecremId: string;

  @Field()
  @Column("character varying", {
    name: "protection_category",
    nullable: true,
    length: 40,
  })
  protectionCategory: string | null;

  @Field()
  @Column("character varying", { name: "activity", nullable: true, length: 80 })
  activity: string | null;

  @Field()
  @Column("bigint", { name: "target_level", nullable: true })
  targetLevel: string | null;

  @Field()
  @Column("character varying", { name: "unit", nullable: true, length: 10 })
  unit: string | null;

  @Field()
  @Column("character varying", { name: "compound", nullable: true, length: 40 })
  compound: string | null;

  @Field()
  @Column("character varying", {
    name: "risk_objective",
    nullable: true,
    length: 40,
  })
  riskObjective: string | null;

  @Field()
  @Column("bigint", { name: "risk_calculated", nullable: true })
  riskCalculated: string | null;

  @Field()
  @Column("bigint", { name: "risk_remediated", nullable: true })
  riskRemediated: string | null;

  @Field()
  @Column("character varying", {
    name: "hazard_objective",
    nullable: true,
    length: 40,
  })
  hazardObjective: string | null;

  @Field()
  @Column("bigint", { name: "hazard_calculated", nullable: true })
  hazardCalculated: string | null;

  @Column("bigint", { name: "hazard_remediated", nullable: true })
  hazardRemediated: string | null;

  @Field()
  @Column("character varying", {
    name: "risk_assessment_activity",
    nullable: true,
    length: 80,
  })
  riskAssessmentActivity: string | null;

  @Field()
  @Column("character varying", { name: "who_created", length: 30 })
  whoCreated: string;

  @Field()
  @Column("timestamp without time zone", { name: "when_created" })
  whenCreated: Date;

  @Field()
  @Column("character varying", {
    name: "who_updated",
    nullable: true,
    length: 30,
  })
  whoUpdated: string | null;

  @Field()
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
