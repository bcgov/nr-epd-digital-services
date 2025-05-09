import React from 'react';
import { TableColumn } from '../../../../components/table/TableColumn';
import Table from '../../../../components/table/Table';
import { RequestStatus } from '../../../../helpers/requests/status';
import TableHeader from './TableHeader';
import { ApplicationFilter } from '../../../../../generated/types';

interface ApplicationResultsTableProps {
  columns: TableColumn[];
  results: any[];
  requestStatus: RequestStatus;
  handleColumnChange: (selectedColumns: TableColumn[]) => void;
  handleFilterChange: (filter: ApplicationFilter) => void;
  page: number;
  pageSize: number;
  handlePageChange: (newPage: number) => void;
  handlePageSizeChange: (newPageSize: number) => void;
  showPageOptions: boolean;
  totalResults: number;
  filter: ApplicationFilter;
  sortHandler: (column: TableColumn, ascending: boolean) => void;
  changeHandler: (eventRecord: any) => void;
}

const ApplicationResultsTable: React.FC<ApplicationResultsTableProps> = ({
  columns,
  results,
  requestStatus,
  handleFilterChange,
  page,
  pageSize,
  handleColumnChange,
  handlePageChange,
  handlePageSizeChange,
  showPageOptions,
  totalResults,
  filter,
  sortHandler,
  changeHandler,
}) => {
  return (
    <div>
      <TableHeader
        columns={columns}
        handleColumnChange={handleColumnChange}
        handleFilterChange={handleFilterChange}
        filter={filter}
      />
      <Table
        label="Search Results"
        isLoading={requestStatus}
        columns={columns.filter((column) => column.isChecked)}
        data={results}
        changeHandler={changeHandler}
        editMode={false}
        idColumnName="id"
        currentPage={page}
        resultsPerPage={pageSize}
        selectPage={handlePageChange}
        changeResultsPerPage={handlePageSizeChange}
        showPageOptions={showPageOptions}
        totalResults={totalResults}
        sortHandler={sortHandler}
      />
    </div>
  );
};

export default ApplicationResultsTable;
