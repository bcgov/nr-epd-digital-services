import React from 'react';
import './columnSelect.css';
import { TableColumn } from '@cats/components/table/TableColumn';

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
                if (process.env.NODE_ENV === 'development') {
                  console.log('Updated columns:', updatedColumns);
                }
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
