import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import commonDataReducer from './features/common/CommonDataSlice';
import peopleReducer from './features/people/dto/PeopleSlice';
import { rootSaga } from './rootSaga';

const rootReducer = {
  commonData: commonDataReducer,
  peoples: peopleReducer,
};

/**
 * Reusable store factory. Registers Redux Saga middleware, starts the root
 * saga, and supports isolated test stores. Thunk middleware is disabled —
 * Saga is the only Redux side-effect mechanism.
 */
export const createAppStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const appStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: false,
      }).concat(sagaMiddleware),
  });

  sagaMiddleware.run(rootSaga);

  return appStore;
};

export const store = createAppStore();

store.subscribe(() => {
  // TODO
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
