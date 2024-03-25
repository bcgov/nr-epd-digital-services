import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { MediaCd } from "./mediaCd.entity";
import { AecAssessments } from "./aecAssessments.entity";
import { AecPcocs } from "./aecPcocs.entity";

@ObjectType()
@Index("aecmedia_assessment_frgn_frgn", ["aecassAreaId", "siteId"], {})
@Index("aec_medias_pkey", ["id"], { unique: true })
@Index("aecmedia_media_frgn_frgn", ["mediaCd"], {})
@Entity("aec_medias")
export class AecMedias {
  @Field()
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Field()
  @Column("bigint", { name: "site_id" })
  siteId: string;

  @Field()
  @Column("character varying", { name: "aecass_area_id", length: 40 })
  aecassAreaId: string;

  @Field()
  @Column("character varying", { name: "media_cd", length: 6 })
  mediaCd: string;

  @Field()
  @Column("character varying", { name: "note", nullable: true, length: 255 })
  note: string | null;

  @Field()
  @Column("character varying", {
    name: "who_created",
    nullable: true,
    length: 30,
  })
  whoCreated: string | null;

  @Field()
  @Column("timestamp without time zone", {
    name: "when_created",
    nullable: true,
  })
  whenCreated: Date | null;

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

  @Field()
  @Column("smallint", { name: "rwm_flag" })
  rwmFlag: number;

  @Field()
  @Column("smallint", { name: "rwm_note_flag" })
  rwmNoteFlag: number;

  @ManyToOne(() => MediaCd, (mediaCd) => mediaCd.aecMedias)
  @JoinColumn([{ name: "media_cd", referencedColumnName: "code" }])
  mediaCd2: MediaCd;

  @ManyToOne(() => AecAssessments, (aecAssessments) => aecAssessments.aecMedias)
  @JoinColumn([
    { name: "site_id", referencedColumnName: "siteId" },
    { name: "aecass_area_id", referencedColumnName: "areaId" },
  ])
  aecAssessments: AecAssessments;

  @OneToMany(() => AecPcocs, (aecPcocs) => aecPcocs.media)
  aecPcocs: AecPcocs[];
}
