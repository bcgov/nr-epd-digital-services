import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index } from "typeorm";

@ObjectType()
@Index("sitereg_bco", ["regFlag", "siteId"], {})
@Index("site_registry_pkey", ["siteId"], { unique: true })
@Entity("site_registry")
export class SiteRegistry {
  
  @Field()
  @Column("bigint", { primary: true, name: "site_id" })
  siteId: string;
  
  @Field()
  @Column("smallint", { name: "reg_flag", nullable: true })
  regFlag: number | null;
  
  @Field()
  @Column("character varying", {
    name: "reg_userid",
    nullable: true,
    length: 16,
  })
  regUserid: string | null;
  
  @Field()
  @Column("timestamp without time zone", {
    name: "init_approval_date",
    nullable: true,
  })
  initApprovalDate: Date | null;
  
  @Field()
  @Column("timestamp without time zone", {
    name: "last_approval_date",
    nullable: true,
  })
  lastApprovalDate: Date | null;
  
  @Field()
  @Column("timestamp without time zone", {
    name: "tombstone_date",
    nullable: true,
  })
  tombstoneDate: Date | null;
}
