import React from 'react';
import { TableColumnsIcon } from '@cats/components/common/icon';
import styles from './tableControls.module.css';
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
              ? styles.tableControlsButtonSelected
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
              ? styles.tableControlsButtonSelected
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
              ? styles.tableControlsButtonSelected
              : ''
          }
        >
          Unpaid
        </Button>
      </div>
      <div className={`col text-right ${styles.columnsToggle}`}>
        <Button
          variant="tertiary"
          onClick={() => {
            toggleColumnSelect();
          }}
        >
          <span className={styles.columnsToggleLabel}>
            <TableColumnsIcon />
            <span>Columns</span>
          </span>
        </Button>
      </div>
    </div>
  );
};

export default TableControls;
