import { Button } from '../../../components/button/Button';
import { FilterIcon, TableColumnsIcon } from '../../../components/common/icon';
import { ApplicationsV2SearchInput } from './ApplicationsV2SearchInput';

export type ApplicationsV2Panel = 'none' | 'filters' | 'columns';

export type ApplicationsV2ToolbarProps = {
  search: string;
  onSearchChange: (search: string) => void;
  showColumnPanel: boolean;
  showFilterPanel: boolean;
  onTogglePanel: (panel: Exclude<ApplicationsV2Panel, 'none'>) => void;
};

export function ApplicationsV2Toolbar({
  search,
  onSearchChange,
  showColumnPanel,
  showFilterPanel,
  onTogglePanel,
}: ApplicationsV2ToolbarProps) {
  return (
    <>
      <ApplicationsV2SearchInput
        search={search}
        onSearchChange={onSearchChange}
      />

      <Button
        type="button"
        variant="tertiary"
        active={showColumnPanel}
        aria-expanded={showColumnPanel}
        aria-controls="applications-v2-column-panel"
        onClick={() => onTogglePanel('columns')}
      >
        <TableColumnsIcon aria-hidden />
        Columns
      </Button>
      <Button
        type="button"
        variant="tertiary"
        active={showFilterPanel}
        aria-expanded={showFilterPanel}
        aria-controls="applications-v2-filter-panel"
        onClick={() => onTogglePanel('filters')}
      >
        <FilterIcon aria-hidden />
        Filter
      </Button>
    </>
  );
}
