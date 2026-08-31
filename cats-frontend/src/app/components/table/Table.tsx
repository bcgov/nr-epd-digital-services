import React, { FC, useEffect, useState } from 'react';
import { RequestStatus } from '../../helpers/requests/status';
import { TableColumn } from './TableColumn';
import './Table.css';
import Pagination from './pagination/Pagination';
import TableHeader from './header/TableHeader';
import TableBody from './body/TableBody';

interface TableProps {
  label: string;
  isLoading: RequestStatus;
  columns: TableColumn[];
  data: any;
  totalResults?: number;
  selectPage?: (pageNumber: number) => void;
  changeResultsPerPage?: (pageNumber: number) => void;
  currentPage?: number;
  resultsPerPage?: number;
  showPageOptions?: boolean;
  allowRowsSelect?: boolean;
  isRowSelectable?: (row: any) => boolean;
  changeHandler: (eventRecord: any) => void;
  editMode: boolean;
  srMode?: boolean;
  idColumnName: string;
  sortHandler?: (row: any, ascSort: boolean) => void;
  deleteHandler?: (eventRecord: any) => void;
}

const Table: FC<TableProps> = ({
  label,
  isLoading,
  columns,
  data,
  totalResults,
  selectPage,
  changeResultsPerPage,
  currentPage,
  resultsPerPage,
  showPageOptions,
  allowRowsSelect,
  isRowSelectable,
  changeHandler,
  editMode,
  srMode,
  idColumnName,
  sortHandler,
  deleteHandler,
}) => {
  const [currentSortColumn, SetCurrentSortColumn] = useState('');
  const [allRowsSelectedPages, SetAllRowsSelectedPages] = useState<number[]>(
    [],
  );

  useEffect(() => {
    if (data.length === 0) {
      SetAllRowsSelectedPages([]);
      SetCurrentPageAllRowSelected(false);
    }
  }, [data]);

  const [currentPageAllRowSelected, SetCurrentPageAllRowSelected] = useState(
    null || Boolean,
  );
  const [allRowsSelectedEventFlag, SetAllRowsSelectedEvenFlag] =
    useState(false);

  const resolvedCurrentPage = currentPage ?? 1;

  const isCurrentPageAllRowsSelected = () => {
    const isSelected =
      allRowsSelectedPages.findIndex(
        (pageNumber) => pageNumber === resolvedCurrentPage,
      ) !== -1;
    SetCurrentPageAllRowSelected(isSelected);
  };

  const selectAllRows = (event: any, checked: boolean) => {
    if (event) {
      SetAllRowsSelectedEvenFlag(true);
      if (checked) {
        const pageFound = allRowsSelectedPages.includes(resolvedCurrentPage);
        if (!pageFound) {
          SetAllRowsSelectedPages([
            ...allRowsSelectedPages,
            resolvedCurrentPage,
          ]);
        }
        // Use click intent — allRowsSelectedPages is still stale here until re-render.
        SetCurrentPageAllRowSelected(true);
      } else {
        SetAllRowsSelectedPages(
          allRowsSelectedPages.filter(
            (pageNumber) => pageNumber !== resolvedCurrentPage,
          ),
        );
        SetCurrentPageAllRowSelected(false);
      }
    }
  };

  const resetAllRowsSelectedEventFlag = () => {
    SetAllRowsSelectedEvenFlag(false);
  };

  const removePageFromAllRowsSelected = () => {
    SetAllRowsSelectedPages(
      allRowsSelectedPages.filter(
        (pageNumber) => pageNumber !== resolvedCurrentPage,
      ),
    );
    SetCurrentPageAllRowSelected(false);
  };

  useEffect(() => {
    isCurrentPageAllRowsSelected();
  }, [currentPage]);

  const parentSortHandler = sortHandler ?? (() => {});

  let tableSortHandler = (row: any, ascSort: any) => {
    SetCurrentSortColumn(row.graphQLPropertyName);
    parentSortHandler(row, ascSort);
  };
  let rowDeleteHandler = deleteHandler ?? (() => {});

  return (
    <React.Fragment>
      <div className={`${data?.length > 10 ? 'pe-2' : ''} tableWidth`}>
        <table className="table" aria-label={label}>
          <thead aria-label={`${label} Header`}>
            <TableHeader
              columns={columns}
              allowRowsSelect={allowRowsSelect ?? false}
              sortHandler={tableSortHandler}
              currentSortColumn={currentSortColumn}
              selectAllRowsHandler={selectAllRows}
              currentPageAllRowsSelected={currentPageAllRowSelected}
            />
          </thead>
          <TableBody
            isLoading={isLoading}
            columns={columns}
            data={data}
            allowRowsSelect={allowRowsSelect ?? false}
            isRowSelectable={isRowSelectable}
            changeHandler={changeHandler}
            editMode={editMode}
            srMode={srMode}
            idColumnName={idColumnName}
            rowDeleteHandler={rowDeleteHandler}
            allRowsSelected={currentPageAllRowSelected}
            currentPage={currentPage ?? 1}
            allRowsSelectedPages={allRowsSelectedPages}
            allRowsSelectedEventFlag={allRowsSelectedEventFlag}
            resetAllRowsSelectedEventFlag={resetAllRowsSelectedEventFlag}
            removePageFromAllRowsSelected={removePageFromAllRowsSelected}
          />
        </table>
      </div>
      <div>
        {showPageOptions && data?.length !== 0 ? (
          <Pagination
            changeResultsPerPage={changeResultsPerPage}
            selectPage={selectPage}
            currentPage={currentPage}
            resultsPerPage={resultsPerPage}
            totalResults={totalResults}
          />
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default Table;
