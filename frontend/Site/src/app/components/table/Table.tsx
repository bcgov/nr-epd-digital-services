import React, { FC } from "react";
import { SpinnerIcon, SortIcon } from "../common/icon";
import { RequestStatus } from "../../helpers/requests/status";
import { TableColumn } from "./TableColumn";
import "./Table.css";
import Pagination from "./pagination/Pagination";
import TableHeader from "./header/TableHeader";
import TableBody from "./body/TableBody";

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
  showPageOptions? : boolean;
  allowRowsSelect? : boolean;
  changeHandler:(eventRecord:any)=>void,
  editMode: boolean
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
  changeHandler,
  editMode
}) => {
  

  return (
    <React.Fragment>
      <div className="tableWidth table-border-radius">
        <table className="table" aria-label={label}>
          <thead aria-label={`${label} Header`}>
            <TableHeader columns={columns} allowRowsSelect={allowRowsSelect ?? false} />
          </thead>
            <TableBody isLoading={isLoading} columns={columns} data={data} allowRowsSelect={allowRowsSelect ?? false} changeHandler={changeHandler} editMode={editMode} />
        </table>
      </div>
      <div>
        {showPageOptions && data.length !== 0 ? (
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
