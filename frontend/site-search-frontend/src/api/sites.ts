
export class Site {
    uuid?: string;
    siteID: number;
    address: string;
    latitude: number;
    longitude: number;
    // lastUpdated: Date | string;
    lastUpdated: Date;
    city: string;
    region: string;
    victoriaFile: string;
    regionalFile: string;
    parcelIDs: number[];
    locationDescription: string;

    notations: Notation[]

    constructor(data: Site) {
        // Using "Object.assign()" to bypass having to assign all properties
        // https://stackoverflow.com/questions/69291358/shortcut-syntax-to-class-constructor-from-typescript-interface
        Object.assign(this, data);

        // This "new Date" is necessary when loading JSON dummy data which stores date as a string
        // This will likely have to change when integrating with API
        this.lastUpdated = new Date(this.lastUpdated);
    }
}

// interface OnSiteRegistry {
//     visibleOnSiteRegistry: boolean
// }


export class Notation {
    createdAt: Date;
    // notationType: NOTATION_TYPES
    notationType: 'CERTIFICATE OF COMPLIANCE ISSUED USING RISK BASED STANDARDS' | 'CERTIFICATE OF COMPLIANCE REQUESTED'
    notationClass: "ENVIRONMENTAL MANAGEMENT ACT: GENERAL"
    initiated: Date;
    completed: Date;
    ministryContact: string;
    note: string;
    requestedActions: string[]
    notationParticipants: {name: string, role: string, siteRegistry: boolean}[]

    constructor(data: Notation) {
        // See Site object for notes on constructor behaviour
        Object.assign(this, data);
        this.createdAt = new Date(this.createdAt);
        this.initiated = new Date(this.initiated);
        this.completed = new Date(this.completed);
    }
}

// export enum NOTATION_TYPES {
//     CERT_COMPLIANCE_ISSUED = 'CERTIFICATE OF COMPLIANCE ISSUED USING RISK BASED STANDARDS',
//     CERT_COMPLIANCE_REQUESTED = 'CERTIFICATE OF COMPLIANCE REQUESTED'
// }

// export enum NOTATION_CLASS {
//     ENV_GENERAL = 'ENVIRONMENTAL MANAGEMENT ACT: GENERAL'
// }