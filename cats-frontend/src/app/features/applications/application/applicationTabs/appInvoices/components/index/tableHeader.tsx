import React, { useState } from 'react';
import TableControls from './tableControls';
import './tableHeader.css';
import { TableColumn } from '@cats/components/table/TableColumn';
import { InvoiceFilter } from '../invoice-enums/filter';
import ColumnSelect from './columnSelect';

interface TableHeaderProps {
  columns: TableColumn[];
  handleColumnChange: (selectedColumns: TableColumn[]) => void;
  handleFilterChange: (filter: InvoiceFilter) => void;
  filter: InvoiceFilter;
  createInvoiceButton?: React.ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  handleColumnChange,
  handleFilterChange,
  filter,
  createInvoiceButton,
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
      {createInvoiceButton && (
        <div className="d-flex justify-content-start mb-3">
          {createInvoiceButton}
        </div>
      )}
    </div>
  );
};

export default TableHeader;
