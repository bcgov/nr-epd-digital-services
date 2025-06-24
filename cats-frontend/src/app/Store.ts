import { configureStore } from '@reduxjs/toolkit';
import commonDataReducer from './features/common/CommonDataSlice';
import peopleReducer from './features/people/dto/PeopleSlice';

export const store = configureStore({
  reducer: {
    commonData: commonDataReducer,
    peoples: peopleReducer,
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
