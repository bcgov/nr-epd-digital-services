import React, { useState } from 'react';
import PageContainer from '../../../components/simple/PageContainer';
import { DataTable, DataTablePagination } from '../../../components/data-table';
import { Button } from '../../../components/button/Button';
import FilterPills from '../../../components/filter/FilterPills';
import { FilterIcon, TableColumnsIcon } from '../../../components/common/icon';
import '../../../components/filter/FilterControls.css';
import { useApplicationsV2 } from './hooks/useApplicationsV2';
import { useApplicationsV2ColumnPreferences } from './hooks/useApplicationsV2ColumnPreferences';
import { useApplicationsV2FilterLookups } from './hooks/useApplicationsV2FilterLookups';
import { useApplicationsV2SearchParams } from './hooks/useApplicationsV2SearchParams';
import { ApplicationsV2SearchInput } from './ApplicationsV2SearchInput';
import { ApplicationsV2ColumnPanel } from './ApplicationsV2ColumnPanel';
import { ApplicationsV2FilterPanel } from './filters/ApplicationsV2FilterPanel';
import { applicationsV2Columns } from './applicationsV2Columns';
import './ApplicationsV2.css';

type ApplicationsV2Panel = 'none' | 'filters' | 'columns';

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
  const showFilterPanel = openPanel === 'filters';
  const showColumnPanel = openPanel === 'columns';

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
            <>
              <ApplicationsV2SearchInput
                search={search}
                onSearchChange={setSearch}
              />

              <Button
                type="button"
                variant="tertiary"
                aria-expanded={showColumnPanel}
                aria-controls="applications-v2-column-panel"
                className={
                  showColumnPanel
                    ? 'table-controls__button--selected'
                    : undefined
                }
                onClick={() => togglePanel('columns')}
              >
                <span className="d-flex align-items-center gap-2">
                  <TableColumnsIcon aria-hidden />
                  Columns
                </span>
              </Button>
              <Button
                type="button"
                variant="tertiary"
                aria-expanded={showFilterPanel}
                aria-controls="applications-v2-filter-panel"
                className={
                  showFilterPanel
                    ? 'table-controls__button--selected'
                    : undefined
                }
                onClick={() => togglePanel('filters')}
              >
                <span className="d-flex align-items-center gap-2">
                  <FilterIcon aria-hidden />
                  Filter
                </span>
              </Button>
            </>
          }
          belowHeader={
            <>
              {showFilterPanel && (
                <div id="applications-v2-filter-panel">
                  <ApplicationsV2FilterPanel
                    appliedFilters={advancedFilters}
                    lookupOptions={lookupOptions}
                    lookupsLoading={lookupsLoading}
                    lookupsError={lookupsError}
                    onApply={(nextFilters) => {
                      applyAdvancedFilters(nextFilters);
                      setOpenPanel('none');
                    }}
                    onReset={() => {
                      resetAdvancedFilters();
                    }}
                    onCancel={() => {
                      setOpenPanel('none');
                    }}
                  />
                </div>
              )}
              {showColumnPanel && (
                <div id="applications-v2-column-panel">
                  <ApplicationsV2ColumnPanel
                    columns={applicationsV2Columns}
                    columnVisibility={columnVisibility}
                    onColumnVisibilityChange={setColumnVisibility}
                    onReset={resetColumnVisibility}
                    onSaveDefault={saveColumnDefaults}
                    isSavingDefault={isSavingColumnDefaults}
                    onCancel={() => {
                      setOpenPanel('none');
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
