import {configureStore, combineReducers} from "@reduxjs/toolkit";
import usersReducer from './features/users/UsersSlice';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
  }

  const reducers = combineReducers({
    users: usersReducer,
  });

  const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer
})