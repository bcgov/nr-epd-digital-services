import React from "react";
import { TableColumn } from "../../../../components/table/TableColumn";
import Table from "../../../../components/table/Table";
import { RequestStatus } from "../../../../helpers/requests/status";
import TableHeader from "./TableHeader";
import { Filter } from "../searchSlice";

interface ApplicationResultsTableProps {
  columns: TableColumn[];
  results: any[];
  requestStatus: RequestStatus;
  handleColumnChange: (selectedColumns: TableColumn[]) => void;
  handleFilterChange: (filter: Filter) => void;
  page: number;
  pageSize: number;
  handlePageChange: (newPage: number) => void;
  handlePageSizeChange: (newPageSize: number) => void;
  showPageOptions: boolean;
  totalResults: number;
  filter: Filter;
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
        changeHandler={() => {}}
        editMode={false}
        idColumnName="id"
        currentPage={page}
        resultsPerPage={pageSize}
        selectPage={handlePageChange}
        changeResultsPerPage={handlePageSizeChange}
        showPageOptions={showPageOptions}
        totalResults={totalResults}
      />
    </div>
  );
};

export default ApplicationResultsTable;
