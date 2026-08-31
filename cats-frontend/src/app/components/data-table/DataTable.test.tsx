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
  it('renders the title inline with toolbar controls', () => {
    render(
      <DataTable
        title="Applications"
        data={rows}
        columns={columns}
        ariaLabel="Applications"
        getRowId={(row) => row.id}
        toolbarActions={<button type="button">Filter</button>}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Applications' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();
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

  it('applies sticky-right classes from column meta', () => {
    const stickyColumns: ColumnDef<Row, unknown>[] = [
      ...columns,
      {
        id: 'actions',
        accessorKey: 'id',
        header: 'Actions',
        enableSorting: false,
        meta: { sticky: 'right' },
        cell: () => 'Manage',
      },
    ];

    render(
      <DataTable
        data={rows}
        columns={stickyColumns}
        ariaLabel="Applications"
        getRowId={(row) => row.id}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Actions' })).toHaveClass(
      'data-table__cell--sticky-right',
    );

    const table = screen.getByRole('table', { name: 'Applications' });
    const actionCells = within(table)
      .getAllByRole('cell')
      .filter((cell) =>
        cell.classList.contains('data-table__cell--sticky-right'),
      );
    expect(actionCells).toHaveLength(2);
    expect(actionCells[0]).toHaveTextContent('Manage');
  });
});
