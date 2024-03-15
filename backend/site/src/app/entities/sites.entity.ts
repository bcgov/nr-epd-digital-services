import {Column,Entity,Index,JoinColumn,ManyToOne,OneToMany,OneToOne} from "typeorm";
import {AecAssessments} from './aecAssessments'
import {AecRemedApproaches} from './aecRemedApproaches'
import {AecRemedItems} from './aecRemedItems'
import {AecRemedMeasures} from './aecRemedMeasures'
import {AecRemediations} from './aecRemediations'
import {Events} from './events'
import {LandHistories} from './landHistories'
import {Mailout} from './mailout'
import {MeasurementPopulations} from './measurementPopulations'
import {SiteAssocs} from './siteAssocs'
import {SiteCrownLandContaminated} from './siteCrownLandContaminated'
import {SiteDocs} from './siteDocs'
import {SitePartics} from './sitePartics'
import {SiteProfiles} from './siteProfiles'
import {SiteSubdivisions} from './siteSubdivisions'
import {BceRegionCd} from './bceRegionCd'
import {ClassificationCd} from './classificationCd'
import {SiteRiskCd} from './siteRiskCd'
import {SiteStatusCd} from './siteStatusCd'


@Index("site_bco",["bcerCode","classCode","id","rwmFlag","sstCode",],{  })
@Index("site_responsibility_o_frgn",["bcerCode",],{  })
@Index("site_classification",["classCode",],{  })
@Index("site_geom_ddx",["geometry",],{  })
@Index("sites_pkey",["id",],{ unique:true })
@Index("site_gen_desc_flag",["rwmGeneralDescFlag",],{  })
@Index("site_risk_is",["siteRiskCode",],{  })
@Index("site_described_by_frgn",["sstCode",],{  })
@Index("sites_victoria_file_no_key",["victoriaFileNo",],{ unique:true })
@Entity("sites" ,{schema:"public" } )
export  class Sites {

@Column("bigint",{ primary:true,name:"id" })
id:string;

@Column("character varying",{ name:"bcer_code",length:6 })
bcerCode:string;

@Column("character varying",{ name:"sst_code",length:6 })
sstCode:string;

@Column("character varying",{ name:"common_name",length:40 })
commonName:string;

@Column("character varying",{ name:"addr_type",length:7 })
addrType:string;

@Column("character varying",{ name:"addr_line_1",length:50 })
addrLine_1:string;

@Column("character varying",{ name:"addr_line_2",nullable:true,length:50 })
addrLine_2:string | null;

@Column("character varying",{ name:"addr_line_3",nullable:true,length:50 })
addrLine_3:string | null;

@Column("character varying",{ name:"addr_line_4",nullable:true,length:50 })
addrLine_4:string | null;

@Column("character varying",{ name:"city",length:30 })
city:string;

@Column("character varying",{ name:"prov_state",length:2 })
provState:string;

@Column("character varying",{ name:"postal_code",nullable:true,length:10 })
postalCode:string | null;

@Column("double precision",{ name:"latdeg",nullable:true,precision:53 })
latdeg:number | null;

@Column("double precision",{ name:"longdeg",nullable:true,precision:53 })
longdeg:number | null;

@Column("character varying",{ name:"victoria_file_no",nullable:true,unique:true,length:40 })
victoriaFileNo:string | null;

@Column("character varying",{ name:"regional_file_no",nullable:true,length:40 })
regionalFileNo:string | null;

@Column("character varying",{ name:"class_code",nullable:true,length:6 })
classCode:string | null;

@Column("character varying",{ name:"general_description",nullable:true,length:255 })
generalDescription:string | null;

@Column("character varying",{ name:"who_created",length:30 })
whoCreated:string;

@Column("character varying",{ name:"who_updated",nullable:true,length:30 })
whoUpdated:string | null;

@Column("timestamp without time zone",{ name:"when_created" })
whenCreated:Date;

@Column("timestamp without time zone",{ name:"when_updated",nullable:true })
whenUpdated:Date | null;

@Column("smallint",{ name:"rwm_flag" })
rwmFlag:number;

@Column("smallint",{ name:"rwm_general_desc_flag" })
rwmGeneralDescFlag:number;

@Column("character",{ name:"consultant_submitted",nullable:true,length:1 })
consultantSubmitted:string | null;

@Column("smallint",{ name:"long_degrees",nullable:true })
longDegrees:number | null;

@Column("smallint",{ name:"long_minutes",nullable:true })
longMinutes:number | null;

@Column("numeric",{ name:"long_seconds",nullable:true,precision:4,scale:2 })
longSeconds:string | null;

@Column("smallint",{ name:"lat_degrees",nullable:true })
latDegrees:number | null;

@Column("smallint",{ name:"lat_minutes",nullable:true })
latMinutes:number | null;

@Column("numeric",{ name:"lat_seconds",nullable:true,precision:4,scale:2 })
latSeconds:string | null;

@Column("character varying",{ name:"sr_status",length:1,default: () => "'Y'", })
srStatus:string;

@Column("character varying",{ name:"latlong_reliability_flag",length:12 })
latlongReliabilityFlag:string;

@Column("character varying",{ name:"site_risk_code",length:6,default: () => "'UNC'", })
siteRiskCode:string;

@Column("geometry",{ name:"geometry",nullable:true })
geometry:string | null;

@OneToMany(()=>AecAssessments,aecAssessments=>aecAssessments.site)


aecAssessments:AecAssessments[];

@OneToMany(()=>AecRemedApproaches,aecRemedApproaches=>aecRemedApproaches.site)


aecRemedApproaches:AecRemedApproaches[];

@OneToMany(()=>AecRemedItems,aecRemedItems=>aecRemedItems.site)


aecRemedItems:AecRemedItems[];

@OneToMany(()=>AecRemedMeasures,aecRemedMeasures=>aecRemedMeasures.site)


aecRemedMeasures:AecRemedMeasures[];

@OneToMany(()=>AecRemediations,aecRemediations=>aecRemediations.site)


aecRemediations:AecRemediations[];

@OneToMany(()=>Events,events=>events.site)


events:Events[];

@OneToMany(()=>LandHistories,landHistories=>landHistories.site)


landHistories:LandHistories[];

@OneToMany(()=>Mailout,mailout=>mailout.site)


mailouts:Mailout[];

@OneToMany(()=>MeasurementPopulations,measurementPopulations=>measurementPopulations.site)


measurementPopulations:MeasurementPopulations[];

@OneToMany(()=>SiteAssocs,siteAssocs=>siteAssocs.site)


siteAssocs:SiteAssocs[];

@OneToMany(()=>SiteAssocs,siteAssocs=>siteAssocs.siteIdAssociatedWith2)


siteAssocs2:SiteAssocs[];

@OneToOne(()=>SiteCrownLandContaminated,siteCrownLandContaminated=>siteCrownLandContaminated.)


siteCrownLandContaminated:SiteCrownLandContaminated;

@OneToMany(()=>SiteDocs,siteDocs=>siteDocs.site)


siteDocs:SiteDocs[];

@OneToMany(()=>SitePartics,sitePartics=>sitePartics.site)


sitePartics:SitePartics[];

@OneToMany(()=>SiteProfiles,siteProfiles=>siteProfiles.site)


siteProfiles:SiteProfiles[];

@OneToMany(()=>SiteSubdivisions,siteSubdivisions=>siteSubdivisions.site)


siteSubdivisions:SiteSubdivisions[];

@ManyToOne(()=>BceRegionCd,bceRegionCd=>bceRegionCd.sites)
@JoinColumn([{ name: "bcer_code", referencedColumnName: "code" },
])

bcerCode2:BceRegionCd;

@ManyToOne(()=>ClassificationCd,classificationCd=>classificationCd.sites)
@JoinColumn([{ name: "class_code", referencedColumnName: "code" },
])

classCode2:ClassificationCd;

@ManyToOne(()=>SiteRiskCd,siteRiskCd=>siteRiskCd.sites)
@JoinColumn([{ name: "site_risk_code", referencedColumnName: "code" },
])

siteRiskCode2:SiteRiskCd;

@ManyToOne(()=>SiteStatusCd,siteStatusCd=>siteStatusCd.sites)
@JoinColumn([{ name: "sst_code", referencedColumnName: "code" },
])

sstCode2:SiteStatusCd;

}
