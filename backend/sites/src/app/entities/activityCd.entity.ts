import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { ProtectionCategoryCd } from "./protectionCategoryCd.entity";
import { MatrixObjectives } from "./matrixObjectives.entity";

@ObjectType()
@Index("activity_cd_pkey", ["code"], { unique: true })
@Index("act_cd_act_prot_combined", ["code", "protcatCode"], { unique: true })
@Index("act_cd_protcat_frgn", ["protcatCode"], {})
@Entity("activity_cd")
export class ActivityCd {
  @Field()
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Field()
  @Column("character varying", { name: "protcat_code", length: 40 })
  protcatCode: string;

  @Field()
  @Column("character varying", { name: "description", length: 80 })
  description: string;

  @ManyToOne(
    () => ProtectionCategoryCd,
    (protectionCategoryCd) => protectionCategoryCd.activityCds
  )
  @JoinColumn([{ name: "protcat_code", referencedColumnName: "code" }])
  protcatCode2: ProtectionCategoryCd;

  @OneToMany(
    () => MatrixObjectives,
    (matrixObjectives) => matrixObjectives.activityCode2
  )
  matrixObjectives: MatrixObjectives[];
}
