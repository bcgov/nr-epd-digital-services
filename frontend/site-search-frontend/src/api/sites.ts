interface canBeOnSiteRegistry {
    siteRegistry: boolean;
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
    siteDisclosures: SiteDisclosure[];
    activityLog: ActivityLogItem[];


    // constructor(data: Site) {
    //     // Using "Object.assign()" to bypass having to assign all properties
    //     // https://stackoverflow.com/questions/69291358/shortcut-syntax-to-class-constructor-from-typescript-interface
    //     Object.assign(this, data);

    //     // This "new Date" is necessary when loading JSON dummy data which stores date as a string
    //     // This will likely have to change when integrating with API
    //     // this.lastUpdated = new Date(this.lastUpdated);

    //     // Initialize all dates inside notations too
    //     this.notations = this.notations.map(note => new Notation(note));
    // }
}

// interface OnSiteRegistry {
//     visibleOnSiteRegistry: boolean
// }


export class Notation implements canBeOnSiteRegistry {
    createdAt: string;
    // notationType: NOTATION_TYPES
    notationType: 'CERTIFICATE OF COMPLIANCE ISSUED USING RISK BASED STANDARDS' | 'CERTIFICATE OF COMPLIANCE REQUESTED' | string
    // notationClass: "ENVIRONMENTAL MANAGEMENT ACT: GENERAL"
    notationClass: "ENVIRONMENTAL MANAGEMENT ACT: GENERAL" | string
    initiated: string;
    completed: string;
    ministryContact: string;
    note: string;
    requestedActions: string[]
    notationParticipants: {name: string, role: string, siteRegistry: boolean}[]
    siteRegistry: boolean;

    // constructor(data: Notation) {
    //     // See Site object for notes on constructor behaviour
    //     Object.assign(this, data);
    //     // this.createdAt = new Date(this.createdAt);
    //     // this.initiated = new Date(this.initiated);
    //     // this.completed = new Date(this.completed);
    // }
}


export class SiteParticipant implements canBeOnSiteRegistry {
    name: string;
    roles: string[];
    startDate: string;
    endDate: string;
    notes: string;
    siteRegistry: boolean;
}

export class AssociatedSite implements canBeOnSiteRegistry {
    siteID: string;
    parcelID: string;
    dateNoted: string;
    notes: string;
   siteRegistry: boolean;
}

export class SuspectLandUse implements canBeOnSiteRegistry {
   siteRegistry: boolean;
   landUse: string;
   notes: string; 
}

export class ParcelDescription implements canBeOnSiteRegistry {
    siteRegistry: boolean;
    dateNoted: string;
    parcelID: string;
    crownLandUsePIN: string;
    crownLandFileNumber: string;
    landDescription: string;
}

export class SiteDisclosure implements canBeOnSiteRegistry {
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

export class SiteDisclosurePurpose implements canBeOnSiteRegistry {
    scheduleReference: string;
    description: string;
    siteRegistry: boolean

}

export class ActivityLogItem implements canBeOnSiteRegistry {
    siteRegistry: boolean;
    activity: string;
    user: string;
    timestamp: string;
}