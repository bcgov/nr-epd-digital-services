import { createRandomSite } from '@/api/dummy-data'
import { createSlice } from '@reduxjs/toolkit'


export const siteSlice = createSlice({
    name: 'site',
    initialState: {
        // value: [createRandomSite()]
        // value: (new Array(100)).fill(createRandomSite)
        value: Array.from({length: 250}, _ => createRandomSite())
        // value: Array.from({length: 25000}, _ => createRandomSite())
    },
    reducers: {
        add: ()=>console.log('todo') // Maybe not even necessary? SITE list won't mutate much, unlike site selection
    }
})


// Action creators are generated for each case reducer function
export const { add } = siteSlice.actions

export default siteSlice.reducer
