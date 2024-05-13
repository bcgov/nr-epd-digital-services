import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAxiosInstance } from '../../helpers/utility';
import { GRAPHQL } from '../../helpers/endpoints';
import { print } from "graphql";
import { IDashboardState } from '../site/dto/DashboardState';
import { RequestStatus } from '../../helpers/requests/status';
import { graphQLDashboard } from '../site/graphql/Dashboard';

// Define the initial state
const initialState : IDashboardState = {
    dashboard: {
        recentView: [],
        recentFolios: [],
        recentAssigned: [],
    },
    status: RequestStatus.idle,
    error: '',
  };
  
// Define the asynchronous thunk to fetch recent views from the backend
export const fetchRecentViews = createAsyncThunk(
    'recentViews/fetchRecentViews',
    async (userId: string) => {
      try
      {
        const response = await getAxiosInstance().post( GRAPHQL, {
            query: print(graphQLDashboard()),
            variables: {
                userId:userId
            }
        })
        return response.data.data.getRecentViewsByUserId;
      }
      catch(error)
      {
        throw error
      }
      
    }
  );

// Define the recent views slice
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(fetchRecentViews.pending, (state) => {
            state.status = RequestStatus.loading;
          })
          .addCase(fetchRecentViews.fulfilled, (state, action) => {
            state.status = RequestStatus.success;
            // Assuming action.payload contains the recent views data
            state.dashboard.recentView = action.payload;
          })
          .addCase(fetchRecentViews.rejected, (state, action) => {
            state.status = RequestStatus.failed;
            state.error = action.error.message;
          });
      },
  });

  export default dashboardSlice.reducer;