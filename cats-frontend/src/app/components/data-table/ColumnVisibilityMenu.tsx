import { useEffect, useId, useRef, useState } from 'react';
import type { Table } from '@tanstack/react-table';
import { TableColumnsIcon } from '../common/icon';

interface ColumnVisibilityMenuProps<TData> {
  table: Table<TData>;
}

export function ColumnVisibilityMenu<TData>({
  table,
}: ColumnVisibilityMenuProps<TData>) {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hideableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide());

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (hideableColumns.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="data-table__columns">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="true"
        className="data-table__columns-button"
        onClick={() => setOpen((value) => !value)}
      >
        <TableColumnsIcon aria-hidden="true" />
        Columns
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Toggle column visibility"
          className="data-table__columns-menu"
        >
          {hideableColumns.map((column) => {
            const label =
              typeof column.columnDef.header === 'string'
                ? column.columnDef.header
                : column.id;

            return (
              <label
                key={column.id}
                role="menuitemcheckbox"
                aria-checked={column.getIsVisible()}
                className="data-table__columns-item"
              >
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
                {label}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
