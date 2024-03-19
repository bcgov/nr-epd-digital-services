import { Column, Entity, Index, OneToMany } from "typeorm";
import { AecRemedApproaches } from "./aecRemedApproaches.entity";
import { CriteriaLevelCd } from "./criteriaLevelCd.entity";
import { MatrixObjectives } from "./matrixObjectives.entity";

@Index("criteria_cd_pkey", ["code"], { unique: true })
@Entity("criteria_cd", { schema: "public" })
export class CriteriaCd {
  @Column("character varying", { primary: true, name: "code", length: 10 })
  code: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 100,
  })
  description: string | null;

  @OneToMany(
    () => AecRemedApproaches,
    (aecRemedApproaches) => aecRemedApproaches.criteriaCode2
  )
  aecRemedApproaches: AecRemedApproaches[];

  @OneToMany(
    () => CriteriaLevelCd,
    (criteriaLevelCd) => criteriaLevelCd.criteriaCd2
  )
  criteriaLevelCds: CriteriaLevelCd[];

  @OneToMany(
    () => MatrixObjectives,
    (matrixObjectives) => matrixObjectives.criteriaCode2
  )
  matrixObjectives: MatrixObjectives[];
}
