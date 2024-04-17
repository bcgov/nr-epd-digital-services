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
import { SiteDocPartics } from "./siteDocPartics.entity";
import { SiteParticRoles } from "./siteParticRoles.entity";
import { PeopleOrgs } from "./peopleOrgs.entity";
import { Sites } from "./sites.entity";
import { SiteProfileOwners } from "./siteProfileOwners.entity";
import { SiteProfiles } from "./siteProfiles.entity";

@ObjectType()
@Index("site_partics_pkey", ["id"], { unique: true })
@Index("sp_identified_by_frgn", ["psnorgId"], {})
@Index("sp_rwm_flag", ["rwmFlag"], {})
@Index("sp_identified_by2_frgn", ["siteId"], {})
@Entity("site_partics")
export class SitePartics {
  
  @Field()
  @Column("bigint", { primary: true, name: "id" })
  id: string;
  
  @Field()
  @Column("bigint", { name: "site_id" })
  siteId: string;
  
  @Field()
  @Column("bigint", { name: "psnorg_id" })
  psnorgId: string;
  
  @Field()
  @Column("timestamp without time zone", { name: "effective_date" })
  effectiveDate: Date;
  
  @Field()
  @Column("timestamp without time zone", { name: "end_date", nullable: true })
  endDate: Date | null;
  
  @Field()
  @Column("character", { name: "note", nullable: true, length: 255 })
  note: string | null;
  
  @Field()
  @Column("character", { name: "who_created", length: 30 })
  whoCreated: string;
  
  @Field()
  @Column("character", { name: "who_updated", nullable: true, length: 30 })
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

  @OneToMany(() => EventPartics, (eventPartics) => eventPartics.sp)
  eventPartics: EventPartics[];

  @OneToMany(() => SiteDocPartics, (siteDocPartics) => siteDocPartics.sp)
  siteDocPartics: SiteDocPartics[];

  @OneToMany(() => SiteParticRoles, (siteParticRoles) => siteParticRoles.sp)
  siteParticRoles: SiteParticRoles[];

  @ManyToOne(() => PeopleOrgs, (peopleOrgs) => peopleOrgs.sitePartics)
  @JoinColumn([{ name: "psnorg_id", referencedColumnName: "id" }])
  psnorg: PeopleOrgs;

  @ManyToOne(() => Sites, (sites) => sites.sitePartics, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "site_id", referencedColumnName: "id" }])
  site: Sites;

  @OneToMany(
    () => SiteProfileOwners,
    (siteProfileOwners) => siteProfileOwners.sp
  )
  siteProfileOwners: SiteProfileOwners[];

  @OneToMany(() => SiteProfiles, (siteProfiles) => siteProfiles.completorPartic)
  siteProfiles: SiteProfiles[];

  @OneToMany(() => SiteProfiles, (siteProfiles) => siteProfiles.contactPartic)
  siteProfiles2: SiteProfiles[];

  @OneToMany(() => SiteProfiles, (siteProfiles) => siteProfiles.rwmPartic)
  siteProfiles3: SiteProfiles[];

  @OneToMany(() => SiteProfiles, (siteProfiles) => siteProfiles.siteRegPartic)
  siteProfiles4: SiteProfiles[];
}
