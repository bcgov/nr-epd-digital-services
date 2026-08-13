import { fireEvent, render, screen } from '@testing-library/react';
import type { ColumnDef, VisibilityState } from '@tanstack/react-table';
import { useState } from 'react';
import { ApplicationsV2ColumnPanel } from './ApplicationsV2ColumnPanel';

type Row = { id: string };

const columns: ColumnDef<Row, unknown>[] = [
  { id: 'id', header: 'Application ID' },
  { id: 'status', header: 'Status' },
  { id: 'commonName', header: 'Common Name' },
  { id: 'view', header: 'View', enableHiding: false },
];

describe('ApplicationsV2ColumnPanel', () => {
  it('renders hideable columns in a panel and toggles visibility immediately', () => {
    const onColumnVisibilityChange = vi.fn();

    render(
      <ApplicationsV2ColumnPanel
        columns={columns}
        columnVisibility={{ commonName: false }}
        onColumnVisibilityChange={onColumnVisibilityChange}
        onReset={vi.fn()}
        onSaveDefault={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('region', { name: 'Column visibility' }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('View')).not.toBeInTheDocument();

    expect(screen.getByLabelText('Application ID')).toBeChecked();
    expect(screen.getByLabelText('Common Name')).not.toBeChecked();

    fireEvent.click(screen.getByLabelText('Common Name'));

    expect(onColumnVisibilityChange).toHaveBeenCalledTimes(1);
    const updater = onColumnVisibilityChange.mock.calls[0][0] as (
      previous: VisibilityState,
    ) => VisibilityState;
    expect(updater({ commonName: false })).toEqual({ commonName: true });
  });

  it('invokes reset, save, and cancel actions', () => {
    const onReset = vi.fn();
    const onSaveDefault = vi.fn();
    const onCancel = vi.fn();

    render(
      <ApplicationsV2ColumnPanel
        columns={columns}
        columnVisibility={{}}
        onColumnVisibilityChange={vi.fn()}
        onReset={onReset}
        onSaveDefault={onSaveDefault}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByTestId('Reset Columns'));
    fireEvent.click(screen.getByTestId('Save Default Columns'));
    fireEvent.click(screen.getByTestId('Cancel Columns'));

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onSaveDefault).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('updates controlled visibility when a checkbox is toggled', () => {
    const Harness = () => {
      const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        { status: false },
      );

      return (
        <>
          <ApplicationsV2ColumnPanel
            columns={columns}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            onReset={vi.fn()}
            onSaveDefault={vi.fn()}
            onCancel={vi.fn()}
          />
          <output data-testid="status-visible">
            {String(columnVisibility.status !== false)}
          </output>
        </>
      );
    };

    render(<Harness />);

    expect(screen.getByTestId('status-visible')).toHaveTextContent('false');
    fireEvent.click(screen.getByLabelText('Status'));
    expect(screen.getByTestId('status-visible')).toHaveTextContent('true');
  });
});
