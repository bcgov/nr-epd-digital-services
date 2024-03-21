import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Events } from "./events.entity";

@Index("ctext_applied_to", ["eventId"], {})
@Index("ctext_rwm_flag", ["rwmFlag"], {})
@Entity("conditions_text", { schema: "public" })
export class ConditionsText {
  @Column("bigint", { primary: true, name: "event_id" })
  eventId: string;

  @Column("character varying", { name: "conditions_comment", length: 2000 })
  conditionsComment: string;

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

  @ManyToOne(() => Events, (events) => events.conditionsTexts, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Events;
}
