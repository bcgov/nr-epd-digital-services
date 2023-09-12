import { faker } from '@faker-js/faker';


function createRandomSite() {
    return {
        siteID: faker.number.int({min: 18192, max: 18999}),
        address: faker.location.streetAddress(),
        latitude: faker.location.latitude(), //TODO: Confine this to BC
        longitude: faker.location.longitude() //TODO: Confine to BC
    }
}