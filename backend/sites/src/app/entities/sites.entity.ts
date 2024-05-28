import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Events } from './events.entity';
import { LandHistories } from './landHistories.entity';
import { Mailout } from './mailout.entity';
import { SiteAssocs } from './siteAssocs.entity';
import { SiteDocs } from './siteDocs.entity';
import { SitePartics } from './sitePartics.entity';
import { SiteProfiles } from './siteProfiles.entity';
import { SiteSubdivisions } from './siteSubdivisions.entity';
import { BceRegionCd } from './bceRegionCd.entity';
import { ClassificationCd } from './classificationCd.entity';
import { SiteRiskCd } from './siteRiskCd.entity';
import { SiteStatusCd } from './siteStatusCd.entity';
import { SiteCrownLandContaminated } from './siteCrownLandContaminated.entity'
import { RecentViews } from './recentViews.entity';

@ObjectType()
@Index("site_bco", ["bcerCode", "classCode", "id", "rwmFlag", "sstCode",], {})
@Index("site_responsibility_o_frgn", ["bcerCode",], {})
@Index("site_classification", ["classCode",], {})
@Index("site_geom_ddx", ["geometry",], {})
@Index("sites_pkey", ["id",], { unique: true })
@Index("site_gen_desc_flag", ["rwmGeneralDescFlag",], {})
@Index("site_risk_is", ["siteRiskCode",], {})
@Index("site_described_by_frgn", ["sstCode",], {})
@Index("sites_victoria_file_no_key", ["victoriaFileNo",], { unique: true })
@Entity("sites")
export class Sites {

    @Field()
    @Column("bigint", { primary: true, name: "id" })
    id: string;

    @Field()
    @Column("character varying", { name: "bcer_code", length: 6 })
    bcerCode: string;

    @Field()
    @Column("character varying", { name: "sst_code", length: 6 })
    sstCode: string;

    @Field()
    @Column("character varying", { name: "common_name", length: 40 })
    commonName: string;

    @Field()
    @Column("character varying", { name: "addr_type", length: 7 })
    addrType: string;

    @Field()
    @Column("character varying", { name: "addr_line_1", length: 50 })
    addrLine_1: string;

    @Field({nullable: true})
    @Column("character varying", { name: "addr_line_2", nullable: true, length: 50 })
    addrLine_2: string | null;

    @Field({nullable: true})
    @Column("character varying", { name: "addr_line_3", nullable: true, length: 50 })
    addrLine_3: string | null;

    @Field({nullable: true})
    @Column("character varying", { name: "addr_line_4", nullable: true, length: 50 })
    addrLine_4: string | null;

    @Field()
    @Column("character varying", { name: "city", length: 30 })
    city: string;

    @Field()
    @Column("character varying", { name: "prov_state", length: 2 })
    provState: string;

    @Field({nullable: true})
    @Column("character varying", { name: "postal_code", nullable: true, length: 10 })
    postalCode: string | null;

    @Field({nullable: true})
    @Column("double precision", { name: "latdeg", nullable: true, precision: 53 })
    latdeg: number | null;

    @Field({nullable: true})
    @Column("double precision", { name: "longdeg", nullable: true, precision: 53 })
    longdeg: number | null;

    @Field({nullable: true})
    @Column("character varying", { name: "victoria_file_no", nullable: true, unique: true, length: 40 })
    victoriaFileNo: string | null;

    @Field({nullable: true})
    @Column("character varying", { name: "regional_file_no", nullable: true, length: 40 })
    regionalFileNo: string | null;

    @Field({nullable: true})
    @Column("character varying", { name: "class_code", nullable: true, length: 6 })
    classCode: string | null;

    @Field({nullable: true})
    @Column("character varying", { name: "general_description", nullable: true, length: 255 })
    generalDescription: string | null;

    @Field()
    @Column("character varying", { name: "who_created", length: 30 })
    whoCreated: string;

    @Field({nullable: true})
    @Column("character varying", { name: "who_updated", nullable: true, length: 30 })
    whoUpdated: string | null;

    @Field()
    @Column("timestamp without time zone", { name: "when_created" })
    whenCreated: Date;

    @Field({nullable: true})
    @Column("timestamp without time zone", { name: "when_updated", nullable: true })
    whenUpdated: Date | null;

    @Field()
    @Column("smallint", { name: "rwm_flag" })
    rwmFlag: number;

    @Field()
    @Column("smallint", { name: "rwm_general_desc_flag" })
    rwmGeneralDescFlag: number;

    @Field({nullable: true})
    @Column("character", { name: "consultant_submitted", nullable: true, length: 1 })
    consultantSubmitted: string | null;

    @Field({nullable: true})
    @Column("smallint", { name: "long_degrees", nullable: true })
    longDegrees: number | null;

    @Field({nullable: true})
    @Column("smallint", { name: "long_minutes", nullable: true })
    longMinutes: number | null;

    @Field({nullable: true})
    @Column("numeric", { name: "long_seconds", nullable: true, precision: 4, scale: 2 })
    longSeconds: string | null;

    @Field({nullable: true})
    @Column("smallint", { name: "lat_degrees", nullable: true })
    latDegrees: number | null;

    @Field({nullable: true})
    @Column("smallint", { name: "lat_minutes", nullable: true })
    latMinutes: number | null;

    @Field({nullable: true})
    @Column("numeric", { name: "lat_seconds", nullable: true, precision: 4, scale: 2 })
    latSeconds: string | null;

    @Field()
    @Column("character varying", { name: "sr_status", length: 1, default: () => "'Y'", })
    srStatus: string;

    @Field()
    @Column("character varying", { name: "latlong_reliability_flag", length: 12 })
    latlongReliabilityFlag: string;

    @Field()
    @Column("character varying", { name: "site_risk_code", length: 6, default: () => "'UNC'", })
    siteRiskCode: string;

    @Field({nullable: true})
    @Column("geometry", { name: "geometry", nullable: true })
    geometry: string | null;

    @OneToMany(() => Events, events => events.site)
    events: Events[];

    @OneToMany(() => LandHistories, landHistories => landHistories.site)
    landHistories: LandHistories[];

    @OneToMany(() => Mailout, mailout => mailout.site)
    mailouts: Mailout[];

    @OneToMany(() => SiteAssocs, siteAssocs => siteAssocs.site)
    siteAssocs: SiteAssocs[];

    @OneToMany(() => SiteAssocs, siteAssocs => siteAssocs.siteIdAssociatedWith2)
    siteAssocs2: SiteAssocs[];

    @OneToMany(() => SiteDocs, siteDocs => siteDocs.site)
    siteDocs: SiteDocs[];

    @OneToMany(() => SitePartics, sitePartics => sitePartics.site)
    sitePartics: SitePartics[];

    @OneToMany(() => SiteProfiles, siteProfiles => siteProfiles.site)
    siteProfiles: SiteProfiles[];

    @OneToMany(() => SiteSubdivisions, siteSubdivisions => siteSubdivisions.site)
    siteSubdivisions: SiteSubdivisions[];

    @ManyToOne(() => BceRegionCd, bceRegionCd => bceRegionCd.sites)
    @JoinColumn([{ name: "bcer_code", referencedColumnName: "code" },
    ])
    bcerCode2: BceRegionCd;

    @ManyToOne(() => ClassificationCd, classificationCd => classificationCd.sites)
    @JoinColumn([{ name: "class_code", referencedColumnName: "code" },
    ])
    classCode2: ClassificationCd;

    @ManyToOne(() => SiteRiskCd, siteRiskCd => siteRiskCd.sites)
    @JoinColumn([{ name: "site_risk_code", referencedColumnName: "code" },
    ])
    siteRiskCode2: SiteRiskCd;

    @ManyToOne(() => SiteStatusCd, siteStatusCd => siteStatusCd.sites)
    @JoinColumn([{ name: "sst_code", referencedColumnName: "code" },
    ])
    sstCode2: SiteStatusCd;

    @OneToOne(() => SiteCrownLandContaminated, siteCrownLandContaminated => siteCrownLandContaminated.sites)
    siteCrownLandContaminated: SiteCrownLandContaminated;

    @OneToMany(() => RecentViews, (recentViews) => recentViews.site)
    recentViewedSites: RecentViews[];
}
