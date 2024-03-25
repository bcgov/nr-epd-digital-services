import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { ContamCd } from "./contamCd.entity";
import { MediaCd } from "./mediaCd.entity";
import { MeasurementPopulations } from "./measurementPopulations.entity";

@ObjectType()
@Index("msmt_contam_ind", ["contaminantCd"], {})
@Index("measurements_pkey", ["contaminantCd", "mediaCd", "msmtPopId"], {
  unique: true,
})
@Index("msmt_media_ind", ["mediaCd"], {})
@Entity("measurements")
export class Measurements {
  @Field()
  @Column("bigint", { primary: true, name: "msmt_pop_id" })
  msmtPopId: string;

  @Field()
  @Column("character varying", { primary: true, name: "media_cd", length: 6 })
  mediaCd: string;

  @Field()
  @Column("character varying", {
    primary: true,
    name: "contaminant_cd",
    length: 50,
  })
  contaminantCd: string;

  @Field()
  @Column("smallint", { name: "nsamples" })
  nsamples: number;

  @Field()
  @Column("bigint", { name: "low_value" })
  lowValue: string;

  @Field()
  @Column("bigint", { name: "high_value" })
  highValue: string;

  @Field()
  @Column("bigint", { name: "percent_90" })
  percent_90: string;

  @Field()
  @Column("bigint", { name: "mean" })
  mean: string;

  @Field()
  @Column("bigint", { name: "standard_deviation" })
  standardDeviation: string;

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

  @ManyToOne(() => ContamCd, (contamCd) => contamCd.measurements)
  @JoinColumn([{ name: "contaminant_cd", referencedColumnName: "contaminant" }])
  contaminantCd2: ContamCd;

  @ManyToOne(() => MediaCd, (mediaCd) => mediaCd.measurements)
  @JoinColumn([{ name: "media_cd", referencedColumnName: "code" }])
  mediaCd2: MediaCd;

  @ManyToOne(
    () => MeasurementPopulations,
    (measurementPopulations) => measurementPopulations.measurements
  )
  @JoinColumn([{ name: "msmt_pop_id", referencedColumnName: "id" }])
  msmtPop: MeasurementPopulations;
}
