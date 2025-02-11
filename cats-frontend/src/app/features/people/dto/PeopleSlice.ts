import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAxiosInstance, getUser } from "../../../helpers/utility";
import { print } from "graphql";
import {
  graphQlPeopleQuery,
  graphqlPeopleDetailsQuery,
  graphqlPeopleDetailsQueryForLoggedIn,
  graphQlPeopleQueryForAuthenticatedUsers,
  updatePerson,
} from "../graphql/People";
import { PeopleState } from "./PeopleState";
import { RequestStatus } from "../../../helpers/requests/status";
import { PeopleResultDto, Peoples } from "./People";
import { GRAPHQL } from "../../../helpers/endpoints";
//import { PeopleDetailsMode } from '../../details/dto/PeopleDetailsMode';
import { UserType } from "../../../helpers/requests/userType";
import Search from "../Search";
import { error } from "console";

const initialState: PeopleState = {
  peoples: [],
  error: "",
  fetchStatus: RequestStatus.idle,
  deleteStatus: RequestStatus.idle,
  addedStatus: RequestStatus.idle,
  updateStatus: RequestStatus.idle,
  searchQuery: "",
  currentPage: 1,
  pageSize: 10,
  resultsCount: 0,
  peopleDetails: null,
  peopleDetailsFetchStatus: RequestStatus.idle,
  peopleDetailsDeleteStatus: RequestStatus.idle,
  peopleDetailsAddedStatus: RequestStatus.idle,
  peopleDetailsUpdateStatus: RequestStatus.idle,
  changeTracker: [],
  //peopleDetailsMode: PeopleDetailsMode.ViewOnlyMode,
  resetPeopleDetails: false,
  userType: UserType.External,
};

export const fetchPeoplesDetails = createAsyncThunk(
  "peoples/fetchPeoplesDetails",
  async (args: { peopleId: string; showPending: Boolean }) => {
    try {
      const { peopleId } = args;
      const user = getUser();
      const response = await getAxiosInstance().post(GRAPHQL, {
        query: print(
          user
            ? graphqlPeopleDetailsQueryForLoggedIn()
            : graphqlPeopleDetailsQuery()
        ),
        variables: {
          peopleId: args.peopleId,
          pending: args.showPending,
        },
      });
      return user
        ? response.data?.data?.findPeopleByPeopleIdLoggedInUser?.data
        : response.data?.data?.findPeopleByPeopleId?.data;
    } catch (error) {
      throw error;
    }
  }
);

export const updatePeople = createAsyncThunk(
  "updatePeople",
  async (input: any[]) => {
    const request = await getAxiosInstance().post(GRAPHQL, {
      query: print(updatePerson()),
      variables: {
        input: input,
      },
    });
    return request.data;
  }
);

export const fetchPeoples = createAsyncThunk(
  "peoples/fetchPeoples",
  async (
    args: {
      searchParam?: string;
      page?: number;
      pageSize?: number;
      filter?: {};
    },
    { getState }
  ) => {
    const state: any = getState();
    const response = await getAxiosInstance().post(GRAPHQL, {
      query: print(graphQlPeopleQuery()),
      variables: {
        searchParam: args.searchParam,
        page: state.peoples.currentPage ?? 1,
        pageSize: state.peoples.pageSize ?? 5,
      },
    });

    if (response.data?.errors?.length > 0) {
      throw response.data?.errors[0];
    } else return response.data?.data?.searchPerson;
  }
);

const peopleSlice = createSlice({
  name: "peoples",
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
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPeoples.pending, (state, action) => {
        const newState = { ...state };
        newState.fetchStatus = RequestStatus.loading;
        return newState;
      })
      .addCase(fetchPeoples.fulfilled, (state, action) => {
        const newState = { ...state };
        newState.fetchStatus = RequestStatus.success;
        newState.peoples = action.payload.persons;
        newState.resultsCount = action.payload.count;
        return newState;
      })
      .addCase(fetchPeoples.rejected, (state, action) => {
        const newState = { ...state };
        return newState;
      })
      .addCase(fetchPeoplesDetails.pending, (state, action) => {
        const newState = { ...state };
        newState.peopleDetailsFetchStatus = RequestStatus.loading;
        return newState;
      })
      .addCase(fetchPeoplesDetails.fulfilled, (state, action) => {
        const newState = { ...state };
        newState.peopleDetails = action.payload;
        newState.peopleDetailsFetchStatus = RequestStatus.success;
        return newState;
      })
      .addCase(fetchPeoplesDetails.rejected, (state, action) => {
        const newState = { ...state };
        newState.peopleDetailsFetchStatus = RequestStatus.failed;
        return newState;
      })
      .addCase(updatePeople.pending, (state, action) => {
        const newState = { ...state };
        newState.updateStatus = RequestStatus.loading;
        return newState;
      })
      .addCase(updatePeople.fulfilled, (state, action) => {
        const newState = { ...state };
        newState.updateStatus = RequestStatus.success;
        return newState;
      })
      .addCase(updatePeople.rejected, (state, action) => {
        const newState = { ...state };
        newState.updateStatus = RequestStatus.failed;
        return newState;
      });
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
export const peopleDetailsLoadingState = (state: any) =>
  state.peoples.fetchPeoplesDetails;
export const selectPeopleDetails = (state: any) => state.peoples.peopleDetails;
export const trackedChanges = (state: any) => state.peoples.changeTracker;
export const peopleDetailsMode = (state: any) =>
  state.peoples.peopleDetailsMode;
export const resetPeopleDetails = (state: any) =>
  state.peoples.resetPeopleDetails;
export const userTypeOnlyForDemo = (state: any) => state.peoples.userType;

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
} = peopleSlice.actions;

export default peopleSlice.reducer;
