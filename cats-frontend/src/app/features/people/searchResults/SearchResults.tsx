import React, { FC, useEffect, useState } from 'react';
import { SpinnerIcon, SortIcon } from '../../../components/common/icon';
import { loadingState } from '../dto/PeopleSlice';
import { RequestStatus } from '../../../helpers/requests/status';
import { useSelector } from 'react-redux';
import { TableColumn } from '../../../components/table/TableColumn';
import Pagination from '../../../components/table/pagination/Pagination';
import Table from '../../../components/table/Table';

interface ColumnProps {
  data: any;
  columns: TableColumn[];
  pageChange: (pageRequested: number, resultsCount: number) => void;
  totalRecords: number;
  changeHandler: (event: any) => void;
}

const SearchResults: FC<ColumnProps> = ({
  pageChange,
  data,
  columns,
  totalRecords,
  changeHandler,
}) => {
  const requestStatus = useSelector(loadingState);
  let [currentPage, SetCurrentPage] = useState(1);
  let [resultsPerPage, SetResultsPerPage] = useState(5);

  const totalResults = totalRecords;
  const selectPage = (pageNumber: number): void => {
    SetCurrentPage(pageNumber);
  };

  const changeResultsPerPage = (pageNumber: number): void => {
    SetResultsPerPage(pageNumber);
  };

  useEffect(() => {
    pageChange(currentPage, resultsPerPage);
  }, [currentPage, resultsPerPage]);

  return (
    <Table
      showPageOptions={true}
      label="Search Results"
      isLoading={requestStatus}
      columns={columns}
      data={data}
      totalResults={totalResults}
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
