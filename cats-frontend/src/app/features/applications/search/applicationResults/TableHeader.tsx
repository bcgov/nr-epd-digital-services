import React, { useState } from 'react';
import { TableColumn } from '../../../../components/table/TableColumn';
import TableControls from './tableControls';
import ColumnSelect from './columnSelect';
import { Filter } from '../../../../../generated/types';
import './TableHeader.css';

interface TableHeaderProps {
  columns: TableColumn[];
  handleColumnChange: (selectedColumns: TableColumn[]) => void;
  handleFilterChange: (filter: Filter) => void;
  filter: Filter;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  handleColumnChange,
  handleFilterChange,
  filter,
}) => {
  const [showColumnSelect, setShowColumnSelect] = useState(false);

  const toggleColumnSelect = () => {
    setShowColumnSelect(!showColumnSelect);
  };

  return (
    <div>
      <div className="row align-items-center">
        <div className="col">
          <h2>Applications</h2>
        </div>
        <div className="col-auto">
          <TableControls
            handleFilterChange={handleFilterChange}
            filter={filter}
            toggleColumnSelect={toggleColumnSelect}
          />
        </div>
      </div>
      {showColumnSelect && (
        <div className="row">
          <div className="col">
            <ColumnSelect
              columns={columns}
              handleColumnChange={handleColumnChange}
            />
          </div>
        </div>
      )}
      <hr className="table-header-hr" />
    </div>
  );
};

export default TableHeader;
