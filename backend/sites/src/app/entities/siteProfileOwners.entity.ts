import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { SiteProfiles } from "./siteProfiles.entity";
import { SitePartics } from "./sitePartics.entity";

@ObjectType()
@Index("spown_sprof_fk_i", ["dateCompleted", "siteId"], {})
@Index("site_profile_owners_pkey", ["dateCompleted", "siteId", "spId"], {
  unique: true,
})
@Index("spown_sp_fk_i", ["spId"], {})
@Entity("site_profile_owners")
export class SiteProfileOwners {
  
  @Field()
  @Column("bigint", { primary: true, name: "site_id" })
  siteId: string;
  
  @Field()
  @Column("timestamp without time zone", {
    primary: true,
    name: "date_completed",
  })
  dateCompleted: Date;
  
  @Field()
  @Column("bigint", { primary: true, name: "sp_id" })
  spId: string;
  
  @Field()
  @Column("character varying", {
    name: "owner_company_contact",
    nullable: true,
    length: 150,
  })
  ownerCompanyContact: string | null;
  
  @Field()
  @Column("character varying", {
    name: "agent_authorized_ind",
    nullable: true,
    length: 1,
  })
  agentAuthorizedInd: string | null;

  @ManyToOne(
    () => SiteProfiles,
    (siteProfiles) => siteProfiles.siteProfileOwners
  )
  @JoinColumn([
    { name: "site_id", referencedColumnName: "siteId" },
    { name: "date_completed", referencedColumnName: "dateCompleted" },
  ])
  siteProfiles: SiteProfiles;

  @ManyToOne(() => SitePartics, (sitePartics) => sitePartics.siteProfileOwners)
  @JoinColumn([{ name: "sp_id", referencedColumnName: "id" }])
  sp: SitePartics;
}
