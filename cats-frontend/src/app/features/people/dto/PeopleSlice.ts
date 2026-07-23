import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PeopleState } from './PeopleState';
import { RequestStatus } from '../../../helpers/requests/status';
import { Peoples } from './People';
import { UserType } from '../../../helpers/requests/userType';
import {
  PeopleSearchCriteria,
  PeopleSearchFailure,
  PeopleSearchResult,
} from './PeopleSearchTypes';
import { PeopleUpdateFailure, PeopleUpdateInput } from './PeopleUpdateTypes';

const initialState: PeopleState = {
  peoples: [],
  error: '',
  fetchStatus: RequestStatus.idle,
  deleteStatus: RequestStatus.idle,
  addedStatus: RequestStatus.idle,
  updateStatus: RequestStatus.idle,
  searchQuery: '',
  currentPage: 1,
  pageSize: 10,
  resultsCount: 0,
  lastSearchCriteria: null,
  changeTracker: [],
  //peopleDetailsMode: PeopleDetailsMode.ViewOnlyMode,
  resetPeopleDetails: false,
  userType: UserType.External,
};

const peopleSlice = createSlice({
  name: 'peoples',
  initialState,

  reducers: {
    setFetchLoadingState: (state, action) => {
      const newState = {
        ...state,
      };
      newState.fetchStatus = RequestStatus.loading;
      return newState;
    },
    resetPeoples: (state, action) => {
      const newState = {
        ...state,
      };
      newState.peoples = [];
      newState.fetchStatus = RequestStatus.idle;
      return newState;
    },
    resetUpdateStatus: (state, action) => {
      const newState = {
        ...state,
      };

      newState.updateStatus = RequestStatus.idle;
      newState.fetchStatus = RequestStatus.idle;

      return newState;
    },
    resetAddedStatus: (state, action) => {
      const newState = {
        ...state,
      };

      newState.addedStatus = RequestStatus.idle;
      newState.fetchStatus = RequestStatus.idle;

      return newState;
    },
    resetDeleteStatus: (state, action) => {
      const newState = {
        ...state,
      };
      newState.fetchStatus = RequestStatus.idle;
      newState.deleteStatus = RequestStatus.idle;
      return newState;
    },
    peopleAdded: {
      reducer(state, action) {
        const updatedArr: Peoples[] = [state.peoples, action.payload];
        state.peoples = updatedArr;
      },
      prepare(name: string, email: string): any {
        return {
          payload: {
            id: new Date().getTime(),
            name,
            email,
          },
        };
      },
    },
    updateSearchQuery: (state, action) => {
      const newState = {
        ...state,
      };
      newState.searchQuery = action.payload;
      return newState;
    },
    updatePageSizeSetting: (state, action) => {
      const newState = {
        ...state,
      };
      newState.currentPage = action.payload.currentPage;
      newState.pageSize = action.payload.pageSize;
      return newState;
    },
    trackChanges: (state, action) => {
      let recordExists = state.changeTracker.filter((tracked) => {
        return (
          tracked.changeType === action.payload.changeType &&
          tracked.label === action.payload.label
        );
      });

      if (recordExists.length === 0) {
        const newState = {
          ...state,
          changeTracker: [...state.changeTracker, action.payload],
          resetPeopleDetails: false,
        };
        return newState;
      } else {
        const newState = {
          ...state,
        };
        return newState;
      }
    },
    clearTrackChanges: (state, action) => {
      const newState = {
        ...state,
        changeTracker: [],
        resetPeopleDetails: true,
      };

      return newState;
    },
    updatePeopleDetailsMode: (state, action) => {
      const newState = {
        ...state,
        peopleDetailsMode: action.payload,
      };
      return newState;
    },
    updateUserType: (state, action) => {
      const newState = {
        ...state,
      };
      newState.userType = action.payload;
      return newState;
    },
    // Saga-driven People search lifecycle actions. These replace the former
    // fetchPeoples thunk with a typed request/success/failure convention.
    searchPeopleRequested: (
      state,
      action: PayloadAction<PeopleSearchCriteria>,
    ) => {
      const newState = { ...state };
      newState.lastSearchCriteria = action.payload;
      newState.fetchStatus = RequestStatus.loading;
      newState.error = '';
      return newState;
    },
    searchPeopleSucceeded: (
      state,
      action: PayloadAction<PeopleSearchResult>,
    ) => {
      const newState = { ...state };
      newState.fetchStatus = RequestStatus.success;
      newState.peoples = action.payload.persons;
      newState.resultsCount = action.payload.count;
      return newState;
    },
    searchPeopleFailed: (state, action: PayloadAction<PeopleSearchFailure>) => {
      const newState = { ...state };
      newState.fetchStatus = RequestStatus.failed;
      newState.error = action.payload.message;
      return newState;
    },
    // Saga-driven bulk People update lifecycle. Replaces the former
    // updatePeople thunk with typed request/success/failure actions.
    updatePeopleRequested: (
      state,
      _action: PayloadAction<PeopleUpdateInput[]>,
    ) => {
      const newState = { ...state };
      newState.updateStatus = RequestStatus.loading;
      newState.error = '';
      return newState;
    },
    updatePeopleSucceeded: (state) => {
      const newState = { ...state };
      newState.updateStatus = RequestStatus.success;
      return newState;
    },
    updatePeopleFailed: (state, action: PayloadAction<PeopleUpdateFailure>) => {
      const newState = { ...state };
      newState.updateStatus = RequestStatus.failed;
      newState.error = action.payload.message;
      return newState;
    },
  },
});

export const selectAllPeoples = (state: any) => {
  return state.peoples.peoples;
};
export const loadingState = (state: any) => state.peoples.fetchStatus;
export const updatePeopleStatus = (state: any) => state.peoples.updateStatus;
export const currentPageSelection = (state: any) => state.peoples.currentPage;
export const currentPageSize = (state: any) => state.peoples.pageSize;
export const resultsCount = (state: any) => state.peoples.resultsCount;
export const trackedChanges = (state: any) => state.peoples.changeTracker;
export const peopleDetailsMode = (state: any) =>
  state.peoples.peopleDetailsMode;
export const resetPeopleDetails = (state: any) =>
  state.peoples.resetPeopleDetails;
export const userTypeOnlyForDemo = (state: any) => state.peoples.userType;
export const searchError = (state: any) => state.peoples.error;
export const lastSearchCriteria = (state: any) =>
  state.peoples.lastSearchCriteria;

export const {
  peopleAdded,
  resetPeoples,
  setFetchLoadingState,
  updatePageSizeSetting,
  updateSearchQuery,
  trackChanges,
  clearTrackChanges,
  updatePeopleDetailsMode,
  updateUserType,
  searchPeopleRequested,
  searchPeopleSucceeded,
  searchPeopleFailed,
  updatePeopleRequested,
  updatePeopleSucceeded,
  updatePeopleFailed,
} = peopleSlice.actions;

export default peopleSlice.reducer;
