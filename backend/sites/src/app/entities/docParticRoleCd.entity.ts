import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from "typeorm";
import { SiteDocPartics } from "./siteDocPartics.entity";

@ObjectType()
@Index("doc_partic_role_cd_pkey", ["code"], { unique: true })
@Entity("doc_partic_role_cd")
export class DocParticRoleCd {
  @Field()
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Field()
  @Column("character varying", { name: "description", length: 40 })
  description: string;

  @OneToMany(() => SiteDocPartics, (siteDocPartics) => siteDocPartics.dprCode2)
  siteDocPartics: SiteDocPartics[];
}
