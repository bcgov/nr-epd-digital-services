import React, { useState } from 'react';
import TableControls from './tableControls';
import './TableHeader.css';
import { TableColumn } from '@cats/components/table/TableColumn';
import { InvoiceFilter } from './filter';
import ColumnSelect from './columnSelect';

interface TableHeaderProps {
  columns: TableColumn[];
  handleColumnChange: (selectedColumns: TableColumn[]) => void;
  handleFilterChange: (filter: InvoiceFilter) => void;
  filter: InvoiceFilter;
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
          <h2>Invoices</h2>
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
