import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { LandUseCd } from "./landUseCd.entity";
import { Sites } from "./sites.entity";

@Index("land_histories_pkey", ["lutCode", "siteId"], { unique: true })
@Index("sluh_described_by_frgn", ["lutCode"], {})
@Index("sluh_rwm_flag", ["rwmFlag"], {})
@Index("sluh_rwm_note_flag", ["rwmNoteFlag"], {})
@Index("sluh_applicable_to_frgn", ["siteId"], {})
@Entity("land_histories", { schema: "public" })
export class LandHistories {
  @Column("bigint", { primary: true, name: "site_id" })
  siteId: string;

  @Column("character varying", { primary: true, name: "lut_code", length: 6 })
  lutCode: string;

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

  @Column("smallint", { name: "rwm_note_flag" })
  rwmNoteFlag: number;

  @Column("character", { name: "site_profile", nullable: true, length: 1 })
  siteProfile: string | null;

  @Column("timestamp without time zone", {
    name: "profile_date_received",
    nullable: true,
  })
  profileDateReceived: Date | null;

  @ManyToOne(() => LandUseCd, (landUseCd) => landUseCd.landHistories)
  @JoinColumn([{ name: "lut_code", referencedColumnName: "code" }])
  lutCode2: LandUseCd;

  @ManyToOne(() => Sites, (sites) => sites.landHistories, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "site_id", referencedColumnName: "id" }])
  site: Sites;
}
