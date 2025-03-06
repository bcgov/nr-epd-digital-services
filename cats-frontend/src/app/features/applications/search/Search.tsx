import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';
import PageContainer from '../../../components/simple/PageContainer';
import SearchInput from '../../../components/search/SearchInput';
import { RequestStatus } from '../../../helpers/requests/status';
import ApplicationResultsTable from './applicationResults/applicationResultsTable';
import { TableColumn } from '../../../components/table/TableColumn';
import { applicationResultColumns } from './applicationResults/tableColumnConfig';
import {
  ApplicationFilter,
  ApplicationResultDto,
} from '../../../../generated/types';
import { useSearchApplicationsQuery } from './hooks/SearchApplications.generated';

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<ApplicationResultDto[]>([]);
  const [requestStatus, setRequestStatus] = useState(RequestStatus.idle);
  const [columns, setColumns] = useState<TableColumn[]>(
    applicationResultColumns,
  );
  const [filter, setFilter] = useState<ApplicationFilter>(
    ApplicationFilter.All,
  );
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalResults, setTotalResults] = useState<number>(0);

  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    page: 1,
    pageSize: 5,
    filter: ApplicationFilter.All,
  });

  const { data, error } = useSearchApplicationsQuery({
    variables: {
      searchParam: searchParams.searchTerm,
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      filter: searchParams.filter,
    },
  });

  useEffect(() => {
    if (data) {
      setResults(data.searchApplications.applications);
      setTotalResults(data.searchApplications.count);
      setRequestStatus(RequestStatus.success);
    } else if (error) {
      setRequestStatus(RequestStatus.failed);
    }
  }, [data, error]);

  const debouncedSearch = useCallback(
    debounce(
      (
        searchTerm: string,
        page: number,
        pageSize: number,
        filter: ApplicationFilter,
      ) => {
        setSearchParams({ searchTerm, page, pageSize, filter });
        setRequestStatus(RequestStatus.loading);
      },
      300,
    ),
    [],
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    debouncedSearch(searchTerm, page, pageSize, filter);
  };

  return (
    <PageContainer role="Search">
      <h1>All Applications</h1>
      <SearchInput
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        clearSearch={() => setSearchTerm('')}
        placeHolderText="Search"
      />
      <ApplicationResultsTable
        columns={columns}
        results={results}
        requestStatus={requestStatus}
        handleColumnChange={setColumns}
        handleFilterChange={setFilter}
        page={page}
        pageSize={pageSize}
        handlePageChange={setPage}
        handlePageSizeChange={setPageSize}
        showPageOptions={true}
        totalResults={totalResults}
        filter={filter}
      />
    </PageContainer>
  );
};

export default Search;
