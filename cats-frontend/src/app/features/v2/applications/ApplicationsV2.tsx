import React, { useState } from 'react';
import PageContainer from '../../../components/simple/PageContainer';
import { DataTable, DataTablePagination } from '../../../components/data-table';
import { useApplicationsV2 } from './hooks/useApplicationsV2';
import { useApplicationsV2ColumnPreferences } from './hooks/useApplicationsV2ColumnPreferences';
import { useApplicationsV2FilterLookups } from './hooks/useApplicationsV2FilterLookups';
import { useApplicationsV2SearchParams } from './hooks/useApplicationsV2SearchParams';
import {
  ApplicationsV2Toolbar,
  type ApplicationsV2Panel,
} from './ApplicationsV2Toolbar';
import { ApplicationsV2Panels } from './ApplicationsV2Panels';
import { applicationsV2Columns } from './applicationsV2Columns';
import './ApplicationsV2.css';

const ApplicationsV2: React.FC = () => {
  const {
    options: lookupOptions,
    isLoading: lookupsLoading,
    isError: lookupsError,
  } = useApplicationsV2FilterLookups();
  const {
    page,
    pageSize,
    search,
    advancedFilters,
    filterPills,
    setPage,
    setPageSize,
    setSearch,
    applyAdvancedFilters,
    resetAdvancedFilters,
    removeFilterPill,
    sorting,
    setSorting,
    variables,
  } = useApplicationsV2SearchParams(lookupOptions);
  const { data, isPending, isFetching, isError } = useApplicationsV2(variables);
  const {
    columnVisibility,
    setColumnVisibility,
    resetColumnVisibility,
    saveColumnDefaults,
    isSavingColumnDefaults,
    isLoadingPreferences,
  } = useApplicationsV2ColumnPreferences();
  const [openPanel, setOpenPanel] = useState<ApplicationsV2Panel>('none');

  const applications = data?.applications ?? [];
  const totalCount = data?.count ?? 0;
  // Full loading row only on the first fetch; subsequent page changes keep
  // previous rows and use a subtler in-place fetching affordance.
  const showInitialLoading = isLoadingPreferences || (isPending && !data);

  const togglePanel = (panel: Exclude<ApplicationsV2Panel, 'none'>) => {
    setOpenPanel((current) => (current === panel ? 'none' : panel));
  };

  return (
    <PageContainer role="ApplicationsV2">
      <div className="applications-v2__table">
        <DataTable
          title="Applications"
          data={applications}
          columns={applicationsV2Columns}
          ariaLabel="Applications"
          isLoading={showInitialLoading}
          isFetching={!showInitialLoading && isFetching}
          sorting={sorting}
          onSortingChange={setSorting}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          getRowId={(row) => row.id}
          manualSorting
          toolbarActions={
            <ApplicationsV2Toolbar
              search={search}
              onSearchChange={setSearch}
              showColumnPanel={openPanel === 'columns'}
              showFilterPanel={openPanel === 'filters'}
              onTogglePanel={togglePanel}
            />
          }
          belowHeader={
            <ApplicationsV2Panels
              openPanel={openPanel}
              onClosePanel={() => setOpenPanel('none')}
              appliedFilters={advancedFilters}
              lookupOptions={lookupOptions}
              lookupsLoading={lookupsLoading}
              lookupsError={lookupsError}
              onApplyFilters={applyAdvancedFilters}
              onResetFilters={resetAdvancedFilters}
              columnVisibility={columnVisibility}
              onColumnVisibilityChange={setColumnVisibility}
              onResetColumns={resetColumnVisibility}
              onSaveColumnDefaults={saveColumnDefaults}
              isSavingColumnDefaults={isSavingColumnDefaults}
              filterPills={filterPills}
              onRemoveFilterPill={removeFilterPill}
            />
          }
        />
        {!isError && (
          <DataTablePagination
            page={data?.page ?? page}
            pageSize={data?.pageSize ?? pageSize}
            totalCount={totalCount}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default ApplicationsV2;
