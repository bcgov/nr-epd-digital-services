import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import {
  useSearchApplicationsQuery,
  useGetAllStatusTypesQuery,
} from './hooks/SearchApplications.generated';
import { useGetUserColumnPreferencesQuery } from '../../../graphql/columnPreferences.generated';
import ModalDialog from '../../../components/modaldialog/ModalDialog';
import Assignment from '../../assignment/Assignment';
import Widget from '@cats/components/widget/Widget';
import FilterControls from '@cats/components/filter/FilterControls';
import { IFilterOption } from '@cats/components/filter/IFilterControls';
import { FilterIcon, TableColumnsIcon } from '@cats/components/common/icon';
import { applicationResultColumns } from './SearchConfig';
import ColumnSelect from '../../../components/column-select';
import './Search.css';
import ApplicationFilterForm from './filter/ApplicationFilterForm';
import FilterPills from '../../people/filters/FilterPills';
import {
  formRowsMap,
  updateStaffOptions,
  updateStatusOptions,
} from './filter/ApplicationFilterConfig';
import { useGetAllActiveStaffMembersQuery } from '../../assignment/graphql/assignment.generated';

interface FilterPill {
  key: string;
  value: string;
  label: string;
}

interface SearchProps {
  filterMyTasks?: boolean;
}

const Search: React.FC<SearchProps> = ({ filterMyTasks = false }) => {
  const [urlParams, setUrlParams] = useSearchParams();

  // Read values from URL
  const searchTerm = urlParams.get('search') || '';
  const page = parseInt(urlParams.get('page') || '1');
  const pageSize = parseInt(urlParams.get('pageSize') || '10');
  const filter =
    (urlParams.get('filter') as Filter) ||
    (filterMyTasks ? Filter.MyAssigned : Filter.All);
  const sortBy =
    (urlParams.get('sortBy') as ApplicationSortByField) ||
    ApplicationSortByField.Id;
  const sortByDir =
    (urlParams.get('sortByDir') as ApplicationSortByDirection) ||
    ApplicationSortByDirection.Asc;

  // Applied filters from URL
  const appliedFilters = {
    id: urlParams.get('id') || '',
    serviceType: urlParams.get('serviceType') || '',
    commonName: urlParams.get('commonName') || '',
    csapReference: urlParams.get('csapReference') || '',
    siteId: urlParams.get('siteId') || '',
    siteRiskClassification: urlParams.get('siteRiskClassification') || '',
    siteAddress: urlParams.get('siteAddress') || '',
    applicationType: urlParams.get('applicationType') || '',
    status: urlParams.get('status') || '',
    staffAssigned: urlParams.get('staffAssigned') || '',
    priority: urlParams.get('priority') || '',
    dateReceived: [
      urlParams.get('dateReceivedFrom') || '',
      urlParams.get('dateReceivedTo') || '',
    ].filter(Boolean),
    lastUpdated: [
      urlParams.get('lastUpdatedFrom') || '',
      urlParams.get('lastUpdatedTo') || '',
    ].filter(Boolean),
    dateCompleted: [
      urlParams.get('dateCompletedFrom') || '',
      urlParams.get('dateCompletedTo') || '',
    ].filter(Boolean),
    invoiceStatus: urlParams.get('invoiceStatus') || '',
  };

  const [assignStaffModalOpen, setAssignStaffModalOpen] = useState(false);
  const [results, setResults] = useState<ApplicationResultDto[]>([]);
  const [columns, setColumns] = useState<TableColumn[]>(
    applicationResultColumns(filterMyTasks),
  );
  const [totalResults, setTotalResults] = useState<number>(0);
  const [showColumnSelect, setShowColumnSelect] = useState(false);
  const [showFilterSelect, setShowFilterSelect] = useState(false);
  const [originalColumns, setOriginalColumns] = useState<TableColumn[]>(
    applicationResultColumns(filterMyTasks),
  );

  const [filterFormData, setFilterFormData] = useState(appliedFilters);

  const filterPills: FilterPill[] = [];

  const filterLabels: { [key: string]: string } = {
    id: 'Application ID',
    serviceType: 'Service Type',
    commonName: 'Common Name',
    csapReference: 'CSAP Reference',
    siteId: 'Site ID',
    siteRiskClassification: 'Site Risk Classification',
    siteAddress: 'Site Address',
    applicationType: 'Application Type',
    status: 'Status',
    staffAssigned: 'Staff Assigned',
    priority: 'Priority',
    invoiceStatus: 'Invoice Status',
  };

  const getDisplayValue = (key: string, value: string): string => {
    const field = formRowsMap[key];
    if (field?.options) {
      const option = field.options.find((opt) => opt.key === value);
      return option?.value?.toString() || value;
    }
    return value;
  };

  Object.entries(appliedFilters).forEach(([key, value]) => {
    if (
      key === 'dateReceived' ||
      key === 'lastUpdated' ||
      key === 'dateCompleted'
    ) {
      if (Array.isArray(value) && value.length > 0 && (value[0] || value[1])) {
        const fromDate = value[0]
          ? new Date(value[0]).toLocaleDateString()
          : '';
        const toDate = value[1] ? new Date(value[1]).toLocaleDateString() : '';
        const dateRange =
          fromDate && toDate ? `${fromDate} - ${toDate}` : fromDate || toDate;

        const label =
          key === 'dateReceived'
            ? 'Date Received'
            : key === 'lastUpdated'
              ? 'Last Updated'
              : 'Date Completed';

        filterPills.push({ key, value: dateRange, label });
      }
    } else if (value && value !== '') {
      filterPills.push({
        key,
        value: getDisplayValue(key, value.toString()),
        label: filterLabels[key] || key,
      });
    }
  });

  const { data: savedPreferences, loading: loadingPreferences } =
    useGetUserColumnPreferencesQuery({
      variables: { page: 'applications' },
      skip: false,
    });

  const { data: staffData } = useGetAllActiveStaffMembersQuery();

  const { data: statusData } = useGetAllStatusTypesQuery();

  useEffect(() => {
    if (staffData?.getAllActiveStaffMembers?.data) {
      const staffOptions = staffData.getAllActiveStaffMembers.data.map(
        (staff) => ({
          key: staff.personId.toString(),
          value: staff.personFullName,
        }),
      );
      updateStaffOptions(staffOptions);
    }
  }, [staffData]);

  useEffect(() => {
    if (statusData?.getAllStatusTypes) {
      const statusOptions = statusData.getAllStatusTypes.map((status) => ({
        key: status.description,
        value: status.description,
      }));
      updateStatusOptions(statusOptions);
    }
  }, [statusData]);

  const {
    data,
    error,
    loading,
    refetch: searchRefresh,
  } = useSearchApplicationsQuery({
    variables: {
      searchParam: searchTerm,
      page: page,
      pageSize: pageSize,
      filter: filter,
      sortBy: sortBy,
      sortByDir: sortByDir,
      filterId: appliedFilters.id || undefined,
      filterServiceType: appliedFilters.serviceType || undefined,
      filterCommonName: appliedFilters.commonName || undefined,
      filterCsapReference: appliedFilters.csapReference || undefined,
      filterSiteId: appliedFilters.siteId || undefined,
      filterSiteRiskClassification:
        appliedFilters.siteRiskClassification || undefined,
      filterSiteAddress: appliedFilters.siteAddress || undefined,
      filterApplicationType: appliedFilters.applicationType || undefined,
      filterStatus: appliedFilters.status || undefined,
      filterStaffAssigned: appliedFilters.staffAssigned || undefined,
      filterPriority: appliedFilters.priority || undefined,
      filterDateReceivedFrom: appliedFilters.dateReceived?.[0] || undefined,
      filterDateReceivedTo: appliedFilters.dateReceived?.[1] || undefined,
      filterLastUpdatedFrom: appliedFilters.lastUpdated?.[0] || undefined,
      filterLastUpdatedTo: appliedFilters.lastUpdated?.[1] || undefined,
      filterDateCompletedFrom: appliedFilters.dateCompleted?.[0] || undefined,
      filterDateCompletedTo: appliedFilters.dateCompleted?.[1] || undefined,
      filterInvoiceStatus: appliedFilters.invoiceStatus || undefined,
    },
    fetchPolicy: 'network-only',
  });

  const requestStatus = loading
    ? RequestStatus.loading
    : error
      ? RequestStatus.failed
      : data
        ? RequestStatus.success
        : RequestStatus.idle;

  useEffect(() => {
    if (data) {
      setResults(data.searchApplications.applications);
      setTotalResults(data.searchApplications?.count || 0);
    }
  }, [data]);

  useEffect(() => {
    setFilterFormData(appliedFilters);
  }, [urlParams]);

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
          return {
            ...column,
            active: savedColumn.active,
            selectionOrder: savedColumn.selectionOrder || column.selectionOrder,
          };
        }
        return column;
      });

      setColumns(updatedColumns);
      setOriginalColumns(updatedColumns);
    }
  }, [savedPreferences, loadingPreferences, filterMyTasks]);

  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      const newParams = new URLSearchParams(urlParams);
      newParams.set('search', searchValue);
      newParams.set('page', '1'); // Reset to page 1 on new search
      setUrlParams(newParams);
    }, 300),
    [urlParams],
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };

  const handleFilterChange = (newFilter: Filter) => {
    const newParams = new URLSearchParams(urlParams);
    newParams.set('filter', newFilter);
    newParams.set('page', '1');
    setUrlParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(urlParams);
    newParams.set('page', newPage.toString());
    setUrlParams(newParams);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const newParams = new URLSearchParams(urlParams);
    newParams.set('pageSize', newPageSize.toString());
    newParams.set('page', '1');
    setUrlParams(newParams);
  };

  const handleFilterInputChange = (key: string, value: any) => {
    setFilterFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFilterSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newParams = new URLSearchParams(urlParams);

    Object.entries(filterFormData).forEach(([key, value]) => {
      if (
        key === 'dateReceived' ||
        key === 'lastUpdated' ||
        key === 'dateCompleted'
      ) {
        if (Array.isArray(value) && value.length > 0) {
          if (value[0]) newParams.set(`${key}From`, value[0].toString());
          if (value[1]) newParams.set(`${key}To`, value[1].toString());
        } else {
          newParams.delete(`${key}From`);
          newParams.delete(`${key}To`);
        }
      } else if (value && value !== '') {
        newParams.set(key, value.toString());
      } else {
        newParams.delete(key);
      }
    });

    newParams.set('page', '1');
    setUrlParams(newParams);
    setShowFilterSelect(false);
  };

  const handleFilterReset = () => {
    const emptyFilters = {
      id: '',
      serviceType: '',
      commonName: '',
      csapReference: '',
      siteId: '',
      siteRiskClassification: '',
      siteAddress: '',
      applicationType: '',
      status: '',
      staffAssigned: '',
      priority: '',
      dateReceived: [],
      lastUpdated: [],
      dateCompleted: [],
      invoiceStatus: '',
    };
    setFilterFormData(emptyFilters);

    const newParams = new URLSearchParams();
    newParams.set('search', searchTerm);
    newParams.set('page', '1');
    newParams.set('pageSize', pageSize.toString());
    newParams.set('filter', filter);
    newParams.set('sortBy', sortBy);
    newParams.set('sortByDir', sortByDir);
    setUrlParams(newParams);
  };

  const handleCancelFilter = () => {
    setShowFilterSelect(false);
  };

  const handleRemoveFilter = (filter: FilterPill) => {
    const newParams = new URLSearchParams(urlParams);

    if (
      filter.key === 'dateReceived' ||
      filter.key === 'lastUpdated' ||
      filter.key === 'dateCompleted'
    ) {
      newParams.delete(`${filter.key}From`);
      newParams.delete(`${filter.key}To`);
    } else {
      newParams.delete(filter.key);
    }

    setUrlParams(newParams);

    setFilterFormData((prev) => ({
      ...prev,
      [filter.key]: filter.key.includes('date') ? [] : '',
    }));
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

    const newParams = new URLSearchParams(urlParams);
    newParams.set('sortBy', newSortBy);
    newParams.set('sortByDir', newSortByDir);
    setUrlParams(newParams);
  };

  const sharedOptions: IFilterOption[] = [
    {
      label: 'Columns',
      value: Filter.All,
      onClick: () => {
        setShowColumnSelect(!showColumnSelect);
        setShowFilterSelect(false);
      },
      isSelected: showColumnSelect,
      icon: <TableColumnsIcon />,
    },

    {
      label: 'Filter',
      value: 'filter',
      isSelected: showFilterSelect,
      onClick: () => {
        setShowFilterSelect(!showFilterSelect);
        setShowColumnSelect(false);
      },
      icon: <FilterIcon />,
    },
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
    const allActiveColumns = columns.map((column, index) => ({
      ...column,
      active: true,
      selectionOrder: index + 1,
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
      {/* Widget for applications and tasks */}
      <Widget
        customWidgetCss="gap-4"
        widgetLabelContainerCss={`${showColumnSelect ? '' : ''}`}
        title="Applications"
        aria-label="Applications Widget"
        tableIsLoading={requestStatus}
        tableColumns={columns
          .filter((column) => column.active)
          .sort((a, b) => (a.selectionOrder || 0) - (b.selectionOrder || 0))}
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
        {showFilterSelect && (
          <div className="custom-app-childern-container">
            <ApplicationFilterForm
              formData={filterFormData}
              onInputChange={handleFilterInputChange}
              onSubmit={handleFilterSubmit}
              onReset={handleFilterReset}
              cancelSearchFilter={handleCancelFilter}
            />
          </div>
        )}

        {filterPills.length > 0 && (
          <FilterPills
            filters={filterPills}
            onRemoveFilter={handleRemoveFilter}
          />
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
              searchRefresh();
            }}
            modalSaveHandler={() => {
              setAssignStaffModalOpen(false);
              searchRefresh();
            }}
          />
        </ModalDialog>
      )}
    </PageContainer>
  );
};

export default Search;
