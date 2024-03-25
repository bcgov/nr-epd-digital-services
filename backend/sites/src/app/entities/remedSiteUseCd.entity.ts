import { Column, Entity, Index, OneToMany } from "typeorm";
import { AecRemedApproaches } from "./aecRemedApproaches.entity";
import { CriteriaLevelCd } from "./criteriaLevelCd.entity";
import { MatrixObjectives } from "./matrixObjectives.entity";
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Index("remed_site_use_cd_pkey", ["code"], { unique: true })
@Entity("remed_site_use_cd")
export class RemedSiteUseCd {
  @Field()
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Field()
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
