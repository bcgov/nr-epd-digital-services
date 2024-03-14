import { Column, Entity, Index } from "typeorm";

@Index("aec_remed_measures_pkey", ["aecremId", "remedMeasureCd"], {
  unique: true,
})
@Index("aecremmea_remmea_cd_indx", ["remedMeasureCd"], {})
@Index("aecremmea_sites_frgn", ["siteId"], {})
@Entity("aec_remed_measures", { schema: "public" })
export class AecRemedMeasures {
  @Column("bigint", { name: "site_id" })
  siteId: string;

  @Column("bigint", { primary: true, name: "aecrem_id" })
  aecremId: string;

  @Column("character varying", {
    primary: true,
    name: "remed_measure_cd",
    length: 6,
  })
  remedMeasureCd: string;

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
}
