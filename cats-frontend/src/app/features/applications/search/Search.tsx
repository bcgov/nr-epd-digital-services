import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';
import PageContainer from '../../../components/simple/PageContainer';
import SearchInput from '../../../components/search/SearchInput';
import { RequestStatus } from '../../../helpers/requests/status';
import ApplicationResultsTable from './applicationResults/table';
import { TableColumn } from '../../../components/table/TableColumn';
import { applicationResultColumns } from './applicationResults/tableColumnConfig';
import {
  ApplicationFilter,
  ApplicationResultDto,
  ApplicationSortByDirection,
  ApplicationSortByField,
} from '../../../../generated/types';
import { useSearchApplicationsQuery } from './hooks/SearchApplications.generated';
import ModalDialog from '../../../components/modaldialog/ModalDialog';
import Assignment from '../../assignment/Assignment';

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [assignStaffModalOpen, setAssignStaffModalOpen] = useState(false);
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
  const [sortBy, setSortBy] = useState<ApplicationSortByField>(
    ApplicationSortByField.Id,
  );
  const [sortByDir, setSortByDir] = useState<ApplicationSortByDirection>(
    ApplicationSortByDirection.Asc,
  );

  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    page: 1,
    pageSize: 5,
    filter: ApplicationFilter.All,
    sortBy: ApplicationSortByField.Id,
    sortByDir: ApplicationSortByDirection.Asc,
  });

  const {
    data,
    error,
    refetch: searchRefresh,
  } = useSearchApplicationsQuery({
    variables: {
      searchParam: searchParams.searchTerm,
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      filter: searchParams.filter,
      sortBy: searchParams.sortBy,
      sortByDir: searchParams.sortByDir,
    },
  });

  useEffect(() => {
    if (data) {
      setResults(data.searchApplications.applications);
      setTotalResults(data.searchApplications?.count || 0);
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
        sortBy: ApplicationSortByField,
        sortByDir: ApplicationSortByDirection,
      ) => {
        setSearchParams({
          searchTerm,
          page,
          pageSize,
          filter,
          sortBy,
          sortByDir,
        });
        setRequestStatus(RequestStatus.loading);
      },
      300,
    ),
    [],
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    // Reset page to 1 when searching, addresses an edge case where the user is
    // on page 2 and searches for something that returns one page of results
    // causing the table to show no results.
    setPage(1);
    debouncedSearch(searchTerm, 1, pageSize, filter, sortBy, sortByDir);
  };

  const handleFilterChange = (filter: ApplicationFilter) => {
    setFilter(filter);
    debouncedSearch(searchTerm, page, pageSize, filter, sortBy, sortByDir);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    debouncedSearch(searchTerm, page, pageSize, filter, sortBy, sortByDir);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
    debouncedSearch(searchTerm, page, pageSize, filter, sortBy, sortByDir);
  };

  const [assignmentAppId, setAssignmentAppId] = useState<string>('');

  const handleChangeEventHandler = (eventRecord: any) => {
    if (eventRecord.property === 'assignStaff') {
      setAssignmentAppId(eventRecord.row.id);
      setAssignStaffModalOpen(true);
    }
  };

  const handleSortChange = (column: TableColumn, ascending: boolean) => {
    let newSortBy = ApplicationSortByField.Id;
    let newSortByDir = ascending
      ? ApplicationSortByDirection.Asc
      : ApplicationSortByDirection.Desc;
    switch (column.graphQLPropertyName) {
      case 'id':
        newSortBy = ApplicationSortByField.Id;
        break;
      case 'siteId':
        newSortBy = ApplicationSortByField.SiteId;
        break;
      case 'siteAddress':
        newSortBy = ApplicationSortByField.SiteAddress;
        break;
      case 'applicationType':
        newSortBy = ApplicationSortByField.ApplicationType;
        break;
      case 'lastUpdated':
        newSortBy = ApplicationSortByField.LastUpdated;
        break;
      case 'status':
        newSortBy = ApplicationSortByField.Status;
        break;
      case 'priority':
        newSortBy = ApplicationSortByField.Priority;
        break;
    }

    setSortBy(newSortBy);
    setSortByDir(newSortByDir);
    debouncedSearch(searchTerm, page, pageSize, filter, sortBy, sortByDir);
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
        changeHandler={handleChangeEventHandler}
        handleColumnChange={setColumns}
        handleFilterChange={handleFilterChange}
        page={page}
        pageSize={pageSize}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
        showPageOptions={true}
        totalResults={totalResults}
        filter={filter}
        sortHandler={handleSortChange}
      />
      {assignStaffModalOpen && (
        <ModalDialog
          headerLabel="Assign Application to Staff"
          closeHandler={() => {
            setAssignStaffModalOpen(false);
          }}
          noFooterOptions={true}
        >
          <Assignment
            id={assignmentAppId}
            modalCloseHandler={() => {
              setAssignStaffModalOpen(false);

              searchRefresh({
                searchParam: searchParams.searchTerm,
                page: searchParams.page,
                pageSize: searchParams.pageSize,
                filter: searchParams.filter,
                sortBy: searchParams.sortBy,
                sortByDir: searchParams.sortByDir,
              });
            }}
            modalSaveHandler={() => {
              setAssignStaffModalOpen(false);

              searchRefresh({
                searchParam: searchParams.searchTerm,
                page: searchParams.page,
                pageSize: searchParams.pageSize,
                filter: searchParams.filter,
                sortBy: searchParams.sortBy,
                sortByDir: searchParams.sortByDir,
              });
            }}
          />
        </ModalDialog>
      )}
    </PageContainer>
  );
};

export default Search;
