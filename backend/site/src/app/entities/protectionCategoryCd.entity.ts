import { Column, Entity, Index, OneToMany } from "typeorm";
import { ActivityCd } from "./activityCd";
import { MatrixObjectives } from "./matrixObjectives";

@Index("protection_category_cd_pkey", ["code"], { unique: true })
@Entity("protection_category_cd", { schema: "public" })
export class ProtectionCategoryCd {
  @Column("character varying", { primary: true, name: "code", length: 40 })
  code: string;

  @OneToMany(() => ActivityCd, (activityCd) => activityCd.protcatCode2)
  activityCds: ActivityCd[];

  @OneToMany(
    () => MatrixObjectives,
    (matrixObjectives) => matrixObjectives.protcatCode2
  )
  matrixObjectives: MatrixObjectives[];
}
