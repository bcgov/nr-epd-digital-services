import { Column, Entity, Index, OneToMany } from "typeorm";
import { CriteriaLevelCd } from "./criteriaLevelCd.entity";
import { MatrixObjectives } from "./matrixObjectives.entity";
import { Measurements } from "./measurements.entity";

@Index("contam_cd_pkey", ["contaminant"], { unique: true })
@Entity("contam_cd")
export class ContamCd {
  @Column("character varying", {
    primary: true,
    name: "contaminant",
    length: 50,
  })
  contaminant: string;

  @OneToMany(
    () => CriteriaLevelCd,
    (criteriaLevelCd) => criteriaLevelCd.contaminantCode2
  )
  criteriaLevelCds: CriteriaLevelCd[];

  @OneToMany(
    () => MatrixObjectives,
    (matrixObjectives) => matrixObjectives.contaminantCode2
  )
  matrixObjectives: MatrixObjectives[];

  @OneToMany(() => Measurements, (measurements) => measurements.contaminantCd2)
  measurements: Measurements[];
}
