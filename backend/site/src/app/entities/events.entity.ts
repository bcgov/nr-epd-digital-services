import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { ConditionsText } from "./conditionsText.entity";
import { EventPartics } from "./eventPartics.entity";
import { EventTypeCd } from "./eventTypeCd.entity";
import { Sites } from "./sites.entity";

@Index("event_described_by_frgn", ["eclsCode", "etypCode"], {})
@Index("events_pkey", ["id"], { unique: true })
@Index("event_psnorg_frgn", ["psnorgId"], {})
@Index("event_rwm_flag", ["rwmFlag"], {})
@Index("event_rwm_note_flag", ["rwmNoteFlag"], {})
@Index("event_applicable_to_frgn", ["siteId"], {})
@Index("event_responsibility_of_frgn", ["spId"], {})
@Entity("events", { schema: "public" })
export class Events {
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Column("bigint", { name: "site_id" })
  siteId: string;

  @Column("timestamp without time zone", { name: "event_date" })
  eventDate: Date;

  @Column("timestamp without time zone", {
    name: "completion_date",
    nullable: true,
  })
  completionDate: Date | null;

  @Column("character varying", { name: "etyp_code", length: 6 })
  etypCode: string;

  @Column("bigint", { name: "psnorg_id" })
  psnorgId: string;

  @Column("bigint", { name: "sp_id" })
  spId: string;

  @Column("character varying", { name: "note", nullable: true, length: 500 })
  note: string | null;

  @Column("character varying", {
    name: "region_app_flag",
    nullable: true,
    length: 1,
  })
  regionAppFlag: string | null;

  @Column("character varying", {
    name: "region_userid",
    nullable: true,
    length: 16,
  })
  regionUserid: string | null;

  @Column("timestamp without time zone", {
    name: "region_date",
    nullable: true,
  })
  regionDate: Date | null;

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

  @Column("timestamp without time zone", {
    name: "rwm_approval_date",
    nullable: true,
  })
  rwmApprovalDate: Date | null;

  @Column("character varying", { name: "ecls_code", length: 6 })
  eclsCode: string;

  @Column("timestamp without time zone", {
    name: "requirement_due_date",
    nullable: true,
  })
  requirementDueDate: Date | null;

  @Column("timestamp without time zone", {
    name: "requirement_received_date",
    nullable: true,
  })
  requirementReceivedDate: Date | null;

  @OneToMany(() => ConditionsText, (conditionsText) => conditionsText.event)
  conditionsTexts: ConditionsText[];

  @OneToMany(() => EventPartics, (eventPartics) => eventPartics.event)
  eventPartics: EventPartics[];

  @ManyToOne(() => EventTypeCd, (eventTypeCd) => eventTypeCd.events)
  @JoinColumn([
    { name: "etyp_code", referencedColumnName: "code" },
    { name: "ecls_code", referencedColumnName: "eclsCode" },
  ])
  eventTypeCd: EventTypeCd;

  @ManyToOne(() => Sites, (sites) => sites.events, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "site_id", referencedColumnName: "id" }])
  site: Sites;
}