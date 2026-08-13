import { memo } from 'react';
import {
  flexRender,
  type Row,
  type VisibilityState,
} from '@tanstack/react-table';
import { stickyColumnClassName } from './columnMeta';

interface MemoizedTableRowProps<TData> {
  row: Row<TData>;
  columnVisibility: VisibilityState;
  onClick?: () => void;
}

function TableRowInner<TData>({
  row,
  columnVisibility: _columnVisibility,
  onClick,
}: MemoizedTableRowProps<TData>) {
  return (
    <tr
      onClick={onClick}
      className={onClick ? 'data-table__row--clickable' : undefined}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className={stickyColumnClassName(cell.column)}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

function areRowsEqual<TData>(
  previous: MemoizedTableRowProps<TData>,
  next: MemoizedTableRowProps<TData>,
) {
  return (
    previous.row.id === next.row.id &&
    previous.row.original === next.row.original &&
    previous.columnVisibility === next.columnVisibility &&
    previous.onClick === next.onClick
  );
}

export const MemoizedTableRow = memo(
  TableRowInner,
  areRowsEqual,
) as typeof TableRowInner;
