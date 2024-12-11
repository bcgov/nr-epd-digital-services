import { configureStore } from '@reduxjs/toolkit';
import commonDataReducer from './features/common/CommonDataSlice';
import dashboardReducer from './features/dashboard/DashboardSlice';


export const store = configureStore({
  reducer: {
    commonData: commonDataReducer,
    dashboard: dashboardReducer,
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
