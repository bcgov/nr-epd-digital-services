import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAxiosInstance } from '../../helpers/utility';
import { GRAPHQL } from '../../helpers/endpoints';
import { IDashboardState } from './IDashboardState';
import { RequestStatus } from '../../helpers/requests/status';

// Define the initial state
const initialState: IDashboardState = {
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
  async (userId: string) => {},
);

export const addRecentView = createAsyncThunk(
  'recentViews/addRecentViews',
  async (payload: {
    userId: string;
    siteId: string;
    address: string;
    city: string;
    generalDescription: string;
    whenUpdated: Date;
  }) => {},
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
      })
      .addCase(fetchRecentViews.rejected, (state, action) => {
        state.status = RequestStatus.failed;
        state.error = action.error.message;
      })
      .addCase(addRecentView.pending, (state) => {
        state.status = RequestStatus.loading;
      })
      .addCase(addRecentView.fulfilled, (state, action) => {
        state.status = RequestStatus.success;
      })
      .addCase(addRecentView.rejected, (state, action) => {
        state.status = RequestStatus.failed;
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;
