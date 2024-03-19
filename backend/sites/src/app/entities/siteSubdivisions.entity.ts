import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Sites } from "./sites.entity";

@Index(
  "site_subdivisions_site_id_subdiv_id_sprof_date_completed_key",
  ["siteId", "sprofDateCompleted", "subdivId"],
  { unique: true }
)
@Index("sitesub_part_or_all_of_frgn", ["siteId"], {})
@Index("site_subdivisions_pkey", ["siteSubdivId"], { unique: true })
@Index("sitesub_for_profile", ["sprofDateCompleted"], {})
@Index("sitesub_comprised_of_frgn", ["subdivId"], {})
@Entity("site_subdivisions", { schema: "public" })
export class SiteSubdivisions {
  @Column("bigint", { name: "site_id", unique: true })
  siteId: string;

  @Column("bigint", { name: "subdiv_id", unique: true })
  subdivId: string;

  @Column("timestamp without time zone", { name: "date_noted" })
  dateNoted: Date;

  @Column("character varying", { name: "initial_indicator", length: 1 })
  initialIndicator: string;

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

  @Column("timestamp without time zone", {
    name: "sprof_date_completed",
    nullable: true,
    unique: true,
  })
  sprofDateCompleted: Date | null;

  @Column("bigint", { primary: true, name: "site_subdiv_id" })
  siteSubdivId: string;

  @Column("character varying", { name: "send_to_sr", length: 1 })
  sendToSr: string;

  @ManyToOne(() => Sites, (sites) => sites.siteSubdivisions, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "site_id", referencedColumnName: "id" }])
  site: Sites;
}
