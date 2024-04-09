import { configureStore } from "@reduxjs/toolkit";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "./helpers/sessionManager";
import commonDataReducer from "./features/common/CommonDataSlice";
import { CommonData } from "./features/common/dto/CommonData";
import siteReducer from "./features/site/dto/SiteSlice";


const persistedStore: any = loadFromLocalStorage();

const commonData: CommonData = new CommonData();

///const initialState = { users: emptyUserState, applications: persistedStore , commonData:commonData };

//consoleLog("persistedStore", persistedStore);

export const store = configureStore({
  reducer: {  
    commonData: commonDataReducer,
    sites:siteReducer
  },

  // ,preloadedState: initialState,
});

store.subscribe(() => {
  //consoleLog("Store Modified", store.getState());

  // const { applications } = store.getState();

  // saveToLocalStorage(applications);
});

export type AppDispatch = typeof store.dispatch;
