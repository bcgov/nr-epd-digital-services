import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from "typeorm";
import { Sites } from "./sites.entity";

@ObjectType()
@Index("classification_cd_pkey", ["code"], { unique: true })
@Entity("classification_cd")
export class ClassificationCd {
  @Field()
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Field()
  @Column("character varying", { name: "description", length: 40 })
  description: string;

  @OneToMany(() => Sites, (sites) => sites.classCode2)
  sites: Sites[];
}
