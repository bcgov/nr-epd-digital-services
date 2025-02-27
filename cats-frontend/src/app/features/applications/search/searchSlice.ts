import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RequestStatus } from "../../../helpers/requests/status";
import { ApplicationResultDto } from "./applicationResults/applicationResultDto";
import { searchApplications } from "./searchApplications";
import { TableColumn } from "../../../components/table/TableColumn";
import { applicationResultColumns } from "./applicationResults/tableColumnConfig";

export enum Filter {
  All = "ALL",
  Assigned = "ASSIGNED",
  Completed = "COMPLETED",
}

interface SearchState {
  searchTerm: string;
  results: ApplicationResultDto[];
  requestStatus: RequestStatus;
  columns: TableColumn[];
  filter: Filter;
  page: number;
  pageSize: number;
  totalResults: number;
}

const initialState: SearchState = {
  searchTerm: "",
  results: [],
  requestStatus: RequestStatus.idle,
  columns: applicationResultColumns,
  filter: Filter.All,
  page: 1,
  pageSize: 5,
  totalResults: 0,
};

export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async ({
    searchTerm,
    page,
    pageSize,
    filter,
  }: {
    searchTerm: string;
    page: number;
    pageSize: number;
    filter: Filter;
  }) => {
    const { applications, count } = await searchApplications(
      searchTerm,
      page,
      pageSize,
      filter
    );
    return { applications, count };
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setResults(state, action: PayloadAction<ApplicationResultDto[]>) {
      state.results = action.payload;
    },
    setRequestStatus(state, action: PayloadAction<RequestStatus>) {
      state.requestStatus = action.payload;
    },
    setColumns(state, action: PayloadAction<TableColumn[]>) {
      state.columns = action.payload;
    },
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.requestStatus = RequestStatus.loading;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.results = action.payload.applications;
        state.totalResults = action.payload.count;
        state.requestStatus = RequestStatus.success;
      })
      .addCase(fetchSearchResults.rejected, (state) => {
        state.requestStatus = RequestStatus.failed;
      });
  },
});

export const {
  setSearchTerm,
  setResults,
  setRequestStatus,
  setColumns,
  setFilter,
  setPage,
  setPageSize,
} = searchSlice.actions;
export default searchSlice.reducer;
