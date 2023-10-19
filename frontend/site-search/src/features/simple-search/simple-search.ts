import { createRandomSite } from '@/api/dummy-data'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import siteDummyData from '@/scripts/dummy-data.sites.json';
import { Site } from '@/api/sites';
import { current } from '@reduxjs/toolkit'
import formatDateToString from '@/helpers/formatDateToString';


export const siteSlice = createSlice({
    name: 'site',
    initialState: {
        // value: Array.from({length: 250}, _ => createRandomSite())
        value: siteDummyData as Site[]
    },
    reducers: {
        add: () => console.log('site reducer add todo'), // Maybe not even necessary? SITE list won't mutate much, unlike site selection
        updateSite: (state, action: PayloadAction<Site>) => {
            state.value = state.value.map((site) =>
                site.siteID === action.payload.siteID ? action.payload : site
            )
        },

        deleteNotation: (state, action: PayloadAction<{ siteUUID: string, notationUUID: string }>) => {
            // Find the site by siteUUID
            const site = state.value.find((site) => site.uuid === action.payload.siteUUID);
      
            if (site) {
              // Filter out the Notation with the provided UUID
              site.notations = site.notations.filter((notation) => notation.uuid !== action.payload.notationUUID);
            }
          },
    }
})


// Action creators are generated for each case reducer function
export const { add, updateSite, deleteNotation } = siteSlice.actions

export default siteSlice.reducer
