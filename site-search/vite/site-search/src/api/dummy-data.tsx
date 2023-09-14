import { faker } from '@faker-js/faker';
import type { Site } from './sites'


export function createRandomSite(): Site {
    return {
        uuid: faker.string.uuid(),
        siteID: faker.number.int({min: 15192, max: 20999}),
        address: faker.location.streetAddress(),
        latitude: faker.location.latitude(), //TODO: Confine this to BC
        longitude: faker.location.longitude(), //TODO: Confine to BC
        lastUpdated: faker.date.past({years: 10}),
        city: faker.location.city(),
        region: randomRegion()
    }
}

const REGIONS = ['Vancouver Island/Coast', 'Mainland/Southwest', 'Thompson-Okanagan', 'Kootenay', 'Cariboo',' North Coast'];
function randomRegion() {
    const random = Math.floor(Math.random() * REGIONS.length)
    return REGIONS[random];
}