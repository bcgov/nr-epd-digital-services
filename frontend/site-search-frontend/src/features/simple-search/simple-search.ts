import { createRandomSite } from '@/api/dummy-data'
import { createSlice } from '@reduxjs/toolkit'
import siteDummyData from '@/scripts/dummy-data.sites.json';
import { Site } from '@/api/sites';

// Instantiate dummy data, e.g. turn strings into Date objects
const parsedDummyData = siteDummyData.map(siteData => new Site(siteData))


export const siteSlice = createSlice({
    name: 'site',
    initialState: {
        // value: Array.from({length: 250}, _ => createRandomSite())
        value: parsedDummyData
    },
    reducers: {
        add: ()=>console.log('site reducer add todo') // Maybe not even necessary? SITE list won't mutate much, unlike site selection
    }
})


// Action creators are generated for each case reducer function
export const { add } = siteSlice.actions

export default siteSlice.reducer
