import { configureStore } from '@reduxjs/toolkit'
import siteReducer from '@/features/simple-search/simple-search'
import userReducer from '@/features/user/userSlice'
import editReducer from '@/features/site-details/edit-mode/editModeSlice'

const store = configureStore({
  reducer: {
    site: siteReducer,
    user: userReducer,
    edit: editReducer
  }
})

export default store;

export type RootState = ReturnType<typeof store.getState>