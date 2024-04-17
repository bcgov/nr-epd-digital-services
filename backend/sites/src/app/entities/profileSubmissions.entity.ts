import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { SiteProfiles } from "./siteProfiles.entity";
import { SubmissionCd } from "./submissionCd.entity";
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Index(
  "profile_submissions_pkey",
  ["sprofDateCompleted", "sprofSiteId", "submcdCode"],
  { unique: true }
)
@Index("profsbm_sprof_fk_i", ["sprofDateCompleted", "sprofSiteId"], {})
@Index("profsbm_submcd_fk_i", ["submcdCode"], {})
@Entity("profile_submissions")
export class ProfileSubmissions {
  @Field()
  @Column("timestamp without time zone", {
    primary: true,
    name: "sprof_date_completed",
  })
  sprofDateCompleted: Date;

  @Field()
  @Column("character varying", {
    primary: true,
    name: "submcd_code",
    length: 6,
  })
  submcdCode: string;

  @Field()
  @Column("bigint", { primary: true, name: "sprof_site_id" })
  sprofSiteId: string;

  @ManyToOne(
    () => SiteProfiles,
    (siteProfiles) => siteProfiles.profileSubmissions
  )
  @JoinColumn([
    { name: "sprof_site_id", referencedColumnName: "siteId" },
    { name: "sprof_date_completed", referencedColumnName: "dateCompleted" },
  ])
  siteProfiles: SiteProfiles;

  @ManyToOne(
    () => SubmissionCd,
    (submissionCd) => submissionCd.profileSubmissions
  )
  @JoinColumn([{ name: "submcd_code", referencedColumnName: "code" }])
  submcdCode2: SubmissionCd;
}
