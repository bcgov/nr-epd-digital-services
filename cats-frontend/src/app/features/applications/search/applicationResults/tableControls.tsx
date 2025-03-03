import React from 'react';
import { TableColumnsIcon } from '../../../../components/common/icon';
import './tableControls.css';
import { Button } from '../../../../components/button/Button';
import { Filter } from '../Search';

interface TableControlsProps {
  handleFilterChange: (filter: Filter) => void;
  filter: Filter;
  toggleColumnSelect: () => void;
}

const TableControls: React.FC<TableControlsProps> = ({
  handleFilterChange,
  filter,
  toggleColumnSelect,
}) => {
  return (
    <div className="row">
      <div className="col text-right">
        <Button
          variant="tertiary"
          onClick={() => handleFilterChange(Filter.All)}
          className={
            filter === Filter.All ? 'table-controls__button--selected' : ''
          }
        >
          All
        </Button>
      </div>
      <div className="col text-right">
        <Button
          variant="tertiary"
          onClick={() => handleFilterChange(Filter.Assigned)}
          className={
            filter === Filter.Assigned ? 'table-controls__button--selected' : ''
          }
        >
          Assigned
        </Button>
      </div>
      <div className="col text-right">
        <Button
          variant="tertiary"
          onClick={() => handleFilterChange(Filter.Completed)}
          className={
            filter === Filter.Completed
              ? 'table-controls__button--selected'
              : ''
          }
        >
          Completed
        </Button>
      </div>
      <div className="col text-right columns-toggle">
        <Button
          variant="tertiary"
          onClick={() => {
            toggleColumnSelect();
          }}
        >
          <span className="d-inline-flex">
            <TableColumnsIcon />
            <span>Columns</span>
          </span>
        </Button>
      </div>
    </div>
  );
};

export default TableControls;
