
/**
 * Statically generate dummy data to a json file.  Why? More persistence among changes. 
 * Makes direct links work on refresh if IDs don't scramble each time.
 * 
 * 
 * HOW TO USE
 * 
 * Make the file executable:
 *  chmod +x generate-dummy-data.ts
 * 
 * Run ts-node (just on your dev machine):
 *      npx ts-node --esm generate-dummy-data.ts
 * 
 * Note: May need to install ts-node.
 */


import { createRandomSite } from '../api/dummy-data.tsx'
import { writeFile } from 'fs';


const output = Array.from({length: 250}, _ => createRandomSite());
const json = JSON.stringify(output);
console.log('Writing to JSON file...');
writeFile('dummy-data.sites.json', json, 'utf8', () => {
    console.log('Done writing JSON file: dummy-data.sites.json')
});
