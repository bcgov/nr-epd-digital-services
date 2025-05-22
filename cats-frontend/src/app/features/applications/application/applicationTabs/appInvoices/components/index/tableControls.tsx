import React from 'react';
import { TableColumnsIcon } from '@cats/components/common/icon';
import './tableControls.css';
import { Button } from '@cats/components/button/Button';
import { InvoiceFilter } from './filter';

interface TableControlsProps {
  handleFilterChange: (filter: InvoiceFilter) => void;
  filter: InvoiceFilter;
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
          onClick={() => handleFilterChange(InvoiceFilter.ALL)}
          className={
            filter === InvoiceFilter.ALL
              ? 'table-controls__button--selected'
              : ''
          }
        >
          All
        </Button>
      </div>
      <div className="col text-right">
        <Button
          variant="tertiary"
          onClick={() => handleFilterChange(InvoiceFilter.DRAFT)}
          className={
            filter === InvoiceFilter.DRAFT
              ? 'table-controls__button--selected'
              : ''
          }
        >
          Drafts
        </Button>
      </div>
      <div className="col text-right">
        <Button
          variant="tertiary"
          onClick={() => handleFilterChange(InvoiceFilter.RECEIVED)}
          className={
            filter === InvoiceFilter.RECEIVED
              ? 'table-controls__button--selected'
              : ''
          }
        >
          Unpaid
        </Button>
      </div>
      <div className="col text-right columns-toggle">
        <Button
          variant="tertiary"
          onClick={() => {
            toggleColumnSelect();
          }}
        >
          <span className="table-controls__columns-toggle-label">
            <TableColumnsIcon />
            <span>Columns</span>
          </span>
        </Button>
      </div>
    </div>
  );
};

export default TableControls;
