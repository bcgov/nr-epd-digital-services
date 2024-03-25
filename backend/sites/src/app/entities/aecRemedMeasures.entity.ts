import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { AecRemediations } from "./aecRemediations.entity";
import { RemedMeasureCd } from "./remedMeasureCd.entity";
import { Sites } from "./sites.entity";

@ObjectType()
@Index("aec_remed_measures_pkey", ["aecremId", "remedMeasureCd"], {
  unique: true,
})
@Index("aecremmea_remmea_cd_indx", ["remedMeasureCd"], {})
@Index("aecremmea_sites_frgn", ["siteId"], {})
@Entity("aec_remed_measures")
export class AecRemedMeasures {
  @Field()
  @Column("bigint", { name: "site_id" })
  siteId: string;

  @Field()
  @Column("bigint", { primary: true, name: "aecrem_id" })
  aecremId: string;

  @Field()
  @Column("character varying", {
    primary: true,
    name: "remed_measure_cd",
    length: 6,
  })
  remedMeasureCd: string;

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

  @ManyToOne(
    () => AecRemediations,
    (aecRemediations) => aecRemediations.aecRemedMeasures
  )
  @JoinColumn([{ name: "aecrem_id", referencedColumnName: "id" }])
  aecrem: AecRemediations;

  @ManyToOne(
    () => RemedMeasureCd,
    (remedMeasureCd) => remedMeasureCd.aecRemedMeasures
  )
  @JoinColumn([{ name: "remed_measure_cd", referencedColumnName: "code" }])
  remedMeasureCd2: RemedMeasureCd;

  @ManyToOne(() => Sites, (sites) => sites.aecRemedMeasures)
  @JoinColumn([{ name: "site_id", referencedColumnName: "id" }])
  site: Sites;
}
