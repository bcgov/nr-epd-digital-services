import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../Store";
import PageContainer from "../../../components/simple/PageContainer";
import SearchInput from "../../../components/search/SearchInput";
import { RequestStatus } from "../../../helpers/requests/status";
import { RootState } from "../../../Store";
import {
  fetchSearchResults,
  setSearchTerm,
  setResults,
  setRequestStatus,
  setColumns,
  setFilter,
  setPage,
  setPageSize,
  Filter,
} from "./searchSlice";
import ApplicationResultsTable from "./applicationResults/applicationResultsTable";
import { TableColumn } from "../../../components/table/TableColumn";

const Search: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchTerm = useSelector(
    (state: RootState) => state.applicationSearch.searchTerm
  );
  const results = useSelector(
    (state: RootState) => state.applicationSearch.results
  );
  const requestStatus = useSelector(
    (state: RootState) => state.applicationSearch.requestStatus
  );
  const columns = useSelector(
    (state: RootState) => state.applicationSearch.columns
  );
  const page = useSelector((state: RootState) => state.applicationSearch.page);
  const pageSize = useSelector(
    (state: RootState) => state.applicationSearch.pageSize
  );
  const totalResults = useSelector(
    (state: RootState) => state.applicationSearch.totalResults
  );
  const filter = useSelector(
    (state: RootState) => state.applicationSearch.filter
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
  };

  const clearSearch = () => {
    dispatch(setSearchTerm(""));
    dispatch(setResults([]));
  };

  const handleColumnChange = (selectedColumns: TableColumn[]) => {
    dispatch(setColumns(selectedColumns));
  };

  const handleFilterChange = (filter: Filter) => {
    dispatch(setFilter(filter));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(setPageSize(newPageSize));
  };

  useEffect(() => {
    if (searchTerm) {
      dispatch(fetchSearchResults({ searchTerm, page, pageSize, filter }));
    } else {
      dispatch(setResults([]));
      dispatch(setRequestStatus(RequestStatus.idle));
    }
  }, [searchTerm, page, pageSize, dispatch, filter]);

  return (
    <PageContainer role="Search">
      <h1>All Applications</h1>
      <SearchInput
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        clearSearch={clearSearch}
        placeHolderText="Search"
      />
      <ApplicationResultsTable
        columns={columns}
        results={results}
        requestStatus={requestStatus}
        handleColumnChange={handleColumnChange}
        handleFilterChange={handleFilterChange}
        page={page}
        pageSize={pageSize}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
        showPageOptions={true}
        totalResults={totalResults}
        filter={filter}
      />
    </PageContainer>
  );
};

export default Search;
