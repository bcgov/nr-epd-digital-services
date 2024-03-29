import { faker } from '@faker-js/faker';
import { SiteParticipant, type Notation, type Site, AssociatedSite, SuspectLandUse, SiteDisclosure, ActivityLogItem, SiteDisclosurePurpose, ParcelDescription, SiteDocument, DocumentParticipant } from './sites'
// import formatDateToString from '@/helpers/formatDateToString';
import formatDateToString from '../helpers/formatDateToString.ts'

export function generate({ siteCount }): Site[] {
    const output = Array.from({ length: siteCount }, _ => createRandomSite());

    // Update site.associatedSites
    const outputWithAssociations = createSiteAssociations(output);

    return outputWithAssociations;
}


export function createRandomSite(): Site {
    return {
        uuid: faker.string.uuid(),
        siteID: faker.number.int({ min: 15192, max: 20999 }),
        address: faker.location.streetAddress(),
        // Lat and Longitude restricted to approximately BC (some Alberta, oceans, etc)
        latitude: faker.location.latitude({ min: 48, max: 59 }),
        longitude: faker.location.longitude({ min: -139, max: -118 }),
        lastUpdated: formatDateToString(faker.date.past({ years: 10 })),
        city: faker.location.city(),
        region: randomRegion(),


        victoriaFile: randomFileString(),
        regionalFile: 'N/A',
        parcelIDs: Array.from({ length: 5 }, _ => faker.number.int({ min: 100000, max: 10000000 })),
        locationDescription: 'LAT/LONGS CONFIRMED USING ICIS MAY 16,2013',

        notations: createAndPopulateArray({ min: 2, max: 5, generator: randomNotation }),
        participants: createAndPopulateArray({ min: 2, max: 5, generator: randomSiteParticipant }),
        documents: createAndPopulateArray({min: 1, max: 5, generator: randomDocument}),
        suspectLandUses: createAndPopulateArray({ min: 2, max: 5, generator: randomSuspectLandUse }),
        parcelDescriptions: createAndPopulateArray({ min: 2, max: 5, generator: randomParcelDescription }),
        siteDisclosures: createAndPopulateArray({ min: 1, max: 2, generator: randomSiteDisclosure }),
        activityLog: createAndPopulateArray({ min: 5, max: 10, generator: randomActivityLogItem }),

        // Associated Sites is generated after site generation with `createSiteAssociations()`, as we need siteIDs already gen'd.
        associatedSites: []
    }
}

/**
 *  Helper function, creates an array of varying length (between min-max) and each item in array will be created by invoking generator().
 */
function createAndPopulateArray<T>({ min, max, generator }): T[] {
    return Array.from({ length: faker.number.int({ min, max }) }, () => { return generator() });
}

const REGIONS = ['Vancouver Island/Coast', 'Mainland/Southwest', 'Thompson-Okanagan', 'Kootenay', 'Cariboo', ' North Coast'];
function randomRegion() {
    const random = Math.floor(Math.random() * REGIONS.length)
    return REGIONS[random];
}

function randomFileString() {
    return `26250-20/${faker.number.int({ min: 700, max: 20000 })}`
}

function randomNotation(): Notation {

    function randomNotationParticipant() {
        return {
            uuid: faker.string.uuid(),
            name: faker.helpers.arrayElement(['SNC-LAVALIN ENVIRONMENT INC.', 'SHELL CANADA PRODUCTS']),
            role: faker.helpers.arrayElement(['SUBMITTED BY', 'REQUESTED BY']),
            siteRegistry: faker.datatype.boolean()
        }
    }

    return {
        uuid: faker.string.uuid(),
        createdAt: formatDateToString(faker.date.past({ years: 10 })),
        completed: formatDateToString(faker.date.past({ years: 10 })),
        initiated: formatDateToString(faker.date.past({ years: 10 })),
        ministryContact: faker.person.lastName().toUpperCase() + " " + faker.person.firstName().toUpperCase(),
        notationClass: "ENVIRONMENTAL MANAGEMENT ACT: GENERAL",
        note: '',
        notationType: 'CERTIFICATE OF COMPLIANCE REQUESTED',
        requestedActions: [''],
        notationParticipants: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => { return randomNotationParticipant() }),
        siteRegistry: faker.datatype.boolean(),
    }
}

function randomSiteParticipant(): SiteParticipant {

    return {
        uuid: faker.string.uuid(),
        name: faker.helpers.arrayElement(['SHELL CANADA PRODUCTS', 'SNC-LAVALIN ENVIRONMENT INC', 'IPSUM', 'AMET, DOLOR SIT']),
        endDate: formatDateToString(faker.date.past({ years: 10 })),
        startDate: formatDateToString(faker.date.past({ years: 10 })),
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

        site.associatedSites = Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => { return randomAssociation(siteIDs, site.siteID) })

        return site;
    })

    return sitesWithAssociations;
}

function randomAssociation(siteIDs: number[], parentSiteID: number): AssociatedSite {
    const validSiteIDs = siteIDs.filter(x => x !== parentSiteID);

    return {
        uuid: faker.string.uuid(),
        dateNoted: formatDateToString(faker.date.past({ years: 10 })),
        notes: '',
        parcelID: faker.number.int({ min: 15192, max: 20999 }).toString(),
        siteID: faker.helpers.arrayElement(validSiteIDs).toString(),
        siteRegistry: faker.datatype.boolean(),
    }

}

function randomSuspectLandUse(): SuspectLandUse {
    const date = formatDateToString(faker.date.past({ years: 10 }));

    return {
        uuid: faker.string.uuid(),
        siteRegistry: faker.datatype.boolean(),
        notes: `INSERTED FOR SITE PROFILE DATED ${date} (described on Site Profile dated ${date})`,
        landUse: faker.helpers.arrayElement(['PETROLEUM OR NATURAL GAS PRODUCTION FACILITIES', 'PETROLEUM OR NATURAL GAS DRILLING']),
    }
}

function randomSiteDisclosure(): SiteDisclosure {
    return {
        uuid: faker.string.uuid(),
        siteRegistry: faker.datatype.boolean(),
        dateReceived: formatDateToString(faker.date.past({ years: 10 })),
        dateCompleted: formatDateToString(faker.date.past({ years: 10 })),
        dateEntered: formatDateToString(faker.date.past({ years: 10 })),
        dateRegistrar: formatDateToString(faker.date.past({ years: 10 })),
        dateLocalAuthorityReceived: formatDateToString(faker.date.past({ years: 10 })),
        summary: faker.lorem.lines({ min: 1, max: 3 }),
        informationUsed: faker.lorem.lines({ min: 3, max: 5 }),
        pastOrPresentOrders: faker.lorem.lines({ min: 1, max: 3 }),
        commercialAndIndustrialPurposes: createAndPopulateArray({ min: 2, max: 4, generator: randomSiteCommercialIndustrialActivity })



    }

}

function randomSiteCommercialIndustrialActivity(): SiteDisclosurePurpose {
    return {
        uuid: faker.string.uuid(),
        scheduleReference: faker.helpers.arrayElement(['F1*', 'F2*']),
        description: faker.helpers.arrayElement(['PETROLEUM OR NATURAL GAS PRODUCTION FACILITIES', 'PETROLEUM OR NATURAL GAS DRILLING']),
        siteRegistry: faker.datatype.boolean()
    }
}

function randomActivityLogItem(): ActivityLogItem {

    return {
        uuid: faker.string.uuid(),
        siteRegistry: faker.datatype.boolean(),
        activity: 'Lorem ipsum dolor sit amet',
        user: faker.person.lastName().toUpperCase() + " " + faker.person.firstName().toUpperCase(),
        timestamp: formatDateToString(faker.date.past({ years: 10 }))
    }

}

function randomParcelDescription(): ParcelDescription {
    const lot = faker.number.int({ min: 1, max: 5 })
    const secondLot = faker.number.int({ min: 1, max: 5 })
    const block = faker.number.int({ min: 1, max: 5 })
    const district = faker.number.int({ min: 1, max: 5 })
    const plan = faker.number.int({ min: 2901, max: 9802 })

    return {
        uuid: faker.string.uuid(),
        siteRegistry: faker.datatype.boolean(),
        dateNoted: formatDateToString(faker.date.past({ years: 10 })),
        parcelID: faker.number.int({ min: 15192, max: 20999 }).toString(),
        crownLandUsePIN: faker.number.int({ min: 15192, max: 20999 }).toString(),
        crownLandFileNumber: faker.number.int({ min: 15192, max: 20999 }).toString(),
        landDescription: `LOT ${lot} OF LOT ${secondLot} BLOCK ${block} DISTRICT LOT ${district} PLAN ${plan}`
    }
}

function randomDocument(): SiteDocument {


    return {
        uuid: faker.string.uuid(),
        siteRegistry: faker.datatype.boolean(),
        documentDate:  formatDateToString(faker.date.past({ years: 10 })),
        receivedDate: formatDateToString(faker.date.past({ years: 10 })),
        uploadedDate:  formatDateToString(faker.date.past({ years: 10 })),
        title: faker.helpers.arrayElement([
            'Human Health and Ecological Risk Assessment for the Management Area adjacent to the Shell Site at 1503 West 41st Avenue, Vancouver BC (LC C010106)',
            'Summary of Site Conditions, 1537 W 41st Avenue, Vancouver',
            'Preliminary Site Investigation, Detailed Site Investigation and Remedial Plan for the Management Area adjacent to the Shell Site at 1503 West 41st Ave',
        ]),
        participants: createAndPopulateArray({min: 1, max: 3, generator: randomDocumentParticipant})
    }
}

function randomDocumentParticipant(): DocumentParticipant {

    return {
        uuid: faker.string.uuid(),
        name: faker.helpers.arrayElement(['SHELL CANADA PRODUCTS', 'SNC-LAVALIN ENVIRONMENT INC', 'IPSUM', 'AMET, DOLOR SIT']),
        siteRegistry: faker.datatype.boolean(),
        role: 'AUTHOR'
    }
}

