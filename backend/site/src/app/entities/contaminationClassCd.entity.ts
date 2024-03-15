import { Column, Entity, Index, OneToMany } from "typeorm";
import { SiteContaminationClassXref } from "./siteContaminationClassXref";

@Index("contamination_class_cd_pkey", ["code"], { unique: true })
@Entity("contamination_class_cd", { schema: "public" })
export class ContaminationClassCd {
  @Column("character varying", { primary: true, name: "code", length: 6 })
  code: string;

  @Column("character varying", { name: "description", length: 140 })
  description: string;

  @OneToMany(
    () => SiteContaminationClassXref,
    (siteContaminationClassXref) =>
      siteContaminationClassXref.contaminationClassCode2
  )
  siteContaminationClassXrefs: SiteContaminationClassXref[];
}
