import { configureStore } from '@reduxjs/toolkit'
import siteReducer from '@/features/simple-search/simple-search'

const store = configureStore({
  reducer: {
    site: siteReducer
  }
})

export default store;

export type RootState = ReturnType<typeof store.getState>