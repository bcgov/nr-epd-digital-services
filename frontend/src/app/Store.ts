import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/users/UsersSlice";
import applicationReducer from "./features/applications/ApplicationSlice";
import { consoleLog } from "./helpers/utility";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "./helpers/sessionManager";
import { UserState } from "./features/users/dto/UserState";
import commonDataReducer from "./features/common/CommonDataSlice";
import { CommonData } from "./features/common/dto/CommonData";

const persistedStore: any = loadFromLocalStorage();

const emptyUserState: UserState = new UserState();

const commonData: CommonData = new CommonData();

///const initialState = { users: emptyUserState, applications: persistedStore , commonData:commonData };

//consoleLog("persistedStore", persistedStore);

export const store = configureStore({
  reducer: {
    users: usersReducer,
    applications: applicationReducer,
    commonData: commonDataReducer,
  },

  // ,preloadedState: initialState,
});

store.subscribe(() => {
  //consoleLog("Store Modified", store.getState());

  const { applications } = store.getState();

  saveToLocalStorage(applications);
});

export type AppDispatch = typeof store.dispatch;
