import React, { useEffect } from 'react';
import { TableColumn } from '../table/TableColumn';
import './ColumnSelect.css';
import {
  useSaveUserColumnPreferencesMutation,
  useGetUserColumnPreferencesQuery,
} from '../../graphql/columnPreferences.generated';

interface ColumnSelectProps {
  columns: TableColumn[];
  handleColumnChange: (updatedColumns: TableColumn[]) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  onResetColumns?: () => void;
  onSaveDefault?: () => void;
  page: string;
}

const ColumnSelect: React.FC<ColumnSelectProps> = ({
  columns,
  handleColumnChange,
  onSubmit,
  onCancel,
  onResetColumns,
  onSaveDefault,
  page,
}) => {
  const [saveColumnPreferences, { loading: saving, error: saveError }] =
    useSaveUserColumnPreferencesMutation();
  const {
    data: savedPreferences,
    loading: loadingPreferences,
    refetch,
  } = useGetUserColumnPreferencesQuery({
    variables: { page },
    skip: false,
  });

  const handleColumnToggle = (columnId: number, isChecked: boolean) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        return { ...column, active: isChecked };
      }
      return column;
    });
    handleColumnChange(updatedColumns);
  };

  const handleResetColumns = () => {
    if (onResetColumns) {
      onResetColumns();
    }
  };

  const handleSaveDefault = async () => {
    try {
      const columnConfig = columns.map((column) => ({
        id: column.id,
        displayName: column.displayName,
        active: column.active,
        sortOrder: column.sortOrder || 0,
      }));

      const result = await saveColumnPreferences({
        variables: {
          columnPreferences: {
            page,
            columns: columnConfig,
          },
        },
      });

      if (result.data?.saveUserColumnPreferences?.success) {
        refetch();
      } else {
        console.error(result.data?.saveUserColumnPreferences?.message);
      }

      if (onSaveDefault) {
        onSaveDefault();
      }
    } catch (error) {
      console.error('Failed to save column preferences:', error);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const columnItem = (column: TableColumn) => {
    return (
      <div key={column.id} className="column-item">
        <input
          type="checkbox"
          className="checkbox-color"
          aria-label={column.displayName}
          aria-checked={column.active ? 'true' : 'false'}
          checked={column.active}
          onChange={(e) => {
            handleColumnToggle(column.id, e.target.checked);
          }}
        />
        <span className="column-name">{column.displayName}</span>
      </div>
    );
  };

  return (
    <div className="column-select-container">
      <div className="column-select-grid" data-testid="column-select-grid">
        {columns.map((column) => columnItem(column))}
      </div>

      <div className="column-select-actions">
        <div className="column-select-actions-left">
          <button
            type="button"
            className="btn btn-reset"
            onClick={handleResetColumns}
          >
            Reset Columns
          </button>
          <button
            type="button"
            className="btn btn-save-default"
            onClick={handleSaveDefault}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Default'}
          </button>
        </div>
        <div className="column-select-actions-right">
          <button
            type="button"
            className="btn btn-submit"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            type="button"
            className="btn btn-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColumnSelect;
