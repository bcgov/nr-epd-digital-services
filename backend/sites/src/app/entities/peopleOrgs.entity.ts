import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { EventPartics } from "./eventPartics.entity";
import { Mailout } from "./mailout.entity";
import { BceRegionCd } from "./bceRegionCd.entity";
import { SisAddresses } from "./sisAddresses.entity";
import { SiteDocPartics } from "./siteDocPartics.entity";
import { SitePartics } from "./sitePartics.entity";
import { SiteStaffs } from "./siteStaffs.entity";
import { SiteCrownLandContaminated } from "./siteCrownLandContaminated.entity";

@ObjectType()
@Index("psnorg_working_within_frgn", ["bcerCode"], {})
@Index("people_orgs_pkey", ["id"], { unique: true })
@Entity("people_orgs")
export class PeopleOrgs {
  @Field()
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Field()
  @Column("character varying", {
    name: "organization_name",
    nullable: true,
    length: 150,
  })
  organizationName: string | null;

  @Field()
  @Column("character varying", { name: "display_name", length: 150 })
  displayName: string;

  @Field()
  @Column("character varying", { name: "entity_type", length: 12 })
  entityType: string;

  @Field()
  @Column("character varying", { name: "location", nullable: true, length: 40 })
  location: string | null;

  @Field()
  @Column("character varying", { name: "bcer_code", nullable: true, length: 6 })
  bcerCode: string | null;

  @Field()
  @Column("character varying", {
    name: "contact_name",
    nullable: true,
    length: 150,
  })
  contactName: string | null;

  @Field()
  @Column("character varying", {
    name: "mail_userid",
    nullable: true,
    length: 100,
  })
  mailUserid: string | null;

  @Field()
  @Column("character varying", {
    name: "last_name",
    nullable: true,
    length: 150,
  })
  lastName: string | null;

  @Field()
  @Column("character varying", {
    name: "first_name",
    nullable: true,
    length: 75,
  })
  firstName: string | null;

  @Field()
  @Column("character varying", {
    name: "middle_name",
    nullable: true,
    length: 75,
  })
  middleName: string | null;

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
  @Column("timestamp without time zone", { name: "end_date", nullable: true })
  endDate: Date | null;

  @OneToMany(() => EventPartics, (eventPartics) => eventPartics.psnorg)
  eventPartics: EventPartics[];

  @OneToMany(() => Mailout, (mailout) => mailout.psnorg)
  mailouts: Mailout[];

  @ManyToOne(() => BceRegionCd, (bceRegionCd) => bceRegionCd.peopleOrgs)
  @JoinColumn([{ name: "bcer_code", referencedColumnName: "code" }])
  bcerCode2: BceRegionCd;

  @OneToMany(() => SisAddresses, (sisAddresses) => sisAddresses.psnorg)
  sisAddresses: SisAddresses[];

  @OneToMany(
    () => SiteCrownLandContaminated,
    (siteCrownLandContaminated) => siteCrownLandContaminated.psnorg
  )
  siteCrownLandContaminateds: SiteCrownLandContaminated[];

  @OneToMany(() => SiteDocPartics, (siteDocPartics) => siteDocPartics.psnorg)
  siteDocPartics: SiteDocPartics[];

  @OneToMany(() => SitePartics, (sitePartics) => sitePartics.psnorg)
  sitePartics: SitePartics[];

  @OneToMany(() => SiteStaffs, (siteStaffs) => siteStaffs.psnorg)
  siteStaffs: SiteStaffs[];
}
