import type { OnChangeFn, VisibilityState } from '@tanstack/react-table';
import FilterPills from '../../../components/filter/FilterPills';
import type { FilterPill } from '../../../components/filter/filterPill';
import { applicationsV2Columns } from './applicationsV2Columns';
import { ApplicationsV2ColumnPanel } from './ApplicationsV2ColumnPanel';
import { ApplicationsV2FilterPanel } from './filters/ApplicationsV2FilterPanel';
import type { ApplicationsV2LookupOptions } from './filters/applicationsV2FilterConfig';
import type { ApplicationsV2AdvancedFilters } from './filters/applicationsV2Filters';
import type { ApplicationsV2Panel } from './ApplicationsV2Toolbar';

export type ApplicationsV2PanelsProps = {
  openPanel: ApplicationsV2Panel;
  onClosePanel: () => void;
  appliedFilters: ApplicationsV2AdvancedFilters;
  lookupOptions: ApplicationsV2LookupOptions;
  lookupsLoading: boolean;
  lookupsError: boolean;
  onApplyFilters: (filters: ApplicationsV2AdvancedFilters) => void;
  onResetFilters: () => void;
  columnVisibility: VisibilityState;
  onColumnVisibilityChange: OnChangeFn<VisibilityState>;
  onResetColumns: () => void;
  onSaveColumnDefaults: () => void | Promise<void>;
  isSavingColumnDefaults: boolean;
  filterPills: FilterPill[];
  onRemoveFilterPill: (pill: FilterPill) => void;
};

export function ApplicationsV2Panels({
  openPanel,
  onClosePanel,
  appliedFilters,
  lookupOptions,
  lookupsLoading,
  lookupsError,
  onApplyFilters,
  onResetFilters,
  columnVisibility,
  onColumnVisibilityChange,
  onResetColumns,
  onSaveColumnDefaults,
  isSavingColumnDefaults,
  filterPills,
  onRemoveFilterPill,
}: ApplicationsV2PanelsProps) {
  return (
    <>
      {openPanel === 'filters' && (
        <div id="applications-v2-filter-panel">
          <ApplicationsV2FilterPanel
            appliedFilters={appliedFilters}
            lookupOptions={lookupOptions}
            lookupsLoading={lookupsLoading}
            lookupsError={lookupsError}
            onApply={(nextFilters) => {
              onApplyFilters(nextFilters);
              onClosePanel();
            }}
            onReset={onResetFilters}
            onCancel={onClosePanel}
          />
        </div>
      )}
      {openPanel === 'columns' && (
        <div id="applications-v2-column-panel">
          <ApplicationsV2ColumnPanel
            columns={applicationsV2Columns}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={onColumnVisibilityChange}
            onReset={onResetColumns}
            onSaveDefault={onSaveColumnDefaults}
            isSavingDefault={isSavingColumnDefaults}
            onCancel={onClosePanel}
          />
        </div>
      )}
      {filterPills.length > 0 && (
        <FilterPills filters={filterPills} onRemoveFilter={onRemoveFilterPill} />
      )}
    </>
  );
}
