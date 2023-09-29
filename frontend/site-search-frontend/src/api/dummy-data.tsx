import { faker } from '@faker-js/faker';
import { SiteParticipant, type Notation, type Site, AssociatedSite } from './sites'
// import formatDateToString from '@/helpers/formatDateToString';
import formatDateToString from '../helpers/formatDateToString.ts'

export function generate({ siteCount }): Site[] {
    const output = Array.from({length: siteCount}, _ => createRandomSite());

    // Update site.associatedSites
    const outputWithAssociations = createSiteAssociations(output);

    return outputWithAssociations;
}


export function createRandomSite(): Site {
    return {
        uuid: faker.string.uuid(),
        siteID: faker.number.int({min: 15192, max: 20999}),
        address: faker.location.streetAddress(),
        // Lat and Longitude restricted to approximately BC (some Alberta, oceans, etc)
        latitude: faker.location.latitude({min: 48, max: 59}), 
        longitude: faker.location.longitude({min: -139, max: -118}),
        lastUpdated: formatDateToString(faker.date.past({years: 10})),
        city: faker.location.city(),
        region: randomRegion(),


        victoriaFile: randomFileString(),
        regionalFile: 'N/A',
        parcelIDs: Array.from({length: 5}, _ => faker.number.int({min: 100000, max: 10000000})),
        locationDescription: 'LAT/LONGS CONFIRMED USING ICIS MAY 16,2013',

        // Generate 1-5 notations
        notations: Array.from({length: faker.number.int({min: 2, max: 5}) }, () => { return randomNotation() }),
        participants: Array.from({length: faker.number.int({min: 2, max: 5}) }, () => { return randomSiteParticipant() }),

        // Associated Sites is generated after site generation with `createSiteAssociations()`, as we need siteIDs already gen'd.
        associatedSites: []

    }
}

const REGIONS = ['Vancouver Island/Coast', 'Mainland/Southwest', 'Thompson-Okanagan', 'Kootenay', 'Cariboo',' North Coast'];
function randomRegion() {
    const random = Math.floor(Math.random() * REGIONS.length)
    return REGIONS[random];
}

function randomFileString(){
    return `26250-20/${ faker.number.int({min: 700, max: 20000})}`
}

function randomNotation(): Notation {

    function randomNotationParticipant() {
        return {
            name: faker.helpers.arrayElement(['SNC-LAVALIN ENVIRONMENT INC.', 'SHELL CANADA PRODUCTS']),
            role: faker.helpers.arrayElement(['SUBMITTED BY', 'REQUESTED BY']),
            siteRegistry: faker.datatype.boolean()
        }
    }

    return {
        createdAt: formatDateToString(faker.date.past({years: 10})),
        completed: formatDateToString(faker.date.past({years: 10})),
        initiated: formatDateToString(faker.date.past({years: 10})),
        ministryContact: faker.person.lastName().toUpperCase() + " " + faker.person.firstName().toUpperCase(),
        notationClass: "ENVIRONMENTAL MANAGEMENT ACT: GENERAL",
        note: '',
        notationType: 'CERTIFICATE OF COMPLIANCE REQUESTED',
        requestedActions: [''],
        notationParticipants: Array.from({length: faker.number.int({min: 2, max: 5})}, () => {return randomNotationParticipant()}),
        siteRegistry: faker.datatype.boolean(),
    }
}

function randomSiteParticipant(): SiteParticipant {

    return {
       name: faker.helpers.arrayElement(['SHELL CANADA PRODUCTS', 'SNC-LAVALIN ENVIRONMENT INC', 'IPSUM', 'AMET, DOLOR SIT']),
       endDate: formatDateToString(faker.date.past({years: 10})),
       startDate: formatDateToString(faker.date.past({years: 10})),
       notes: '',
       roles: [faker.helpers.arrayElement(['ORGANIZATION', 'EMPLOYEE'])],
       siteRegistry: faker.datatype.boolean()
    }
}

function createSiteAssociations(sites: Site[]): Site[] {

    // iterate through sites, get random site ids, and use those to create other ones
    // make sure every site has 2-5 associations
    const siteIDs = sites.map(x => x.siteID);

    const sitesWithAssociations = sites.map(site => {

        site.associatedSites = Array.from({length: faker.number.int({min: 1, max: 3})}, () => {return randomAssociation(siteIDs, site.siteID)})

        return site;
    })

    return sitesWithAssociations;
}

function randomAssociation(siteIDs: number[], parentSiteID: number): AssociatedSite {
    const validSiteIDs = siteIDs.filter(x => x !== parentSiteID);

    return {
        dateNoted: formatDateToString(faker.date.past({years: 10})),
        notes: '',
        parcelID:  faker.number.int({min: 15192, max: 20999}).toString(),
        siteID: faker.helpers.arrayElement(validSiteIDs).toString(),
        siteRegistry: faker.datatype.boolean(),
    }

}