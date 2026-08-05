import { fireEvent, screen } from '@testing-library/react';
import { useState } from 'react';
import type { VisibilityState } from '@tanstack/react-table';
import { Button } from '../../../components/button/Button';
import { renderWithQueryRouter } from '../../../../utilities/test/QueryTestUtils';
import { ApplicationsV2ColumnPanel } from './ApplicationsV2ColumnPanel';
import { ApplicationsV2FilterPanel } from './filters/ApplicationsV2FilterPanel';
import { applicationsV2Columns } from './applicationsV2Columns';
import { DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY } from './applicationsV2Columns';
import { EMPTY_ADVANCED_FILTERS } from './filters/applicationsV2Filters';

type Panel = 'none' | 'filters' | 'columns';

const PanelsFlow = () => {
  const [openPanel, setOpenPanel] = useState<Panel>('none');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY,
  );

  const togglePanel = (panel: Exclude<Panel, 'none'>) => {
    setOpenPanel((current) => (current === panel ? 'none' : panel));
  };

  return (
    <div>
      <Button
        type="button"
        aria-expanded={openPanel === 'filters'}
        onClick={() => togglePanel('filters')}
      >
        Filter
      </Button>
      <Button
        type="button"
        aria-expanded={openPanel === 'columns'}
        onClick={() => togglePanel('columns')}
      >
        Columns
      </Button>

      {openPanel === 'filters' && (
        <ApplicationsV2FilterPanel
          appliedFilters={EMPTY_ADVANCED_FILTERS}
          onApply={() => setOpenPanel('none')}
          onReset={vi.fn()}
          onCancel={() => setOpenPanel('none')}
        />
      )}
      {openPanel === 'columns' && (
        <ApplicationsV2ColumnPanel
          columns={applicationsV2Columns}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          onReset={vi.fn()}
          onSaveDefault={vi.fn()}
          onCancel={() => setOpenPanel('none')}
        />
      )}
    </div>
  );
};

describe('Applications V2 panel exclusivity', () => {
  it('keeps the filter and columns panels mutually exclusive', () => {
    renderWithQueryRouter(<PanelsFlow />, {
      initialEntries: ['/applications-v2'],
    });

    fireEvent.click(screen.getByRole('button', { name: 'Filter' }));
    expect(
      screen.getByRole('form', { name: 'Application filters' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('region', { name: 'Column visibility' }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Columns' }));
    expect(
      screen.queryByRole('form', { name: 'Application filters' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Column visibility' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Filter' }));
    expect(
      screen.getByRole('form', { name: 'Application filters' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('region', { name: 'Column visibility' }),
    ).not.toBeInTheDocument();
  });
});
