import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from "typeorm";
import { SiteParticRoles } from "./siteParticRoles.entity";

@ObjectType()
@Index("partic_role_cd_pkey", ["code"], { unique: true })
@Entity("partic_role_cd")
export class ParticRoleCd {
  @Field()
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Field()
  @Column("character varying", { name: "description", length: 40 })
  description: string;

  @OneToMany(
    () => SiteParticRoles,
    (siteParticRoles) => siteParticRoles.prCode2
  )
  siteParticRoles: SiteParticRoles[];
}
