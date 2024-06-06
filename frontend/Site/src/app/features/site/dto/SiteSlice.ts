import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAxiosInstance } from "../../../helpers/utility";
import { print } from "graphql";
import { graphQlSiteQuery, graphqlSiteDetailsQuery } from "../graphql/Site";
import { SiteState } from "./SiteState";
import { RequestStatus } from "../../../helpers/requests/status";
import { SiteResultDto } from "./Site";
import { GRAPHQL } from "../../../helpers/endpoints";
import { act } from "react-dom/test-utils";
import { useActionData } from "react-router-dom";
import { SiteDetailsMode } from "../../details/dto/SiteDetailsMode";

const initialState: SiteState = {
  sites: [],
  error: "",
  fetchStatus: RequestStatus.idle,
  deleteStatus: RequestStatus.idle,
  addedStatus: RequestStatus.idle,
  updateStatus: RequestStatus.idle,
  searchQuery: "",
  currentPage: 1,
  pageSize: 10,
  resultsCount: 0,
  siteDetails: null,
  siteDetailsFetchStatus: RequestStatus.idle,
  siteDetailsDeleteStatus: RequestStatus.idle,
  siteDetailsAddedStatus: RequestStatus.idle,
  siteDetailsUpdateStatus: RequestStatus.idle,
  changeTracker: [],
  siteDetailsMode: SiteDetailsMode.ViewOnlyMode,
  resetSiteDetails: false,
};

export const fetchSitesDetails = createAsyncThunk(
  "sites/fetchSitesDetails",
  async (args: { siteId: string }) => {
    try {
      const { siteId } = args;

      const response = await getAxiosInstance().post(GRAPHQL, {
        query: print(graphqlSiteDetailsQuery()),
        variables: {
          siteId: siteId,
        },
      });
      return response.data.data.findSiteBySiteId.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchSites = createAsyncThunk(
  "sites/fetchSites",
  async (
    args: {
      searchParam?: string;
      page?: string;
      pageSize?: string;
      filter?: {};
    },
    { getState }
  ) => {
    try {
      const {
        searchParam = "",
        page = "1",
        pageSize = "10",
        filter = {},
      } = args;
      const state: any = getState();
      const response = await getAxiosInstance().post(GRAPHQL, {
        query: print(graphQlSiteQuery(filter)),
        variables: {
          searchParam: searchParam,
          page: "" + state.sites.currentPage,
          pageSize: "" + state.sites.pageSize,
          ...filter,
        },
      });
      return response.data.data.searchSites;
    } catch (error) {
      throw error;
    }
  }
);

const siteSlice = createSlice({
  name: "sites",
  initialState,

  reducers: {
    setFetchLoadingState: (state, action) => {
      const newState = {
        ...state,
      };
      newState.fetchStatus = RequestStatus.loading;
      return newState;
    },
    resetSites: (state, action) => {
      const newState = {
        ...state,
      };
      newState.sites = [];
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
    siteAdded: {
      reducer(state, action) {
        const updatedArr: SiteResultDto[] = [state.sites, action.payload];
        state.sites = updatedArr;
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
      console.log("reste");
      const newState = {
        ...state,
      };
      newState.currentPage = action.payload.currentPage;
      newState.pageSize = action.payload.pageSize;
      return newState;
    },
    trackChanges: (state, action) => {
      console.log("tracking change", state, action);

     let recordExists =   state.changeTracker.filter((tracked)=>{
         return tracked.changeType === action.payload.changeType && tracked.label === action.payload.label
      })

      if (recordExists.length === 0) {
        const newState = {
          ...state,
          changeTracker: [...state.changeTracker, action.payload],
          resetSiteDetails: false,
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
      console.log("tracking change", state, action);
      const newState = {
        ...state,
        changeTracker: [],
        resetSiteDetails: true,
      };

      console.log("tracking change 2 ", newState);

      return newState;
    },
    updateSiteDetailsMode: (state, action) => {
      const newState = {
        ...state,
        siteDetailsMode: action.payload,
      };
      return newState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSites.pending, (state, action) => {
        const newState = { ...state };
        newState.fetchStatus = RequestStatus.loading;
        return newState;
      })
      .addCase(fetchSites.fulfilled, (state, action) => {
        const newState = { ...state };
        console.log("newState", newState, action);
        newState.fetchStatus = RequestStatus.success;
        newState.sites = action.payload.sites;
        newState.resultsCount = action.payload.count;
        return newState;
      })
      .addCase(fetchSites.rejected, (state, action) => {
        const newState = { ...state };
        return newState;
      })
      .addCase(fetchSitesDetails.pending, (state, action) => {
        const newState = { ...state };
        newState.siteDetailsFetchStatus = RequestStatus.loading;
        return newState;
      })
      .addCase(fetchSitesDetails.fulfilled, (state, action) => {
        const newState = { ...state };
        newState.siteDetails = action.payload;
        newState.siteDetailsFetchStatus = RequestStatus.success;
        return newState;
      })
      .addCase(fetchSitesDetails.rejected, (state, action) => {
        const newState = { ...state };
        newState.siteDetailsFetchStatus = RequestStatus.failed;
        return newState;
      });
  },
});

export const selectAllSites = (state: any) => state.sites.sites;
export const loadingState = (state: any) => state.sites.fetchStatus;
export const currentPageSelection = (state: any) => state.sites.currentPage;
export const resultsCount = (state: any) => state.sites.resultsCount;
export const siteDetailsLoadingState = (state: any) =>
  state.sites.fetchSitesDetails;
export const selectSiteDetails = (state: any) => state.sites.siteDetails;
export const trackedChanges = (state: any) => state.sites.changeTracker;
export const siteDetailsMode = (state: any) => state.sites.siteDetailsMode;
export const resetSiteDetails = (state: any) => state.sites.resetSiteDetails;

export const {
  siteAdded,
  resetSites,
  setFetchLoadingState,
  updatePageSizeSetting,
  updateSearchQuery,
  trackChanges,
  clearTrackChanges,
  updateSiteDetailsMode,
} = siteSlice.actions;

export default siteSlice.reducer;
