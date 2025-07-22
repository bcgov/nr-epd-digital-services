import React from 'react';
import Table from '@cats/components/table/Table';
import { RequestStatus } from '@cats/helpers/requests/status';
import TableHeader from './tableHeader';
import { InvoiceFilter } from '../invoice-enums/filter';
import { TableColumn } from '@cats/components/table/TableColumn';

interface InvoiceIndexTableProps {
  requestStatus: RequestStatus;
  results: any[];
  columns: TableColumn[];
  handleColumnChange: (selectedColumns: TableColumn[]) => void;
  filter: InvoiceFilter;
  handleFilterChange: (filter: InvoiceFilter) => void;
  sortHandler: (column: TableColumn, ascending: boolean) => void;
  createInvoiceButton?: React.ReactNode;
}

const InvoiceIndexTable: React.FC<InvoiceIndexTableProps> = ({
  requestStatus,
  results,
  columns,
  handleColumnChange,
  filter,
  handleFilterChange,
  sortHandler,
  createInvoiceButton,
}) => {
  return (
    <div>
      <TableHeader
        columns={columns}
        handleColumnChange={handleColumnChange}
        handleFilterChange={handleFilterChange}
        filter={filter}
        createInvoiceButton={createInvoiceButton}
      />
      <Table
        label="Invoices"
        isLoading={requestStatus}
        columns={columns.filter((column) => column.isChecked)}
        data={results}
        changeHandler={() => {}}
        editMode={false}
        idColumnName="id"
        sortHandler={sortHandler}
      />
    </div>
  );
};

export default InvoiceIndexTable;
