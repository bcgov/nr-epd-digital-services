import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ContamCd } from "./contamCd.entity";
import { MediaCd } from "./mediaCd.entity";

@Entity("load_measurements", { schema: "public" })
export class LoadMeasurements {
  @Column("bigint", { name: "msmt_pop_id", nullable: true })
  msmtPopId: string | null;

  @Column("smallint", { name: "nsamples", nullable: true })
  nsamples: number | null;

  @Column("bigint", { name: "low_value", nullable: true })
  lowValue: string | null;

  @Column("bigint", { name: "high_value", nullable: true })
  highValue: string | null;

  @Column("bigint", { name: "percent_90", nullable: true })
  percent_90: string | null;

  @Column("bigint", { name: "mean", nullable: true })
  mean: string | null;

  @Column("bigint", { name: "standard_deviation", nullable: true })
  standardDeviation: string | null;

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

  @ManyToOne(() => ContamCd, (contamCd) => contamCd.loadMeasurements)
  @JoinColumn([{ name: "contaminant_cd", referencedColumnName: "contaminant" }])
  contaminantCd: ContamCd;

  @ManyToOne(() => MediaCd, (mediaCd) => mediaCd.loadMeasurements)
  @JoinColumn([{ name: "media_cd", referencedColumnName: "code" }])
  mediaCd: MediaCd;
}
