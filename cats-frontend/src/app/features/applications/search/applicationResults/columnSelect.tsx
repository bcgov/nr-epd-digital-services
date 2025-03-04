import React from 'react';
import { TableColumn } from '../../../../components/table/TableColumn';
import './columnSelect.css';

interface ColumnSelectProps {
  columns: TableColumn[];
  handleColumnChange: (selectedColumns: TableColumn[]) => void;
}

const ColumnSelect: React.FC<ColumnSelectProps> = ({
  columns,
  handleColumnChange,
}) => {
  return (
    <div className="column-select-grid">
      {columns.map((column) => (
        <div key={column.id}>
          <label>
            <input
              type="checkbox"
              checked={column.isChecked || false}
              onChange={(event) => {
                const updatedColumns = columns.map((col) =>
                  col.id === column.id
                    ? { ...col, isChecked: event.target.checked }
                    : col,
                );
                handleColumnChange(updatedColumns);
              }}
            />
            {column.displayName}
          </label>
        </div>
      ))}
    </div>
  );
};

export default ColumnSelect;
