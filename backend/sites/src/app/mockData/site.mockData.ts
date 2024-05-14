import { BceRegionCd } from "../entities/bceRegionCd.entity";
import { ClassificationCd } from "../entities/classificationCd.entity";
import { RecentViews } from "../entities/recentViews.entity";
import { SiteCrownLandContaminated } from "../entities/siteCrownLandContaminated.entity";
import { SiteRiskCd } from "../entities/siteRiskCd.entity";
import { SiteStatusCd } from "../entities/siteStatusCd.entity";
import { Sites } from "../entities/sites.entity";


const siteCrownLandContaminated = new SiteCrownLandContaminated();
const recentViewedSites = [new RecentViews()];
const sstCode: SiteStatusCd = { code: '1', description: 'test', sites: [], eventTypeCds: [] };
const siteRiskCd: SiteRiskCd = { code: '1', description: 'test', sites: [] };
const bceRegionCd: BceRegionCd = { code: '1', description: 'test', cityRegions: [], mailouts: [], peopleOrgs: [], sites: [] };
const classCd: ClassificationCd = { code: '1', description: 'test', sites: [] };

export const sampleSites: Sites[] = [
    {
        id: '123',
        commonName: 'victoria',
        bcerCode: 'BCER123',
        sstCode: 'SST123',
        addrType: 'type',
        addrLine_1: 'Address 1',
        addrLine_2: 'Address 2',
        addrLine_3: 'Address 3',
        addrLine_4: 'Address 4',
        city: 'City',
        provState: 'Province/State',
        postalCode: 'Postal Code',
        latdeg: 0, // Example latitude
        longdeg: 0, // Example longitude
        victoriaFileNo: 'File No 1',
        regionalFileNo: 'File No 2',
        classCode: 'Class Code',
        generalDescription: 'Description',
        whoCreated: 'Creator',
        whoUpdated: 'Updater',
        whenCreated: new Date(), // Example date
        whenUpdated: new Date(), // Example date
        rwmFlag: 1,
        rwmGeneralDescFlag: 1,
        consultantSubmitted: 'Consultant Submitted',
        longDegrees: 0, // Example long degrees
        longMinutes: 0, // Example long minutes
        longSeconds: '0', // Example long seconds
        latDegrees: 0, // Example lat degrees
        latMinutes: 0, // Example lat minutes
        latSeconds: '0', // Example lat seconds
        srStatus: 'SR Status',
        latlongReliabilityFlag: 'LatLong Reliability Flag',
        siteRiskCode: 'Site Risk Code',
        geometry: '{}', // Example geometry
        events: [], // Example events
        landHistories: [], // Example land histories
        mailouts: [], // Example mailouts
        siteAssocs: [], // Example site associations
        siteAssocs2: [], // Example site associations 2
        siteDocs: [], // Example site documents
        sitePartics: [], // Example site participants
        siteProfiles: [], // Example site profiles
        siteSubdivisions: [], // Example site subdivisions
        bcerCode2: bceRegionCd, // Example BCER code 2
        classCode2: classCd, // Example class code 2
        siteRiskCode2: siteRiskCd,
        sstCode2: sstCode,
        siteCrownLandContaminated: siteCrownLandContaminated,
        recentViewedSites: recentViewedSites
    },
    {
        id: '222',
        commonName: 'vancouver',
        bcerCode: 'BCER222',
        sstCode: 'SST222',
        addrType: 'type',
        addrLine_1: 'Address 5',
        addrLine_2: 'Address 6',
        addrLine_3: 'Address 7',
        addrLine_4: 'Address 8',
        city: 'City',
        provState: 'Province/State',
        postalCode: 'Postal Code',
        latdeg: 0, // Example latitude
        longdeg: 0, // Example longitude
        victoriaFileNo: 'File No 3',
        regionalFileNo: 'File No 4',
        classCode: 'Class Code',
        generalDescription: 'Description',
        whoCreated: 'Creator',
        whoUpdated: 'Updater',
        whenCreated: new Date(), // Example date
        whenUpdated: new Date(), // Example date
        rwmFlag: 1,
        rwmGeneralDescFlag: 1,
        consultantSubmitted: 'Consultant Submitted',
        longDegrees: 0, // Example long degrees
        longMinutes: 0, // Example long minutes
        longSeconds: '0', // Example long seconds
        latDegrees: 0, // Example lat degrees
        latMinutes: 0, // Example lat minutes
        latSeconds: '0', // Example lat seconds
        srStatus: 'SR Status',
        latlongReliabilityFlag: 'LatLong Reliability Flag',
        siteRiskCode: 'Site Risk Code',
        geometry: '{}', // Example geometry
        events: [], // Example events
        landHistories: [], // Example land histories
        mailouts: [], // Example mailouts
        siteAssocs: [], // Example site associations
        siteAssocs2: [], // Example site associations 2
        siteDocs: [], // Example site documents
        sitePartics: [], // Example site participants
        siteProfiles: [], // Example site profiles
        siteSubdivisions: [], // Example site subdivisions
        bcerCode2: bceRegionCd, // Example BCER code 2
        classCode2: classCd, // Example class code 2
        siteRiskCode2: siteRiskCd,
        sstCode2: sstCode,
        siteCrownLandContaminated: siteCrownLandContaminated,
        recentViewedSites: recentViewedSites
    }];