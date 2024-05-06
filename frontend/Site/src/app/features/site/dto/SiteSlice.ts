import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAxiosInstance } from "../../../helpers/utility";
import { print } from "graphql";
import { graphQlSiteQuery } from "../graphql/Site";
import { SiteState } from "./SiteState";
import { RequestStatus } from "../../../helpers/requests/status";
import { SiteResultDto } from "./Site";
import { GRAPHQL } from "../../../helpers/endpoints";
import { stat } from "fs";

const initialState: SiteState = {
  sites: [],
  error: '',
  fetchStatus: RequestStatus.idle,
  deleteStatus: RequestStatus.idle,
  addedStatus: RequestStatus.idle,
  updateStatus: RequestStatus.idle,
  searchQuery:'',
}


export const fetchSites = createAsyncThunk(
  "sites/fetchSites",
  async (args: {searchParam?: string, page?: string, pageSize?: string, filter?: {}}, {getState}) => {
    try {
      const { searchParam = "", page = "1", pageSize = "10", filter = {} } = args;
      const state:any = getState();
      const response = await getAxiosInstance().post(
        GRAPHQL,
        {
          query: print(graphQlSiteQuery(filter)),
          variables: {
            searchParam: searchParam,
            page: page,
            pageSize: pageSize,
            ...filter
          },
        }
      );
      return response.data.data.searchSites.sites;
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
    }
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
    siteAdded , resetSites , setFetchLoadingState, updateSearchQuery 
} = siteSlice.actions;

export default siteSlice.reducer;
