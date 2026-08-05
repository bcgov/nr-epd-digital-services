import React, { useState } from 'react';
import type { VisibilityState } from '@tanstack/react-table';
import PageContainer from '../../../components/simple/PageContainer';
import { DataTable, DataTablePagination } from '../../../components/data-table';
import { Button } from '../../../components/button/Button';
import FilterPills from '../../../components/filter/FilterPills';
import { FilterIcon } from '../../../components/common/icon';
import { useApplicationsV2 } from './hooks/useApplicationsV2';
import { useApplicationsV2SearchParams } from './hooks/useApplicationsV2SearchParams';
import { ApplicationsV2SearchInput } from './ApplicationsV2SearchInput';
import { ApplicationsV2FilterPanel } from './filters/ApplicationsV2FilterPanel';
import { applicationsV2Columns } from './applicationsV2Columns';
import { APPLICATIONS_SEARCH_ERROR_MESSAGE } from './api/ApplicationsApi';
import './ApplicationsV2.css';

const ApplicationsV2: React.FC = () => {
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
  } = useApplicationsV2SearchParams();
  const { data, isPending, isFetching, isError } = useApplicationsV2(variables);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const applications = data?.applications ?? [];
  const totalCount = data?.count ?? 0;
  // Full loading row only on the first fetch; subsequent page changes keep
  // previous rows and use a subtler in-place fetching affordance.
  const showInitialLoading = isPending && !data;

  return (
    <PageContainer role="ApplicationsV2">
      {isError && <p>{APPLICATIONS_SEARCH_ERROR_MESSAGE}</p>}
      <div className="applications-v2__table">
        {showFilterPanel && (
          <div id="applications-v2-filter-panel">
            <ApplicationsV2FilterPanel
              appliedFilters={advancedFilters}
              onApply={(nextFilters) => {
                applyAdvancedFilters(nextFilters);
                setShowFilterPanel(false);
              }}
              onReset={() => {
                resetAdvancedFilters();
              }}
              onCancel={() => {
                setShowFilterPanel(false);
              }}
            />
          </div>
        )}

        {filterPills.length > 0 && (
          <FilterPills
            filters={filterPills}
            onRemoveFilter={removeFilterPill}
          />
        )}

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
            <>
              <ApplicationsV2SearchInput
                search={search}
                onSearchChange={setSearch}
              />
              <Button
                type="button"
                variant="tertiary"
                aria-expanded={showFilterPanel}
                aria-controls="applications-v2-filter-panel"
                onClick={() => setShowFilterPanel((open) => !open)}
              >
                <FilterIcon aria-hidden />
                Filter
              </Button>
            </>
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
