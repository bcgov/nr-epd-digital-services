import {configureStore} from "@reduxjs/toolkit";
import usersReducer from './features/users/UsersSlice';
import applicationReducer from "./features/applications/ApplicationSlice";
import { consoleLog } from "./helpers/utility";
import { loadFromLocalStorage, saveToLocalStorage } from "./helpers/sessionManager";

const persistedStore = loadFromLocalStorage();

const initialState = { users :{}, applications: persistedStore}

consoleLog('persistedStore',persistedStore)

export const store = configureStore({reducer:{
  users: usersReducer,
  applications:applicationReducer
},initialState})

store.subscribe(()=>
{
  consoleLog('Store Modified', store.getState())

  const {applications} = store.getState();


  saveToLocalStorage(applications);
})






