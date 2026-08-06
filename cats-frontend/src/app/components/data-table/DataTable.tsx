import { useMemo, useState, type ReactNode } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { DropdownIcon, DropdownUpIcon, SortIcon } from '../common/icon';
import { stickyColumnClassName } from './columnMeta';
import { MemoizedTableRow } from './MemoizedTableRow';
import './DataTable.css';

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  ariaLabel: string;
  /** Optional page/section title rendered inline with toolbar controls. */
  title?: ReactNode;
  /** Extra controls rendered in the table toolbar. */
  toolbarActions?: ReactNode;
  /** Content rendered between the toolbar header and the table (e.g. filter panel). */
  belowHeader?: ReactNode;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  getRowId?: (row: TData) => string;
  /** When true, sorting is controlled externally (e.g. server-side). */
  manualSorting?: boolean;
  /** Called when a data row is clicked (excluding header). */
  onRowClick?: (row: TData) => void;
  isLoading?: boolean;
  /** Subtle in-place fetching state (keeps rows visible). */
  isFetching?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
}

function sortAriaValue(
  isSorted: false | 'asc' | 'desc',
): 'none' | 'ascending' | 'descending' {
  if (isSorted === 'asc') {
    return 'ascending';
  }
  if (isSorted === 'desc') {
    return 'descending';
  }
  return 'none';
}

export function DataTable<TData>({
  data,
  columns,
  ariaLabel,
  title,
  toolbarActions,
  belowHeader,
  sorting: controlledSorting,
  onSortingChange: controlledOnSortingChange,
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange: controlledOnColumnVisibilityChange,
  getRowId,
  manualSorting = false,
  onRowClick,
  isLoading = false,
  isFetching = false,
  loadingMessage = 'Loading...',
  emptyMessage = 'No results found.',
}: DataTableProps<TData>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalColumnVisibility, setInternalColumnVisibility] =
    useState<VisibilityState>({});

  const sorting = controlledSorting ?? internalSorting;
  const onSortingChange = controlledOnSortingChange ?? setInternalSorting;
  const columnVisibility =
    controlledColumnVisibility ?? internalColumnVisibility;
  const onColumnVisibilityChange =
    controlledOnColumnVisibilityChange ?? setInternalColumnVisibility;

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange,
    onColumnVisibilityChange,
    manualSorting,
    getCoreRowModel: getCoreRowModel(),
    ...(manualSorting ? {} : { getSortedRowModel: getSortedRowModel() }),
    getRowId,
  });

  const rows = table.getRowModel().rows;
  const visibleColumnCount = Math.max(table.getVisibleLeafColumns().length, 1);

  const headerGroups = useMemo(
    () => table.getHeaderGroups(),
    // TanStack Table's instance is referentially stable; recompute headers when
    // sort/visibility/column defs change (see react-hooks/exhaustive-deps).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, sorting, columnVisibility, columns],
  );

  const showHeader = Boolean(title) || Boolean(toolbarActions);

  return (
    <div className="data-table">
      {showHeader && (
        <div className="data-table__header">
          {title ? <h1 className="data-table__title">{title}</h1> : null}
          <div className="data-table__toolbar">{toolbarActions}</div>
        </div>
      )}

      {belowHeader ? (
        <div className="data-table__below-header">{belowHeader}</div>
      ) : null}

      <div
        className={`data-table__scroll${isFetching ? ' data-table__scroll--fetching' : ''}`}
        aria-busy={isLoading || isFetching || undefined}
      >
        <table className="data-table__table" aria-label={ariaLabel}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      scope="col"
                      className={stickyColumnClassName(header.column)}
                      aria-sort={canSort ? sortAriaValue(sorted) : undefined}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          className="data-table__sort-button"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          <span
                            aria-hidden="true"
                            className="data-table__sort-icon"
                          >
                            {sorted === 'asc' ? (
                              <DropdownUpIcon />
                            ) : sorted === 'desc' ? (
                              <DropdownIcon />
                            ) : (
                              <SortIcon />
                            )}
                          </span>
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="data-table__state" colSpan={visibleColumnCount}>
                  {loadingMessage}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="data-table__state" colSpan={visibleColumnCount}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <MemoizedTableRow
                  key={row.id}
                  row={row}
                  columnVisibility={columnVisibility}
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
