import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BceRegionCd } from "./bceRegionCd.entity";
import { PeopleOrgs } from "./peopleOrgs.entity";
import { Sites } from "./sites.entity";

@ObjectType()
@Index("mailout_bcer_code", ["bcerCode"], {})
@Index("mailout_pkey", ["psnorgId", "siteId"], { unique: true })
@Entity("mailout")
export class Mailout {
  @Field()
  @Column("bigint", { primary: true, name: "site_id" })
  siteId: string;

  @Field()
  @Column("bigint", { primary: true, name: "psnorg_id" })
  psnorgId: string;

  @Field()
  @Column("character varying", { name: "bcer_code", length: 6 })
  bcerCode: string;

  @Field()
  @Column("character varying", { name: "display_name", length: 150 })
  displayName: string;

  @Field()
  @Column("character varying", { name: "common_name", length: 40 })
  commonName: string;

  @Field()
  @Column("character varying", { name: "common_city_name", length: 30 })
  commonCityName: string;

  @Field()
  @Column("character varying", { name: "organization_address", length: 50 })
  organizationAddress: string;

  @Field()
  @Column("character varying", {
    name: "org_address_2",
    nullable: true,
    length: 50,
  })
  orgAddress_2: string | null;

  @Field()
  @Column("character varying", {
    name: "org_address_3",
    nullable: true,
    length: 50,
  })
  orgAddress_3: string | null;

  @Field()
  @Column("character varying", { name: "organization_city_name", length: 30 })
  organizationCityName: string;

  @Field()
  @Column("character varying", { name: "prov_state", length: 2 })
  provState: string;

  @Field()
  @Column("character varying", {
    name: "postal_code",
    nullable: true,
    length: 10,
  })
  postalCode: string | null;

  @Field()
  @Column("timestamp without time zone", {
    name: "mailing_date",
    nullable: true,
  })
  mailingDate: Date | null;

  @Field()
  @Column("timestamp without time zone", {
    name: "response_date",
    nullable: true,
  })
  responseDate: Date | null;

  @Field()
  @Column("timestamp without time zone", {
    name: "record_date",
    nullable: true,
  })
  recordDate: Date | null;

  @Field()
  @Column("character varying", { name: "revise", nullable: true, length: 1 })
  revise: string | null;

  @Field()
  @Column("character varying", { name: "complete", nullable: true, length: 1 })
  complete: string | null;

  @Field()
  @Column("timestamp without time zone", {
    name: "complete_date",
    nullable: true,
  })
  completeDate: Date | null;

  @Field()
  @Column("character varying", {
    name: "comments",
    nullable: true,
    length: 750,
  })
  comments: string | null;

  @Field()
  @Column("character varying", {
    name: "update_notation",
    nullable: true,
    length: 1,
  })
  updateNotation: string | null;

  @Field()
  @Column("timestamp without time zone", {
    name: "update_notation_date",
    nullable: true,
  })
  updateNotationDate: Date | null;

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

  @ManyToOne(() => BceRegionCd, (bceRegionCd) => bceRegionCd.mailouts)
  @JoinColumn([{ name: "bcer_code", referencedColumnName: "code" }])
  bcerCode2: BceRegionCd;

  @ManyToOne(() => PeopleOrgs, (peopleOrgs) => peopleOrgs.mailouts)
  @JoinColumn([{ name: "psnorg_id", referencedColumnName: "id" }])
  psnorg: PeopleOrgs;

  @ManyToOne(() => Sites, (sites) => sites.mailouts)
  @JoinColumn([{ name: "site_id", referencedColumnName: "id" }])
  site: Sites;
}
