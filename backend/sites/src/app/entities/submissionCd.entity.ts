import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from "typeorm";
import { ProfileSubmissions } from "./profileSubmissions.entity";

@ObjectType()
@Index("submission_cd_pkey", ["code"], { unique: true })
@Entity("submission_cd")
export class SubmissionCd {
  @Field()
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Field()
  @Column("character varying", { name: "description", length: 40 })
  description: string;

  @Field()
  @Column("character varying", { name: "used_in", length: 4 })
  usedIn: string;

  @OneToMany(
    () => ProfileSubmissions,
    (profileSubmissions) => profileSubmissions.submcdCode2
  )
  profileSubmissions: ProfileSubmissions[];
}
