import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';
import PageContainer from '../../../components/simple/PageContainer';
import SearchInput from '../../../components/search/SearchInput';
import { RequestStatus } from '../../../helpers/requests/status';
import { TableColumn } from '../../../components/table/TableColumn';
import {
  Filter,
  ApplicationResultDto,
  ApplicationSortByDirection,
  ApplicationSortByField,
} from '../../../../generated/types';
import { useSearchApplicationsQuery } from './hooks/SearchApplications.generated';
import { useGetUserColumnPreferencesQuery } from '../../../graphql/columnPreferences.generated';
import ModalDialog from '../../../components/modaldialog/ModalDialog';
import Assignment from '../../assignment/Assignment';
import Widget from '@cats/components/widget/Widget';
import FilterControls from '@cats/components/filter/FilterControls';
import { IFilterOption } from '@cats/components/filter/IFilterControls';
import { TableColumnsIcon } from '@cats/components/common/icon';
import { applicationResultColumns } from './SearchConfig';
import ColumnSelect from '../../../components/column-select';
import './Search.css';

interface SearchProps {
  filterMyTasks?: boolean;
}

const Search: React.FC<SearchProps> = ({ filterMyTasks = false }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [assignStaffModalOpen, setAssignStaffModalOpen] = useState(false);
  const [results, setResults] = useState<ApplicationResultDto[]>([]);
  const [requestStatus, setRequestStatus] = useState(RequestStatus.idle);
  const [columns, setColumns] = useState<TableColumn[]>(
    applicationResultColumns(filterMyTasks),
  );
  const [filter, setFilter] = useState<Filter>(
    filterMyTasks === true ? Filter.MyAssigned : Filter.All,
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
  const [showColumnSelect, setShowColumnSelect] = useState(false);
  const [originalColumns, setOriginalColumns] = useState<TableColumn[]>(
    applicationResultColumns(filterMyTasks),
  );
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    page: 1,
    pageSize: 5,
    filter: filterMyTasks === true ? Filter.MyAssigned : Filter.All,
    sortBy: ApplicationSortByField.Id,
    sortByDir: ApplicationSortByDirection.Asc,
  });

  const { data: savedPreferences, loading: loadingPreferences } =
    useGetUserColumnPreferencesQuery({
      variables: { page: 'applications' },
      skip: false,
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
    fetchPolicy: 'network-only',
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

  useEffect(() => {
    if (
      savedPreferences?.getUserColumnPreferences?.data?.columns &&
      !loadingPreferences
    ) {
      const savedColumns =
        savedPreferences.getUserColumnPreferences.data.columns;
      const defaultColumns = applicationResultColumns(filterMyTasks);

      const updatedColumns = defaultColumns.map((column) => {
        const savedColumn = savedColumns.find(
          (saved: any) => saved.id === column.id,
        );
        if (savedColumn) {
          return { ...column, active: savedColumn.active };
        }
        return column;
      });

      setColumns(updatedColumns);
      setOriginalColumns(updatedColumns);
    }
  }, [savedPreferences, loadingPreferences, filterMyTasks]);

  const debouncedSearch = useCallback(
    debounce(
      (
        searchTerm: string,
        page: number,
        pageSize: number,
        filter: Filter,
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

  const handleFilterChange = (filter: Filter) => {
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

  const sharedOptions: IFilterOption[] = [
    {
      label: 'Columns',
      value: Filter.All,
      onClick: () => setShowColumnSelect(!showColumnSelect),
      isSelected: showColumnSelect,
      icon: <TableColumnsIcon />,
    },
    // You can add more shared items here (e.g., Filter icon toggle)
    // {
    //   label: 'Filter',
    //   value: 'filter',
    //   onClick: () => setShowFilterSelect(prev => !prev),
    //   icon: <FilterIcon />,
    // },
  ];

  const tasksOptions: IFilterOption[] = [
    {
      label: 'Action Required',
      value: Filter.All,
      onClick: () => handleFilterChange(Filter.All),
      isSelected: filter === Filter.All,
    },
    {
      label: 'Assigned to Me',
      value: Filter.Assigned,
      onClick: () => handleFilterChange(Filter.MyAssigned),
      isSelected: filter === Filter.Assigned,
    },
  ];

  const generalOptions: IFilterOption[] = [];

  const options: IFilterOption[] = [...sharedOptions];

  const handleResetColumns = () => {
    const allActiveColumns = columns.map((column) => ({
      ...column,
      active: true,
    }));
    setColumns(allActiveColumns);
  };

  const handleSaveDefault = () => {
    setOriginalColumns(columns);
  };

  const handleSubmitColumns = () => {
    setShowColumnSelect(false);
  };

  const handleCancelColumns = () => {
    setColumns(originalColumns);
    setShowColumnSelect(false);
  };

  return (
    <PageContainer role="Search">
      <div className="custom-app-container">
        {' '}
        {filterMyTasks ? 'My Tasks' : ' All Applications'}
      </div>
      <SearchInput
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        clearSearch={() => setSearchTerm('')}
        placeHolderText="Search"
      />
      {/* Widget for applications and tasks */}
      <Widget
        customWidgetCss="gap-4"
        widgetLabelContainerCss={`${showColumnSelect ? '' : ''}`}
        title="Applications"
        aria-label="Applications Widget"
        tableIsLoading={requestStatus}
        tableColumns={columns.filter((column) => column.active)}
        tableData={results}
        sortHandler={handleSortChange}
        changeHandler={handleChangeEventHandler}
        currentPage={page}
        allowRowsSelect={false}
        primaryKeycolumnName="id"
        showPageOptions={true}
        selectPage={handlePageChange}
        changeResultsPerPage={handlePageSizeChange}
        resultsPerPage={pageSize}
        totalResults={totalResults}
        filter={<FilterControls options={options} />}
      >
        {showColumnSelect && (
          <div className="custom-app-childern-container">
            <ColumnSelect
              columns={columns}
              handleColumnChange={setColumns}
              onSubmit={handleSubmitColumns}
              onCancel={handleCancelColumns}
              onResetColumns={handleResetColumns}
              onSaveDefault={handleSaveDefault}
              page="applications"
            />
          </div>
        )}
      </Widget>

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
