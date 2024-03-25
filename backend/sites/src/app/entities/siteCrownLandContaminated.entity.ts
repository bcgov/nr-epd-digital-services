import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { SiteContaminationClassXref } from './siteContaminationClassXref.entity'
import { Sites } from './sites.entity'
import { PeopleOrgs } from './peopleOrgs.entity'
import { SiteCrownLandStatusCd } from './siteCrownLandStatusCd.entity'


@Index("site_crown_land_contaminated_pkey", ["id",], { unique: true })
@Entity("site_crown_land_contaminated")
export class SiteCrownLandContaminated {

    @Column("bigint", { primary: true, name: "id" })
    id: string;

    @Column("double precision", { name: "estimated_cost_of_remediations", precision: 53 })
    estimatedCostOfRemediations: number;

    @Column("double precision", { name: "actual_cost_of_remediations", nullable: true, precision: 53 })
    actualCostOfRemediations: number | null;

    @Column("character varying", { name: "contamination_other_desc", nullable: true, length: 50 })
    contaminationOtherDesc: string | null;

    @Column("character varying", { name: "who_created", length: 30 })
    whoCreated: string;

    @Column("character varying", { name: "who_updated", nullable: true, length: 30, default: () => "statement_timestamp()", })
    whoUpdated: string | null;

    @Column("timestamp without time zone", { name: "when_created" })
    whenCreated: Date;

    @Column("timestamp without time zone", { name: "when_updated", nullable: true, default: () => "statement_timestamp()", })
    whenUpdated: Date | null;

    @OneToMany(() => SiteContaminationClassXref, siteContaminationClassXref => siteContaminationClassXref.sclc)


    siteContaminationClassXrefs: SiteContaminationClassXref[];

    @OneToOne(() => Sites, sites => sites.siteCrownLandContaminated)
    @JoinColumn([{ name: "id", referencedColumnName: "id" },
    ])

    sites: Sites;

    @ManyToOne(() => PeopleOrgs, peopleOrgs => peopleOrgs.siteCrownLandContaminateds)
    @JoinColumn([{ name: "psnorg_id", referencedColumnName: "id" },
    ])

    psnorg: PeopleOrgs;

    @ManyToOne(() => SiteCrownLandStatusCd, siteCrownLandStatusCd => siteCrownLandStatusCd.siteCrownLandContaminateds)
    @JoinColumn([{ name: "site_crown_land_status_code", referencedColumnName: "code" },
    ])

    siteCrownLandStatusCode: SiteCrownLandStatusCd;

}
