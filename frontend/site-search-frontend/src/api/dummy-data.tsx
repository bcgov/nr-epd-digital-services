import { faker } from '@faker-js/faker';
import type { Site } from './sites'


export function createRandomSite(): Site {
    return {
        uuid: faker.string.uuid(),
        siteID: faker.number.int({min: 15192, max: 20999}),
        address: faker.location.streetAddress(),
        // Lat and Longitude restricted to approximately BC (some Alberta, oceans, etc)
        latitude: faker.location.latitude({min: 48, max: 59}), 
        longitude: faker.location.longitude({min: -139, max: -118}),
        lastUpdated: faker.date.past({years: 10}),
        city: faker.location.city(),
        region: randomRegion(),


        victoriaFile: randomFileString(),
        regionalFile: 'N/A',
        parcelIDs: Array.from({length: 5}, _ => faker.number.int({min: 100000, max: 10000000})),
        locationDescription: 'LAT/LONGS CONFIRMED USING ICIS MAY 16,2013'
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