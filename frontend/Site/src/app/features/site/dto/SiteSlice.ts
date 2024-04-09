import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAxiosInstance } from "../../../helpers/utility";
import { print } from "graphql";
import { FETCH_SITES } from "../graphql/Site";
import { SiteState } from "./SiteState";
import { RequestStatus } from "../../../helpers/requests/status";
import { Site } from "./Site";
import { GRAPHQL } from "../../../helpers/endpoints";

const initialState: SiteState = {
  sites: [],
  error: '',
  fetchStatus: RequestStatus.idle,
  deleteStatus: RequestStatus.idle,
  addedStatus: RequestStatus.idle,
  updateStatus: RequestStatus.idle
};

export const fetchSites = createAsyncThunk(
  "sites/fetchSites",
  async (searchParam: String) => {
    try {
      const response = await getAxiosInstance().post(
        GRAPHQL,
        {
          query: print(FETCH_SITES),
          variables: {
            searchParam: searchParam,
          },
        }
      );
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
    setFetchLoadingState:(state,action)=>{
      const newState = {
        ...state,
      };
      newState.fetchStatus = RequestStatus.loading;
      return newState;
    },
    resetSites: (state,action) =>{
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
        const updatedArr: Site[] = [state.sites, action.payload];
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
        //console.log('newState',newState,action)
        newState.fetchStatus = RequestStatus.success;
        newState.sites = action.payload;
        return newState;
      })
      .addCase(fetchSites.rejected, (state, action) => {
        const newState = { ...state };
        return newState;
      })     
  },
});

export const selectAllSites = (state: any) => state.sites.sites;
export const loadingState = (state: any) => state.sites.fetchStatus;


export const {
    siteAdded , resetSites , setFetchLoadingState
} = siteSlice.actions;

export default siteSlice.reducer;
