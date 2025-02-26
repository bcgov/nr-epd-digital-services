import React from 'react';
import { TableColumn } from '../../../components/table/TableColumn';
import './Column.css';
import { Button } from '../../../components/button/Button';

interface ColumnProps {
  toggleColumnSelectionForDisplay: (item: TableColumn) => void;
  columns: TableColumn[];
  reset: () => void;
  close: () => void;
}

const Column: React.FC<ColumnProps> = ({
  toggleColumnSelectionForDisplay,
  columns,
  reset,
  close,
}) => {
  const filterColumnsByGroup = (groupId: number) => {
    return columns.filter(
      (item) => item.groupId === groupId && item.dynamicColumn === false,
    );
  };

  const columnItem = (item: TableColumn, index: number) => {
    return (
      <div key={index} className="column-item more-gap">
        <input
          type="checkbox"
          className="checkbox-color"
          aria-label={item.displayName}
          aria-checked={item.isChecked ? 'true' : 'false'}
          disabled={item.disabled}
          checked={item.isChecked}
          onChange={(e) => {
            toggleColumnSelectionForDisplay(item);
          }}
        />
        {item.displayName}
      </div>
    );
  };

  return (
    <div className="column-section">
      <div className="row">
        <div className="col-12 col-sm-6 col-md-3">
          {filterColumnsByGroup(1).map((item, index) => {
            return columnItem(item, index);
          })}
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          {filterColumnsByGroup(2).map((item, index) => {
            return columnItem(item, index);
          })}
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          {filterColumnsByGroup(3).map((item, index) => {
            return columnItem(item, index);
          })}
        </div>
        <div className=" col-12 col-sm-6 col-md-3">
          {filterColumnsByGroup(4).map((item, index) => {
            return columnItem(item, index);
          })}
        </div>
      </div>
      <div className="row">
        <div className="col-12 d-flex gap-2">
          <Button variant="secondary" onClick={reset}>
            Reset Columns
          </Button>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Column;
