import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from "typeorm";
import { AecSources } from "./aecSources.entity";

@ObjectType
@Index("source_cd_pkey", ["code"], { unique: true })
@Entity("source_cd")
export class SourceCd {
  @Field
  @Column("character varying", { primary: true, name: "code", length: 80 })
  code: string;

  @OneToMany(() => AecSources, (aecSources) => aecSources.sourceCd2)
  aecSources: AecSources[];
}
