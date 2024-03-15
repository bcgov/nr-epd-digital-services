import { Column, Entity, Index, OneToMany } from "typeorm";
import { CriteriaLevelCd } from "./criteriaLevelCd";
import { LoadMeasurements } from "./loadMeasurements";
import { MatrixObjectives } from "./matrixObjectives";
import { Measurements } from "./measurements";

@Index("contam_cd_pkey", ["contaminant"], { unique: true })
@Entity("contam_cd", { schema: "public" })
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
    () => LoadMeasurements,
    (loadMeasurements) => loadMeasurements.contaminantCd
  )
  loadMeasurements: LoadMeasurements[];

  @OneToMany(
    () => MatrixObjectives,
    (matrixObjectives) => matrixObjectives.contaminantCode2
  )
  matrixObjectives: MatrixObjectives[];

  @OneToMany(() => Measurements, (measurements) => measurements.contaminantCd2)
  measurements: Measurements[];
}
