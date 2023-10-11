interface canBeOnSiteRegistry {
    siteRegistry: boolean;
}

interface hasUUID {
    uuid: string;
}

export class Site {
    uuid: string;
    siteID: number;
    address: string;
    latitude: number;
    longitude: number;
    // lastUpdated: Date | string;
    lastUpdated: string;
    city: string;
    region: string;
    victoriaFile: string;
    regionalFile: string;
    parcelIDs: number[];
    locationDescription: string;

    notations: Notation[];
    participants: SiteParticipant[];
    associatedSites: AssociatedSite[];

    suspectLandUses: SuspectLandUse[];
    parcelDescriptions: ParcelDescription[]
    siteDisclosures: SiteDisclosure[];
    activityLog: ActivityLogItem[];

}



export class Notation implements canBeOnSiteRegistry, hasUUID {
    uuid: string;
    createdAt: string;
    notationType: 'CERTIFICATE OF COMPLIANCE ISSUED USING RISK BASED STANDARDS' | 'CERTIFICATE OF COMPLIANCE REQUESTED' | string
    notationClass: "ENVIRONMENTAL MANAGEMENT ACT: GENERAL" | string
    initiated: string;
    completed: string;
    ministryContact: string;
    note: string;
    requestedActions: string[]
    notationParticipants: {name: string, role: string, siteRegistry: boolean, uuid: string}[]
    siteRegistry: boolean;
}


export class SiteParticipant implements canBeOnSiteRegistry, hasUUID {
    uuid: string;
    name: string;
    roles: string[];
    startDate: string;
    endDate: string;
    notes: string;
    siteRegistry: boolean;
}

export class AssociatedSite implements canBeOnSiteRegistry, hasUUID {
    uuid: string;
    siteID: string;
    parcelID: string;
    dateNoted: string;
    notes: string;
   siteRegistry: boolean;
}

export class SuspectLandUse implements canBeOnSiteRegistry, hasUUID {
   uuid: string;
   siteRegistry: boolean;
   landUse: string;
   notes: string; 
}

export class ParcelDescription implements canBeOnSiteRegistry, hasUUID {
    uuid: string;
    siteRegistry: boolean;
    dateNoted: string;
    parcelID: string;
    crownLandUsePIN: string;
    crownLandFileNumber: string;
    landDescription: string;
}

export class SiteDisclosure implements canBeOnSiteRegistry, hasUUID {
    uuid: string;
    siteRegistry: boolean;
    dateReceived: string;
    dateCompleted: string;
    dateLocalAuthorityReceived: string;
    dateRegistrar: string;
    dateEntered: string;

    commercialAndIndustrialPurposes: SiteDisclosurePurpose[]

    summary: string;
    informationUsed: string;
    pastOrPresentOrders: string;
}

export class SiteDisclosurePurpose implements canBeOnSiteRegistry, hasUUID {
    uuid: string;
    scheduleReference: string;
    description: string;
    siteRegistry: boolean

}

export class ActivityLogItem implements canBeOnSiteRegistry, hasUUID {
    uuid: string;
    siteRegistry: boolean;
    activity: string;
    user: string;
    timestamp: string;
}