import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Sites } from "./sites.entity";

@ObjectType()
@Index("sa_rwm_flag", ["rwmFlag"], {})
@Index("sa_rwm_note_flag", ["rwmNoteFlag"], {})
@Index("sa_adjacent_to_frgn", ["siteId"], {})
@Index("site_assocs_pkey", ["siteId", "siteIdAssociatedWith"], { unique: true })
@Index("sa_associated_with_frgn", ["siteIdAssociatedWith"], {})
@Entity("site_assocs")
export class SiteAssocs {
  
  @Field()
  @Column("bigint", { primary: true, name: "site_id" })
  siteId: string;
  
  @Field()
  @Column("bigint", { primary: true, name: "site_id_associated_with" })
  siteIdAssociatedWith: string;
  
  @Field()
  @Column("timestamp without time zone", { name: "effective_date" })
  effectiveDate: Date;
  
  @Field()
  @Column("character varying", { name: "note", nullable: true, length: 255 })
  note: string | null;
  
  @Field()
  @Column("character varying", { name: "who_created", length: 30 })
  whoCreated: string;
  
  @Field()
  @Column("character varying", {
    name: "who_updated",
    nullable: true,
    length: 30,
  })
  whoUpdated: string | null;
  
  @Field()
  @Column("timestamp without time zone", { name: "when_created" })
  whenCreated: Date;
  
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
  
  @Field()
  @Column("character varying", { name: "common_pid", length: 1 })
  commonPid: string;

  @ManyToOne(() => Sites, (sites) => sites.siteAssocs, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "site_id", referencedColumnName: "id" }])
  site: Sites;

  @ManyToOne(() => Sites, (sites) => sites.siteAssocs2, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "site_id_associated_with", referencedColumnName: "id" }])
  siteIdAssociatedWith2: Sites;
}
