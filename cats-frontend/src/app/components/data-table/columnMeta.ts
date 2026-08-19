import type { Column, RowData } from '@tanstack/react-table';

export type DataTableStickySide = 'left' | 'right';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    sticky?: DataTableStickySide;
  }
}

export function stickyColumnClassName<TData>(
  column: Column<TData, unknown>,
): string | undefined {
  const sticky = column.columnDef.meta?.sticky;
  if (sticky === 'right') {
    return 'data-table__cell--sticky-right';
  }
  if (sticky === 'left') {
    return 'data-table__cell--sticky-left';
  }
  return undefined;
}
