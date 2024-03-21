import { Column, Entity, Index } from "typeorm";

@Index("sitereg_bco", ["regFlag", "siteId"], {})
@Index("site_registry_pkey", ["siteId"], { unique: true })
@Entity("site_registry")
export class SiteRegistry {
  @Column("bigint", { primary: true, name: "site_id" })
  siteId: string;

  @Column("smallint", { name: "reg_flag", nullable: true })
  regFlag: number | null;

  @Column("character varying", {
    name: "reg_userid",
    nullable: true,
    length: 16,
  })
  regUserid: string | null;

  @Column("timestamp without time zone", {
    name: "init_approval_date",
    nullable: true,
  })
  initApprovalDate: Date | null;

  @Column("timestamp without time zone", {
    name: "last_approval_date",
    nullable: true,
  })
  lastApprovalDate: Date | null;

  @Column("timestamp without time zone", {
    name: "tombstone_date",
    nullable: true,
  })
  tombstoneDate: Date | null;
}
