import { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import type { ColumnDef, VisibilityState } from '@tanstack/react-table';
import { DataTable } from './DataTable';

type Row = { id: string; name: string; status: string };

const columns: ColumnDef<Row, unknown>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'Application ID',
    enableSorting: false,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
  },
];

const rows: Row[] = [
  { id: '1', name: 'Alpha', status: 'Open' },
  { id: '2', name: 'Beta', status: 'Closed' },
];

describe('DataTable', () => {
  it('renders the title inline with the Columns control', () => {
    render(
      <DataTable
        title="Applications"
        data={rows}
        columns={columns}
        ariaLabel="Applications"
        getRowId={(row) => row.id}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Applications' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Columns' })).toBeInTheDocument();
  });

  it('renders belowHeader content between the toolbar and the table', () => {
    render(
      <DataTable
        title="Applications"
        data={rows}
        columns={columns}
        ariaLabel="Applications"
        getRowId={(row) => row.id}
        belowHeader={<div>Filter panel slot</div>}
      />,
    );

    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Applications',
    });
    const slot = screen.getByText('Filter panel slot');
    const table = screen.getByRole('table', { name: 'Applications' });

    expect(heading.compareDocumentPosition(slot)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(slot.compareDocumentPosition(table)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('renders rows and a loading state with colSpan matching visible columns', () => {
    const { rerender } = render(
      <DataTable
        data={rows}
        columns={columns}
        ariaLabel="Applications"
        getRowId={(row) => row.id}
      />,
    );

    expect(
      screen.getByRole('table', { name: 'Applications' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();

    rerender(
      <DataTable
        data={[]}
        columns={columns}
        ariaLabel="Applications"
        isLoading
        getRowId={(row) => row.id}
      />,
    );

    const loadingCell = screen.getByText('Loading...');
    expect(loadingCell).toHaveAttribute('colspan', '3');
  });

  it('renders an empty state whose colSpan matches visible columns', () => {
    const Harness = () => {
      const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        { status: false },
      );

      return (
        <DataTable
          data={[]}
          columns={columns}
          ariaLabel="Applications"
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          getRowId={(row) => row.id}
        />
      );
    };

    render(<Harness />);

    expect(screen.getByText('No results found.')).toHaveAttribute(
      'colspan',
      '2',
    );
  });

  it('hides and shows columns through the Columns menu', () => {
    const Harness = () => {
      const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
      );

      return (
        <DataTable
          data={rows}
          columns={columns}
          ariaLabel="Applications"
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          getRowId={(row) => row.id}
        />
      );
    };

    render(<Harness />);

    fireEvent.click(screen.getByRole('button', { name: 'Columns' }));
    const menu = screen.getByRole('menu', { name: 'Toggle column visibility' });
    const statusCheckbox = within(menu).getByRole('menuitemcheckbox', {
      name: /Status/i,
    });

    expect(statusCheckbox).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(within(statusCheckbox).getByRole('checkbox'));

    expect(
      screen.queryByRole('columnheader', { name: 'Status' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.queryByText('Open')).not.toBeInTheDocument();

    fireEvent.click(
      within(
        screen.getByRole('menuitemcheckbox', { name: /Status/i }),
      ).getByRole('checkbox'),
    );
    expect(
      screen.getByRole('columnheader', { name: 'Status' }),
    ).toBeInTheDocument();
  });

  it('invokes Save Default and Reset from the Columns menu without toggling network on checkbox changes', () => {
    const onSaveColumnDefaults = vi.fn();
    const onResetColumnVisibility = vi.fn();
    const onColumnVisibilityChange = vi.fn();

    render(
      <DataTable
        data={rows}
        columns={columns}
        ariaLabel="Applications"
        columnVisibility={{}}
        onColumnVisibilityChange={onColumnVisibilityChange}
        onSaveColumnDefaults={onSaveColumnDefaults}
        onResetColumnVisibility={onResetColumnVisibility}
        getRowId={(row) => row.id}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Columns' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reset Columns' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save Default' }));

    expect(onResetColumnVisibility).toHaveBeenCalledTimes(1);
    expect(onSaveColumnDefaults).toHaveBeenCalledTimes(1);

    const statusCheckbox = within(
      screen.getByRole('menuitemcheckbox', { name: /Status/i }),
    ).getByRole('checkbox');
    fireEvent.click(statusCheckbox);

    expect(onColumnVisibilityChange).toHaveBeenCalled();
    expect(onSaveColumnDefaults).toHaveBeenCalledTimes(1);
  });

  it('closes the Columns menu on Escape and outside click', () => {
    render(
      <DataTable
        data={rows}
        columns={columns}
        ariaLabel="Applications"
        getRowId={(row) => row.id}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Columns' }));
    expect(
      screen.getByRole('menu', { name: 'Toggle column visibility' }),
    ).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(
      screen.queryByRole('menu', { name: 'Toggle column visibility' }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Columns' }));
    fireEvent.mouseDown(document.body);
    expect(
      screen.queryByRole('menu', { name: 'Toggle column visibility' }),
    ).not.toBeInTheDocument();
  });

  it('emits sorting state when a sortable header is clicked', () => {
    const onSortingChange = vi.fn();

    render(
      <DataTable
        data={rows}
        columns={columns}
        ariaLabel="Applications"
        sorting={[]}
        onSortingChange={onSortingChange}
        manualSorting
        getRowId={(row) => row.id}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Name/i }));
    expect(onSortingChange).toHaveBeenCalled();
  });

  it('exposes aria-sort and a single toggle button on sortable headers', () => {
    const Harness = () => {
      const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);

      return (
        <DataTable
          data={rows}
          columns={columns}
          ariaLabel="Applications"
          sorting={sorting}
          onSortingChange={setSorting}
          manualSorting
          getRowId={(row) => row.id}
        />
      );
    };

    render(<Harness />);

    const nameHeader = screen.getByRole('columnheader', { name: /Name/i });
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    expect(
      within(nameHeader).getAllByRole('button', { name: /Name/i }),
    ).toHaveLength(1);

    fireEvent.click(within(nameHeader).getByRole('button', { name: /Name/i }));
    expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
  });

  it('does not render a sort control for non-sortable columns', () => {
    render(
      <DataTable
        data={rows}
        columns={columns}
        ariaLabel="Applications"
        getRowId={(row) => row.id}
      />,
    );

    expect(
      screen.queryByRole('button', { name: /Application ID/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Application ID' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Application ID' }),
    ).not.toHaveAttribute('aria-sort');
  });
});
