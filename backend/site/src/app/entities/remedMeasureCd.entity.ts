import { Column, Entity, Index, OneToMany } from "typeorm";
import { AecRemedMeasures } from "./aecRemedMeasures";

@Index("remed_measure_cd_pkey", ["code"], { unique: true })
@Entity("remed_measure_cd", { schema: "public" })
export class RemedMeasureCd {
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Column("character varying", { name: "description", length: 40 })
  description: string;

  @OneToMany(
    () => AecRemedMeasures,
    (aecRemedMeasures) => aecRemedMeasures.remedMeasureCd2
  )
  aecRemedMeasures: AecRemedMeasures[];
}
