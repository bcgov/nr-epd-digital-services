import { createRandomSite } from '@/api/dummy-data'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import siteDummyData from '@/scripts/dummy-data.sites.json';
import { Site } from '@/api/sites';
import { current } from '@reduxjs/toolkit'
import formatDateToString from '@/helpers/formatDateToString';



// Instantiate dummy data, e.g. turn strings into Date objects
// Use `as any` to get around fact that 'lastUpdated' is a string, not a date.
// Definitely causes redux issues though  - https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state
// Should potentially only initialize date object in the view, not the store?
// const parsedDummyData: Site[] = siteDummyData.map(siteData => new Site((siteData as any)))

// const addNotationBySiteIDNewTemp = (state, action) => {
//     const site: Site = state.value.find((todo) => todo.siteID === action.payload)
//     // site.notations.push();
//     // site.notations = [];
//     site.notations = [...site.notations, {
//         completed: new Date(),
//         createdAt: new Date(),
//         initiated: new Date(),
//         ministryContact: '',
//         notationClass: 'ENVIRONMENTAL MANAGEMENT ACT: GENERAL',
//         notationParticipants: [],
//         notationType: 'CERTIFICATE OF COMPLIANCE ISSUED USING RISK BASED STANDARDS',
//         note: '',
//         requestedActions: []
//     }]
// }

const addNotationBySiteIDNewTemp = (state, action) => {
    const site: Site = state.value.find((todo) => todo.siteID === action.payload)
    // site.notations.push();
    // site.notations = [];
    site.notations = [...site.notations, {
        completed: formatDateToString(new Date()),
        createdAt: formatDateToString(new Date()), 
        initiated: formatDateToString(new Date()), 
        ministryContact: '',
        notationClass: 'ENVIRONMENTAL MANAGEMENT ACT: GENERAL',
        notationParticipants: [],
        notationType: 'CERTIFICATE OF COMPLIANCE ISSUED USING RISK BASED STANDARDS',
        note: '',
        requestedActions: [],
        siteRegistry: false,
    }]

    // return state; // ???? can i do a ...spread patch in here?
}


export const siteSlice = createSlice({
    name: 'site',
    initialState: {
        // value: Array.from({length: 250}, _ => createRandomSite())
        // value: parsedDummyData
        value: siteDummyData
    },
    reducers: {
        add: () => console.log('site reducer add todo'), // Maybe not even necessary? SITE list won't mutate much, unlike site selection
        updateSite: (state, action: PayloadAction<Site>) => {
            state.value = state.value.map((site) =>
                site.siteID === action.payload.siteID ? action.payload : site
            )
        }

    }
})


// Action creators are generated for each case reducer function
export const { add, updateSite } = siteSlice.actions

export default siteSlice.reducer
