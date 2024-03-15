import { Column, Entity } from "typeorm";

@Entity("site_crown_land_contaminatedbk", { schema: "public" })
export class SiteCrownLandContaminatedbk {
  @Column("bigint", { name: "id" })
  id: string;

  @Column("character varying", {
    name: "site_crown_land_status_code",
    length: 6,
  })
  siteCrownLandStatusCode: string;

  @Column("bigint", { name: "sp_id" })
  spId: string;

  @Column("double precision", {
    name: "estimated_cost_of_remediations",
    precision: 53,
  })
  estimatedCostOfRemediations: number;

  @Column("double precision", {
    name: "actual_cost_of_remediations",
    nullable: true,
    precision: 53,
  })
  actualCostOfRemediations: number | null;

  @Column("character varying", {
    name: "contamination_other_desc",
    nullable: true,
    length: 50,
  })
  contaminationOtherDesc: string | null;

  @Column("character varying", { name: "who_created", length: 30 })
  whoCreated: string;

  @Column("character varying", {
    name: "who_updated",
    nullable: true,
    length: 30,
    default: () => "statement_timestamp()",
  })
  whoUpdated: string | null;

  @Column("timestamp without time zone", { name: "when_created" })
  whenCreated: Date;

  @Column("timestamp without time zone", {
    name: "when_updated",
    nullable: true,
    default: () => "statement_timestamp()",
  })
  whenUpdated: Date | null;
}
