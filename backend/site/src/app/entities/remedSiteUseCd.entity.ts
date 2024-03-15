import { Column, Entity, Index, OneToMany } from "typeorm";
import { AecRemedApproaches } from "./aecRemedApproaches";
import { CriteriaLevelCd } from "./criteriaLevelCd";
import { MatrixObjectives } from "./matrixObjectives";

@Index("remed_site_use_cd_pkey", ["code"], { unique: true })
@Entity("remed_site_use_cd", { schema: "public" })
export class RemedSiteUseCd {
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Column("character varying", { name: "description", length: 40 })
  description: string;

  @OneToMany(
    () => AecRemedApproaches,
    (aecRemedApproaches) => aecRemedApproaches.remedSiteUseCode2
  )
  aecRemedApproaches: AecRemedApproaches[];

  @OneToMany(
    () => CriteriaLevelCd,
    (criteriaLevelCd) => criteriaLevelCd.remedSiteUseCd2
  )
  criteriaLevelCds: CriteriaLevelCd[];

  @OneToMany(
    () => MatrixObjectives,
    (matrixObjectives) => matrixObjectives.remedSiteUseCode2
  )
  matrixObjectives: MatrixObjectives[];
}
