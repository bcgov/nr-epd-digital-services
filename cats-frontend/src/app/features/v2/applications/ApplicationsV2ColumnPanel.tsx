import type { ColumnDef, OnChangeFn, VisibilityState } from '@tanstack/react-table';
import { Button } from '../../../components/button/Button';
import './ApplicationsV2ColumnPanel.css';

export type ApplicationsV2ColumnPanelProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  columnVisibility: VisibilityState;
  onColumnVisibilityChange: OnChangeFn<VisibilityState>;
  onReset: () => void;
  onSaveDefault: () => void | Promise<void>;
  onCancel: () => void;
  isSavingDefault?: boolean;
};

type ColumnOption = {
  id: string;
  label: string;
};

const hideableColumnOptions = <TData,>(
  columns: ColumnDef<TData, unknown>[],
): ColumnOption[] =>
  columns.flatMap((column) => {
    if (!column.id || column.enableHiding === false) {
      return [];
    }
    return [
      {
        id: column.id,
        label:
          typeof column.header === 'string' ? column.header : column.id,
      },
    ];
  });

const isColumnVisible = (
  visibility: VisibilityState,
  columnId: string,
): boolean => visibility[columnId] !== false;

export function ApplicationsV2ColumnPanel<TData>({
  columns,
  columnVisibility,
  onColumnVisibilityChange,
  onReset,
  onSaveDefault,
  onCancel,
  isSavingDefault = false,
}: ApplicationsV2ColumnPanelProps<TData>) {
  const options = hideableColumnOptions(columns);

  const handleToggle = (columnId: string, checked: boolean) => {
    onColumnVisibilityChange((previous) => ({
      ...previous,
      [columnId]: checked,
    }));
  };

  return (
    <div
      className="applications-v2-column-panel"
      data-testid="applications-v2-column-panel"
      role="region"
      aria-label="Column visibility"
    >
      <div className="applications-v2-column-panel__grid">
        {options.map((column) => {
          const checked = isColumnVisible(columnVisibility, column.id);
          return (
            <label
              key={column.id}
              className="applications-v2-column-panel__item"
            >
              <input
                type="checkbox"
                checked={checked}
                aria-label={column.label}
                onChange={(event) =>
                  handleToggle(column.id, event.target.checked)
                }
              />
              <span>{column.label}</span>
            </label>
          );
        })}
      </div>

      <div className="d-flex flex-wrap justify-content-between w-100 mt-3">
        <div>
          <Button
            type="button"
            variant="secondary"
            onClick={onReset}
            data-testid="Reset Columns"
          >
            Reset Columns
          </Button>
        </div>
        <div className="d-flex gap-2">
          <Button
            type="button"
            onClick={() => {
              void onSaveDefault();
            }}
            disabled={isSavingDefault}
            data-testid="Save Default Columns"
          >
            {isSavingDefault ? 'Saving...' : 'Save Default'}
          </Button>
          <Button
            type="button"
            variant="tertiary"
            onClick={onCancel}
            data-testid="Cancel Columns"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
