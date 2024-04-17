import { configureStore } from "@reduxjs/toolkit";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "./helpers/sessionManager";
import commonDataReducer from "./features/common/CommonDataSlice";
import siteReducer from "./features/site/dto/SiteSlice";
import thunk from 'redux-thunk';


const persistedStore: any = loadFromLocalStorage();

export const store = configureStore({
  reducer: {  
    commonData: commonDataReducer,
    sites:siteReducer
  },
});

store.subscribe(() => {
// TODO
});

export type AppDispatch = typeof store.dispatch;
