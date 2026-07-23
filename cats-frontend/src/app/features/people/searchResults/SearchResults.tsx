import React, { FC } from 'react';
import { RequestStatus } from '../../../helpers/requests/status';
import { TableColumn } from '../../../components/table/TableColumn';
import Table from '../../../components/table/Table';

interface ColumnProps {
  data: any;
  columns: TableColumn[];
  pageChange: (pageRequested: number, resultsCount: number) => void;
  totalRecords: number;
  changeHandler: (event: any) => void;
  isLoading: RequestStatus;
  currentPage: number;
  resultsPerPage: number;
}

const SearchResults: FC<ColumnProps> = ({
  pageChange,
  data,
  columns,
  totalRecords,
  changeHandler,
  isLoading,
  currentPage,
  resultsPerPage,
}) => {
  const selectPage = (pageNumber: number): void => {
    pageChange(pageNumber, resultsPerPage);
  };

  const changeResultsPerPage = (pageSize: number): void => {
    pageChange(1, pageSize);
  };

  return (
    <Table
      showPageOptions={true}
      label="Search Results"
      isLoading={isLoading}
      columns={columns}
      data={data}
      totalResults={totalRecords}
      selectPage={selectPage}
      changeResultsPerPage={changeResultsPerPage}
      currentPage={currentPage}
      resultsPerPage={resultsPerPage}
      allowRowsSelect={true}
      changeHandler={(event) => {
        changeHandler(event);
      }}
      editMode={false}
      idColumnName="id"
    ></Table>
  );
};

export default SearchResults;
