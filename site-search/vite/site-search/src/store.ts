import { configureStore } from '@reduxjs/toolkit'
import siteReducer from '@/features/simple-search/simple-search'

export default configureStore({
  reducer: {
    site: siteReducer
  }
})