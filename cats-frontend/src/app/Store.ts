import { configureStore } from '@reduxjs/toolkit';
import commonDataReducer from './features/common/CommonDataSlice';
import dashboardReducer from './features/dashboard/DashboardSlice';
import peopleReducer from './features/people/dto/PeopleSlice';
import searchReducer from './features/applications/search/searchSlice';

export const store = configureStore({
  reducer: {
    commonData: commonDataReducer,
    dashboard: dashboardReducer,
    peoples: peopleReducer,
    applicationSearch: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

store.subscribe(() => {
  // TODO
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
