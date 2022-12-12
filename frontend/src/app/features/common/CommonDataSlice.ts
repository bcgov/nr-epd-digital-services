import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { print } from "graphql";
import { GRAPHQL } from "../../helpers/endpoints";
import { RequestStatus } from "../../helpers/requests/status";
import { getAxiosInstance } from "../../helpers/utility";
import { CommonData } from "./dto/CommonData";
import { LookupValues } from "./dto/LookUpValues";
import { FETCH_LOOKUPDATA } from "./graphql/LookUpDataRequests";

const initialState = {
  error: "",
  fetchStatus: RequestStatus.idle,
  lookUpValues: {
    organizationTypes: [],
    regions: [],
  },
};

export const fetchLookupData = createAsyncThunk("fetchLookupData", async () => {
  const request = await getAxiosInstance().post(GRAPHQL, {
    query: print(FETCH_LOOKUPDATA),
  });
  return request.data;
});

const commonDataSlice = createSlice({
  name: "common",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLookupData.fulfilled, (state, action) => {
        state.fetchStatus = RequestStatus.success;
        state.lookUpValues.organizationTypes =
          action.payload.data?.organizationTypes?.data;
        state.lookUpValues.regions = action.payload.data?.regions?.data;
      })
      .addCase(fetchLookupData.pending, (state, action) => {
        const newState = { ...state };
        newState.fetchStatus = RequestStatus.loading;
        return newState;
      })
      .addCase(fetchLookupData.rejected, (state, action) => {
        const newState = { ...state };
        newState.fetchStatus = RequestStatus.failed;
        return newState;
      });
  },
});

export const getRegions = (state: any) => {
  return state.commonData.lookUpValues.regions;
};

export const getOrganizations = (state: any) => {
  return state.commonData.lookUpValues.organizationTypes;
};

// export const getOrganizations = (state: CommonData) =>
//   state.lookUpValues.organizationTypes;
export const getProfileFetchStatus = (state: any) => state.fetchStatus;

export default commonDataSlice.reducer;
