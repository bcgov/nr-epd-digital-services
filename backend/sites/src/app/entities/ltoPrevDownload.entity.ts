import { Column, Entity } from "typeorm";
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity("lto_prev_download")
export class LtoPrevDownload {
  @Field()
  @Column("character varying", { primary: true, name: "pid", length: 9 })
  pid: string;

  @Field()
  @Column("character varying", {
    name: "pid_status_cd",
    nullable: true,
    length: 1,
  })
  pidStatusCd: string | null;

  @Field()
  @Column("character varying", {
    name: "legal_description",
    nullable: true,
    length: 255,
  })
  legalDescription: string | null;

  @Field()
  @Column("character varying", { name: "child_pid", nullable: true, length: 9 })
  childPid: string | null;

  @Field()
  @Column("character varying", {
    name: "child_pid_status_cd",
    nullable: true,
    length: 1,
  })
  childPidStatusCd: string | null;

  @Field()
  @Column("character varying", {
    name: "child_legal_description",
    nullable: true,
    length: 255,
  })
  childLegalDescription: string | null;
}
