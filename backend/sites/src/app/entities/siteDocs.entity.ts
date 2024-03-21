import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { DocAbstracts } from "./docAbstracts.entity";
import { MeasurementPopulations } from "./measurementPopulations.entity";
import { SiteDocPartics } from "./siteDocPartics.entity";
import { Sites } from "./sites.entity";

@Index("site_docs_pkey", ["id"], { unique: true })
@Index("sdoc_rwm_flag", ["rwmFlag"], {})
@Index("sdoc_about_frgn", ["siteId"], {})
@Entity("site_docs")
export class SiteDocs {
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Column("bigint", { name: "site_id" })
  siteId: string;

  @Column("timestamp without time zone", { name: "submission_date" })
  submissionDate: Date;

  @Column("timestamp without time zone", {
    name: "document_date",
    nullable: true,
  })
  documentDate: Date | null;

  @Column("character varying", { name: "title", length: 150 })
  title: string;

  @Column("character varying", { name: "note", nullable: true, length: 255 })
  note: string | null;

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

  @Column("smallint", { name: "rwm_flag" })
  rwmFlag: number;

  @Column("smallint", { name: "rwm_note_flag", nullable: true })
  rwmNoteFlag: number | null;

  @OneToOne(() => DocAbstracts, (docAbstracts) => docAbstracts.sdoc)
  docAbstracts: DocAbstracts;

  @OneToMany(
    () => MeasurementPopulations,
    (measurementPopulations) => measurementPopulations.sdoc
  )
  measurementPopulations: MeasurementPopulations[];

  @OneToMany(() => SiteDocPartics, (siteDocPartics) => siteDocPartics.sdoc)
  siteDocPartics: SiteDocPartics[];

  @ManyToOne(() => Sites, (sites) => sites.siteDocs, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "site_id", referencedColumnName: "id" }])
  site: Sites;
}
