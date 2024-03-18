import { Column, Entity, Index, OneToMany } from "typeorm";
import { AecMedias } from "./aecMedias.entity";
import { AecRemediations } from "./aecRemediations.entity";
import { CriteriaLevelCd } from "./criteriaLevelCd.entity";
import { LoadMeasurements } from "./loadMeasurements.entity";
import { MatrixObjectives } from "./matrixObjectives.entity";
import { Measurements } from "./measurements.entity";

@Index("media_cd_pkey", ["code"], { unique: true })
@Entity("media_cd", { schema: "public" })
export class MediaCd {
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Column("character varying", { name: "description", length: 40 })
  description: string;

  @OneToMany(() => AecMedias, (aecMedias) => aecMedias.mediaCd2)
  aecMedias: AecMedias[];

  @OneToMany(
    () => AecRemediations,
    (aecRemediations) => aecRemediations.mediaCode2
  )
  aecRemediations: AecRemediations[];

  @OneToMany(
    () => CriteriaLevelCd,
    (criteriaLevelCd) => criteriaLevelCd.mediaCd2
  )
  criteriaLevelCds: CriteriaLevelCd[];

  @OneToMany(
    () => LoadMeasurements,
    (loadMeasurements) => loadMeasurements.mediaCd
  )
  loadMeasurements: LoadMeasurements[];

  @OneToMany(
    () => MatrixObjectives,
    (matrixObjectives) => matrixObjectives.mediaCode2
  )
  matrixObjectives: MatrixObjectives[];

  @OneToMany(() => Measurements, (measurements) => measurements.mediaCd2)
  measurements: Measurements[];
}
