import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/users/UsersSlice";
import applicationReducer from "./features/applications/ApplicationSlice";
import { consoleLog } from "./helpers/utility";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "./helpers/sessionManager";
import { UserState } from "./features/users/dto/UserState";

const persistedStore: any = loadFromLocalStorage();

const emptyUserState: UserState = new UserState();

const initialState = { users: emptyUserState, applications: persistedStore };

consoleLog("persistedStore", persistedStore);

export const store = configureStore({
  reducer: {
    users: usersReducer,
    applications: applicationReducer,
  },
  preloadedState: initialState,
});

store.subscribe(() => {
  consoleLog("Store Modified", store.getState());

  const { applications } = store.getState();

  saveToLocalStorage(applications);
});

export type AppDispatch = typeof store.dispatch;
