import { faker } from '@faker-js/faker';
import type { Site } from './sites'


export function createRandomSite(): Site {
    return {
        siteID: faker.number.int({min: 18192, max: 18999}),
        address: faker.location.streetAddress(),
        latitude: faker.location.latitude(), //TODO: Confine this to BC
        longitude: faker.location.longitude(), //TODO: Confine to BC
        lastUpdated: faker.date.past({years: 10})
    }
}

