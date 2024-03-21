import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { ProfileAnswers } from "./profileAnswers.entity";
import { ProfileSubmissions } from "./profileSubmissions.entity";
import { SiteProfileLandUses } from "./siteProfileLandUses.entity";
import { SiteProfileOwners } from "./siteProfileOwners.entity";
import { SitePartics } from "./sitePartics.entity";
import { Sites } from "./sites.entity";

@Index("site_profiles_pkey", ["dateCompleted", "siteId"], { unique: true })
@Index("sprof_rwm_site_partic", ["rwmParticId"], {})
@Index("sprof_site_reg_site_partic", ["siteRegParticId"], {})
@Entity("site_profiles")
export class SiteProfiles {
  @Column("bigint", { primary: true, name: "site_id" })
  siteId: string;

  @Column("timestamp without time zone", {
    primary: true,
    name: "date_completed",
  })
  dateCompleted: Date;

  @Column("timestamp without time zone", {
    name: "local_auth_date_recd",
    nullable: true,
  })
  localAuthDateRecd: Date | null;

  @Column("character varying", {
    name: "local_auth_name",
    nullable: true,
    length: 200,
  })
  localAuthName: string | null;

  @Column("character varying", {
    name: "local_auth_agency",
    nullable: true,
    length: 200,
  })
  localAuthAgency: string | null;

  @Column("character varying", {
    name: "local_auth_address1",
    nullable: true,
    length: 40,
  })
  localAuthAddress1: string | null;

  @Column("character varying", {
    name: "local_auth_address2",
    nullable: true,
    length: 40,
  })
  localAuthAddress2: string | null;

  @Column("character varying", {
    name: "local_auth_phone_area_code",
    nullable: true,
    length: 3,
  })
  localAuthPhoneAreaCode: string | null;

  @Column("character varying", {
    name: "local_auth_phone_no",
    nullable: true,
    length: 7,
  })
  localAuthPhoneNo: string | null;

  @Column("character varying", {
    name: "local_auth_fax_area_code",
    nullable: true,
    length: 3,
  })
  localAuthFaxAreaCode: string | null;

  @Column("character varying", {
    name: "local_auth_fax_no",
    nullable: true,
    length: 7,
  })
  localAuthFaxNo: string | null;

  @Column("timestamp without time zone", {
    name: "local_auth_date_submitted",
    nullable: true,
  })
  localAuthDateSubmitted: Date | null;

  @Column("timestamp without time zone", {
    name: "local_auth_date_forwarded",
    nullable: true,
  })
  localAuthDateForwarded: Date | null;

  @Column("timestamp without time zone", {
    name: "rwm_date_received",
    nullable: true,
  })
  rwmDateReceived: Date | null;

  @Column("bigint", { name: "rwm_partic_id", nullable: true })
  rwmParticId: string | null;

  @Column("character varying", {
    name: "rwm_phone_area_code",
    nullable: true,
    length: 3,
  })
  rwmPhoneAreaCode: string | null;

  @Column("character varying", {
    name: "rwm_phone_no",
    nullable: true,
    length: 7,
  })
  rwmPhoneNo: string | null;

  @Column("character varying", {
    name: "rwm_fax_area_code",
    nullable: true,
    length: 3,
  })
  rwmFaxAreaCode: string | null;

  @Column("character varying", {
    name: "rwm_fax_no",
    nullable: true,
    length: 7,
  })
  rwmFaxNo: string | null;

  @Column("character", {
    name: "investigation_required",
    nullable: true,
    length: 1,
  })
  investigationRequired: string | null;

  @Column("timestamp without time zone", {
    name: "rwm_date_decision",
    nullable: true,
  })
  rwmDateDecision: Date | null;

  @Column("timestamp without time zone", {
    name: "site_reg_date_recd",
    nullable: true,
  })
  siteRegDateRecd: Date | null;

  @Column("timestamp without time zone", {
    name: "site_reg_date_entered",
    nullable: true,
  })
  siteRegDateEntered: Date | null;

  @Column("bigint", { name: "site_reg_partic_id", nullable: true })
  siteRegParticId: string | null;

  @Column("bigint", { name: "owner_partic_id", nullable: true })
  ownerParticId: string | null;

  @Column("character varying", {
    name: "site_address",
    nullable: true,
    length: 100,
  })
  siteAddress: string | null;

  @Column("character varying", {
    name: "site_city",
    nullable: true,
    length: 30,
  })
  siteCity: string | null;

  @Column("character varying", {
    name: "site_postal_code",
    nullable: true,
    length: 10,
  })
  sitePostalCode: string | null;

  @Column("smallint", { name: "number_of_pids", nullable: true })
  numberOfPids: number | null;

  @Column("smallint", { name: "number_of_pins", nullable: true })
  numberOfPins: number | null;

  @Column("smallint", { name: "lat_degrees", nullable: true })
  latDegrees: number | null;

  @Column("smallint", { name: "lat_minutes", nullable: true })
  latMinutes: number | null;

  @Column("numeric", {
    name: "lat_seconds",
    nullable: true,
    precision: 4,
    scale: 2,
  })
  latSeconds: string | null;

  @Column("smallint", { name: "long_degrees", nullable: true })
  longDegrees: number | null;

  @Column("smallint", { name: "long_minutes", nullable: true })
  longMinutes: number | null;

  @Column("numeric", {
    name: "long_seconds",
    nullable: true,
    precision: 4,
    scale: 2,
  })
  longSeconds: string | null;

  @Column("character varying", {
    name: "comments",
    nullable: true,
    length: 2000,
  })
  comments: string | null;

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

  @Column("character varying", {
    name: "local_auth_email",
    nullable: true,
    length: 50,
  })
  localAuthEmail: string | null;

  @Column("character varying", {
    name: "planned_activity_comment",
    nullable: true,
    length: 2000,
  })
  plannedActivityComment: string | null;

  @Column("character varying", {
    name: "site_disclosure_comment",
    nullable: true,
    length: 2000,
  })
  siteDisclosureComment: string | null;

  @Column("character varying", {
    name: "gov_documents_comment",
    nullable: true,
    length: 2000,
  })
  govDocumentsComment: string | null;

  @OneToMany(
    () => ProfileAnswers,
    (profileAnswers) => profileAnswers.siteProfiles
  )
  profileAnswers: ProfileAnswers[];

  @OneToMany(
    () => ProfileSubmissions,
    (profileSubmissions) => profileSubmissions.siteProfiles
  )
  profileSubmissions: ProfileSubmissions[];

  @OneToMany(
    () => SiteProfileLandUses,
    (siteProfileLandUses) => siteProfileLandUses.siteProfiles
  )
  siteProfileLandUses: SiteProfileLandUses[];

  @OneToMany(
    () => SiteProfileOwners,
    (siteProfileOwners) => siteProfileOwners.siteProfiles
  )
  siteProfileOwners: SiteProfileOwners[];

  @ManyToOne(() => SitePartics, (sitePartics) => sitePartics.siteProfiles)
  @JoinColumn([{ name: "completor_partic_id", referencedColumnName: "id" }])
  completorPartic: SitePartics;

  @ManyToOne(() => SitePartics, (sitePartics) => sitePartics.siteProfiles2)
  @JoinColumn([{ name: "contact_partic_id", referencedColumnName: "id" }])
  contactPartic: SitePartics;

  @ManyToOne(() => SitePartics, (sitePartics) => sitePartics.siteProfiles3)
  @JoinColumn([{ name: "rwm_partic_id", referencedColumnName: "id" }])
  rwmPartic: SitePartics;

  @ManyToOne(() => Sites, (sites) => sites.siteProfiles)
  @JoinColumn([{ name: "site_id", referencedColumnName: "id" }])
  site: Sites;

  @ManyToOne(() => SitePartics, (sitePartics) => sitePartics.siteProfiles4)
  @JoinColumn([{ name: "site_reg_partic_id", referencedColumnName: "id" }])
  siteRegPartic: SitePartics;
}
