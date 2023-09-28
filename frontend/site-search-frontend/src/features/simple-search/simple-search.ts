import { createRandomSite } from '@/api/dummy-data'
import { createSlice } from '@reduxjs/toolkit'
import siteDummyData from '@/scripts/dummy-data.sites.json';
import { Site } from '@/api/sites';

// Instantiate dummy data, e.g. turn strings into Date objects
// Use `as any` to get around fact that 'lastUpdated' is a string, not a date.
// Definitely causes redux issues though  - https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state
// Should potentially only initialize date object in the view, not the store?
const parsedDummyData = siteDummyData.map(siteData => new Site((siteData as any)))


export const siteSlice = createSlice({
    name: 'site',
    initialState: {
        // value: Array.from({length: 250}, _ => createRandomSite())
        value: parsedDummyData
        // value: siteDummyData
    },
    reducers: {
        add: ()=>console.log('site reducer add todo') // Maybe not even necessary? SITE list won't mutate much, unlike site selection
    }
})


// Action creators are generated for each case reducer function
export const { add } = siteSlice.actions

export default siteSlice.reducer
