import React, { FC, useEffect, useState } from "react";
import { SpinnerIcon, SortIcon } from "../../components/common/icon";
import "./SearchResults.css";
import { loadingState } from "./dto/SiteSlice";
import { RequestStatus } from "../../helpers/requests/status";
import { useSelector } from "react-redux";
import TableColumns, { ColumnType } from "./dto/Columns";
import Pagination from "./pagination/Pagination";

interface ColumnProps {
  data: any;
  columns: TableColumns[];
  pageChange:(pageRequested:number,resultsCount:number) => void;
  totalRecords: number;
}

const SearchResults: FC<ColumnProps> = ({ pageChange, data, columns, totalRecords }) => {
 
  const requestStatus = useSelector(loadingState);
 let [currentPage,SetCurrentPage] = useState(1);
 let [resultsPerPage,SetResultsPerPage] = useState(5);




 // let currentPage = 3;
 // const resultsPerPage = 5;
  const totalResults = 20;
  const selectPage = (pageNumber:number): void=>
  {
    SetCurrentPage( pageNumber);
  }

  const changeResultsPerPage = (pageNumber:number): void=>
  {
    SetResultsPerPage( pageNumber);
    
  }

  useEffect(()=>{
    pageChange(currentPage,resultsPerPage);
  },[currentPage,resultsPerPage])

  useEffect(() => {
    console.log("loadingState", columns);
  }, [requestStatus]);

  const getTableCellHtml = (
    type: ColumnType,
    displayName: string,
    value: string,
    rowKey: number 
  ) => {
    if (type === ColumnType.Link) {
      return (
        <td key={rowKey} className="border-quick-color search-results-text">
          <a href="/site/details" aria-label={`${displayName + " " + value}`}>
            {value}
          </a>
        </td>
      );
    } else {
      return (
        <td key={rowKey}
          className="border-quick-color search-results-text"
          aria-label={`${displayName + " " + value}`}        >
          {value}
        </td>
      );
    }
  };

  const getValue = (rowIndex: number, propertyName: string) => {
    return data[rowIndex][propertyName];
  };

  const renderTableCell = (column: TableColumns, rowIndex: number, columnIndex: number) => {
    if (isNaN(rowIndex)) return "";

    if (data[rowIndex] === undefined) {
      return "";
    }

    const cellValue = column.graphQLPropertyName
    .split(",")
    .map((graphQLPropertyName) => getValue(rowIndex, graphQLPropertyName))
    .join(" ");

    return getTableCellHtml(column.displayType, column.displayName, cellValue, columnIndex+rowIndex);
  };

  const renderTableRow = (rowIndex: number) => {
    return (
      <React.Fragment key={rowIndex}>
        <tr >
          <td className="border-quick-color search-results-text">
            <input
              type="checkbox"
              className="checkbox-color"
              aria-label="Select Row"
            />
          </td>
          {columns && columns.map((column,columnIndex) => {
            return renderTableCell(column, rowIndex, columnIndex);
          })}
          <td className="border-quick-color search-results-text">
            <a href="/map">View</a>
          </td>
          <td className="border-quick-color search-results-text">
            <a href="/site/details">Details</a>
          </td>
        </tr>
      </React.Fragment>
    );
  };

  const renderTableHeader = () => {

    if (!columns || columns.length === 0) {
      return null;
    }

    return( <tr className="search-results-section-header">
    <th scope="col" className="search-results-th checkbox-column">
      <input type="checkbox" className="checkbox-color" />
    </th>
    {columns && columns.map((item, index) => (
      <th
        key={index}
        scope="col"
        className={`search-results-th ${
          item.displayName === "Region" ||
          item.displayName === "Last Updated Date"
            ? "hide-custom"
            : ""
        }`}
      >
        {item.displayName}
        <SortIcon className="search-results-sort-icon" />
      </th>
    ))}
    <th scope="col" className={`search-results-th`}>
      View Map
      <SortIcon className="search-results-sort-icon" />
    </th>
    <th scope="col" className={`search-results-th`}>
      Details
      <SortIcon className="search-results-sort-icon" />
    </th>
  </tr>)
  }


  const renderNoResultsFound = () => {
   return (<tr>
            <td colSpan={20} className="noContent border-quick-color">
              {requestStatus === RequestStatus.loading ? (
                <div className="results-loading">
                  <SpinnerIcon
                    data-testid="loading-spinner"
                    className="fa-spin "
                  />
                  <span className="noContentText"> Searching </span>
                </div>
              ) : (
                <span className="noContentText">No Results Found</span>
              )}
            </td>
          </tr>)
  }

  return (
    <React.Fragment>
    <div className="tableWidth table-border-radius">
    <table className="table " aria-label="Search Results">
      <thead aria-label="Search Results Header">
        {renderTableHeader()}
      </thead>
      <tbody>
        {data.length === 0 ? (
          renderNoResultsFound()
        ) : (
          data.map((item: any, index: number) => renderTableRow(index))          
        )}
      </tbody>
    </table>
   
    </div>
     <div>
     <Pagination changeResultsPerPage={changeResultsPerPage}  selectPage={selectPage} currentPage={currentPage} resultsPerPage={resultsPerPage} totalResults={totalResults} />
   </div>
   </React.Fragment>

  );
};

export default SearchResults;
