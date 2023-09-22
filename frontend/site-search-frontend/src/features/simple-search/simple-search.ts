import { createRandomSite } from '@/api/dummy-data'
import { createSlice } from '@reduxjs/toolkit'

import { combineReducers } from '@reduxjs/toolkit'


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

// export type RootState = ReturnType
// // export type RootState = ReturnType<typeof store.getState>
// // export type SiteSliceState: {

// // }

// // Infer the `RootState` and `AppDispatch` types from the store itself
// // export type RootState = ReturnType<typeof siteSlice.getState>
// // // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// // export type AppDispatch = typeof store.dispatch


// const rootReducer = combineReducers({})
// export type RootState = ReturnType<typeof rootReducer>