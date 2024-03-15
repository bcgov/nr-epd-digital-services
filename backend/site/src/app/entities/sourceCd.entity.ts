import { Column, Entity, Index, OneToMany } from "typeorm";
import { AecSources } from "./aecSources";

@Index("source_cd_pkey", ["code"], { unique: true })
@Entity("source_cd", { schema: "public" })
export class SourceCd {
  @Column("character varying", { primary: true, name: "code", length: 80 })
  code: string;

  @OneToMany(() => AecSources, (aecSources) => aecSources.sourceCd2)
  aecSources: AecSources[];
}
