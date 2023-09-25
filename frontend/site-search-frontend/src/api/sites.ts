
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

    constructor(data: Site) {
        // Using "Object.assign()" to bypass having to assign all properties
        // https://stackoverflow.com/questions/69291358/shortcut-syntax-to-class-constructor-from-typescript-interface
        Object.assign(this, data);
        this.lastUpdated = new Date(this.lastUpdated);
    }
}