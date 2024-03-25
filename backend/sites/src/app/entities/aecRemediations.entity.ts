import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { AecRemedApproaches } from "./aecRemedApproaches.entity";
import { AecRemedMeasures } from "./aecRemedMeasures.entity";
import { MediaCd } from "./mediaCd.entity";
import { Sites } from "./sites.entity";

@ObjectType()
@Index("aec_remediations_pkey", ["id"], { unique: true })
@Index(
  "aec_remediations_site_id_plan_name_media_code_key",
  ["mediaCode", "planName", "siteId"],
  { unique: true }
)
@Index("aecrem_media_frgn", ["mediaCode"], {})
@Index("aecrem_sites_frgn", ["siteId"], {})
@Entity("aec_remediations")
export class AecRemediations {
  @Field()
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Field()
  @Column("bigint", { name: "site_id", unique: true })
  siteId: string;

  @Field()
  @Column("character varying", { name: "plan_name", unique: true, length: 40 })
  planName: string;

  @Field()
  @Column("character varying", { name: "media_code", unique: true, length: 6 })
  mediaCode: string;

  @Field()
  @Column("timestamp without time zone", { name: "plan_date", nullable: true })
  planDate: Date | null;

  @Field()
  @Column("character varying", {
    name: "remed_note",
    nullable: true,
    length: 2000,
  })
  remedNote: string | null;

  @Field()
  @Column("smallint", { name: "rwm_flag" })
  rwmFlag: number;

  @Field()
  @Column("smallint", { name: "rwm_note_flag" })
  rwmNoteFlag: number;

  @Field()
  @Column("character varying", { name: "who_created", length: 30 })
  whoCreated: string;

  @Field()
  @Column("timestamp without time zone", { name: "when_created" })
  whenCreated: Date;

  @Field()
  @Column("character varying", {
    name: "who_updated",
    nullable: true,
    length: 30,
  })
  whoUpdated: string | null;

  @Field()
  @Column("timestamp without time zone", {
    name: "when_updated",
    nullable: true,
  })
  whenUpdated: Date | null;

  @OneToMany(
    () => AecRemedApproaches,
    (aecRemedApproaches) => aecRemedApproaches.aecrem
  )
  aecRemedApproaches: AecRemedApproaches[];

  @OneToMany(
    () => AecRemedMeasures,
    (aecRemedMeasures) => aecRemedMeasures.aecrem
  )
  aecRemedMeasures: AecRemedMeasures[];

  @ManyToOne(() => MediaCd, (mediaCd) => mediaCd.aecRemediations)
  @JoinColumn([{ name: "media_code", referencedColumnName: "code" }])
  mediaCode2: MediaCd;

  @ManyToOne(() => Sites, (sites) => sites.aecRemediations)
  @JoinColumn([{ name: "site_id", referencedColumnName: "id" }])
  site: Sites;
}
