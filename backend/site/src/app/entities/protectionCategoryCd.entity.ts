import { Column, Entity, Index } from "typeorm";

@Index("protection_category_cd_pkey", ["code"], { unique: true })
@Entity("protection_category_cd", { schema: "public" })
export class ProtectionCategoryCd {
  @Column("character varying", { primary: true, name: "code", length: 40 })
  code: string;
}
