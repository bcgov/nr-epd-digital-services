import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { ContaminationClassCd } from "./contaminationClassCd";
import { SiteCrownLandContaminated } from "./siteCrownLandContaminated";

@Index(
  "site_contamination_class_xref_pkey",
  ["contaminationClassCode", "sclcId"],
  { unique: true }
)
@Entity("site_contamination_class_xref", { schema: "public" })
export class SiteContaminationClassXref {
  @Column("bigint", { primary: true, name: "sclc_id" })
  sclcId: string;

  @Column("character varying", {
    primary: true,
    name: "contamination_class_code",
    length: 6,
  })
  contaminationClassCode: string;

  @Column("character varying", { name: "who_created", length: 30 })
  whoCreated: string;

  @Column("character varying", {
    name: "who_updated",
    nullable: true,
    length: 30,
  })
  whoUpdated: string | null;

  @Column("timestamp without time zone", { name: "when_created" })
  whenCreated: Date;

  @Column("timestamp without time zone", {
    name: "when_updated",
    nullable: true,
  })
  whenUpdated: Date | null;

  @ManyToOne(
    () => ContaminationClassCd,
    (contaminationClassCd) => contaminationClassCd.siteContaminationClassXrefs
  )
  @JoinColumn([
    { name: "contamination_class_code", referencedColumnName: "code" },
  ])
  contaminationClassCode2: ContaminationClassCd;

  @ManyToOne(
    () => SiteCrownLandContaminated,
    (siteCrownLandContaminated) =>
      siteCrownLandContaminated.siteContaminationClassXrefs,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "sclc_id", referencedColumnName: "id" }])
  sclc: SiteCrownLandContaminated;
}
