import { createRandomSite } from '@/api/dummy-data'
import { createSlice } from '@reduxjs/toolkit'

export const siteSlice = createSlice({
    name: 'site',
    initialState: {
        value: [createRandomSite()]
    },
    reducers: {
        add: ()=>console.log('todo') // Maybe not even necessary? SITE list won't mutate much, unlike site selection
    }
})


// Action creators are generated for each case reducer function
export const { add } = siteSlice.actions

export default siteSlice.reducer