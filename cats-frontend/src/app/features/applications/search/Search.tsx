import React, { useEffect, useState, useCallback } from 'react';
import PageContainer from '../../../components/simple/PageContainer';
import SearchInput from '../../../components/search/SearchInput';
import { RequestStatus } from '../../../helpers/requests/status';
import { searchApplications } from './searchApplications';
import ApplicationResultsTable from './applicationResults/applicationResultsTable';
import { TableColumn } from '../../../components/table/TableColumn';
import { applicationResultColumns } from './applicationResults/tableColumnConfig';
import { ApplicationResultDto } from './applicationResults/applicationResultDto';
import { debounce } from 'lodash';

export enum Filter {
  All = 'ALL',
  Assigned = 'ASSIGNED',
  Completed = 'COMPLETED',
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<ApplicationResultDto[]>([]);
  const [requestStatus, setRequestStatus] = useState(RequestStatus.idle);
  const [columns, setColumns] = useState<TableColumn[]>(
    applicationResultColumns,
  );
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalResults, setTotalResults] = useState<number>(0);

  const handleSearchChange = useCallback(
    debounce((event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    }, 300),
    [],
  );

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
  };

  const handleColumnChange = (selectedColumns: TableColumn[]) => {
    setColumns(selectedColumns);
  };

  const handleFilterChange = (filter: Filter) => {
    setFilter(filter);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      setRequestStatus(RequestStatus.loading);
      try {
        const { applications, count } = await searchApplications(
          searchTerm,
          page,
          pageSize,
          filter,
        );
        setResults(applications);
        setTotalResults(count);
        setRequestStatus(RequestStatus.success);
      } catch (error) {
        setRequestStatus(RequestStatus.failed);
      }
    };

    if (searchTerm) {
      fetchSearchResults();
    } else {
      setResults([]);
      setRequestStatus(RequestStatus.idle);
    }
  }, [searchTerm, page, pageSize, filter]);

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
