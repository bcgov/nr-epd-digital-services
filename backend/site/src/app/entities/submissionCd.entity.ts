import { Column, Entity, Index, OneToMany } from "typeorm";
import { ProfileSubmissions } from "./profileSubmissions";

@Index("submission_cd_pkey", ["code"], { unique: true })
@Entity("submission_cd", { schema: "public" })
export class SubmissionCd {
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Column("character varying", { name: "description", length: 40 })
  description: string;

  @Column("character varying", { name: "used_in", length: 4 })
  usedIn: string;

  @OneToMany(
    () => ProfileSubmissions,
    (profileSubmissions) => profileSubmissions.submcdCode2
  )
  profileSubmissions: ProfileSubmissions[];
}
