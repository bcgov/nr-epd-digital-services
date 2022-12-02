import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { print } from "graphql";
import { GRAPHQL } from "../../helpers/endpoints";
import { RequestStatus } from "../../helpers/requests/status";
import { getAxiosInstance } from "../../helpers/utility";
import { ProfileState } from "./dto/ProfileState";
import { FETCH_ORGANIZATIONS, FETCH_REGIONS } from "./graphql/ProfileRequests";

const initialState: ProfileState = new ProfileState()


export const fetchOrganizations = createAsyncThunk("fetchOrganizations", async () =>{
    const request = await getAxiosInstance().post(GRAPHQL, {
        query: print(FETCH_ORGANIZATIONS)
    })
    console.log(request)
    return request.data
})

export const fetchRegions = createAsyncThunk("fetchRegions", async () =>{
    const request = await getAxiosInstance().post(GRAPHQL, {
        query: print(FETCH_REGIONS)
    })
    console.log(request.data.data)
    return request.data
})

const profileSlice = createSlice({
    name:"profile",
    initialState,
    reducers: {},
    extraReducers: (builder) =>{
        builder
            .addCase(fetchOrganizations.fulfilled, (state,action) =>{
                const newState = {...state}
                console.log("FetchOrganizations Fulfilled", state, action)
                newState.fetchStatus = RequestStatus.success
                newState.profile.organizations = action.payload.data.organizationTypes.data
                return newState
            })
            .addCase(fetchOrganizations.pending, (state,action) =>{
                const newState = {...state}
                console.log("FetchOrganizations Pending",state,action)
                newState.fetchStatus = RequestStatus.loading
                return newState
            })
            .addCase(fetchOrganizations.rejected, (state,action) =>{
                const newState = {...state}
                console.log("FetchOrganizations Pending",state,action)
                newState.fetchStatus = RequestStatus.failed
                return newState
            })
            .addCase(fetchRegions.fulfilled, (state,action) =>{
                console.log("FetchRegions Fulfilled", state, action)
                const newState = {...state}
                newState.fetchStatus = RequestStatus.success
                console.log(action.payload.data+ "action.payload.data")
                newState.profile.regions = action.payload
                return newState
            })
            .addCase(fetchRegions.pending, (state,action) =>{
                const newState = {...state}
                console.log("FetchRegions Pending",state,action)
                newState.fetchStatus = RequestStatus.loading
                return newState
            })
            .addCase(fetchRegions.rejected, (state,action) =>{
                const newState = {...state}
                console.log("FetchRegions Pending",state,action)
                newState.fetchStatus = RequestStatus.failed
                return newState
            })
    }
})

export const getRegions = (state:any) => state.regions
export const getOrganizations = (state:any) => state.organizations
export const getProfileFetchStatus = (state:any) => state.fetchStatus

export default profileSlice.reducer