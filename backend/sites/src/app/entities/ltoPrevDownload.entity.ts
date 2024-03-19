import { Column, Entity } from "typeorm";

@Entity("lto_prev_download", { schema: "public" })
export class LtoPrevDownload {
  @Column("character varying", { name: "pid", length: 9 })
  pid: string;

  @Column("character varying", {
    name: "pid_status_cd",
    nullable: true,
    length: 1,
  })
  pidStatusCd: string | null;

  @Column("character varying", {
    name: "legal_description",
    nullable: true,
    length: 255,
  })
  legalDescription: string | null;

  @Column("character varying", { name: "child_pid", nullable: true, length: 9 })
  childPid: string | null;

  @Column("character varying", {
    name: "child_pid_status_cd",
    nullable: true,
    length: 1,
  })
  childPidStatusCd: string | null;

  @Column("character varying", {
    name: "child_legal_description",
    nullable: true,
    length: 255,
  })
  childLegalDescription: string | null;
}
