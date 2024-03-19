import { Column, Entity, Index, OneToMany } from "typeorm";
import { Sites } from "./sites.entity";

@Index("classification_cd_pkey", ["code"], { unique: true })
@Entity("classification_cd", { schema: "public" })
export class ClassificationCd {
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Column("character varying", { name: "description", length: 40 })
  description: string;

  @OneToMany(() => Sites, (sites) => sites.classCode2)
  sites: Sites[];
}
