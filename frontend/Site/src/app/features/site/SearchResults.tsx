import React, { FC, useEffect } from "react";
import { SpinnerIcon, SortIcon } from "../../components/common/icon";
import "./SearchResults.css";
import { loadingState } from "./dto/SiteSlice";
import { RequestStatus } from "../../helpers/requests/status";
import { useSelector } from "react-redux";
import TableColumns, { ColumnType } from "./dto/Columns";

interface ColumnProps {
  data: any;
  columns: TableColumns[];
}

const SearchResults: FC<ColumnProps> = ({ data, columns }) => {
 
  const requestStatus = useSelector(loadingState);

  useEffect(() => {
    console.log("loadingState", requestStatus);
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
          <a href="#" aria-label={`${displayName + " " + value}`}>
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
          {columns.map((column,columnIndex) => {
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
    return( <tr className="search-results-section-header">
    <th scope="col" className="search-results-th">
      <input type="checkbox" className="checkbox-color" />
    </th>
    {columns.map((item, index) => (
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
            <td colSpan={8} className="noContent border-quick-color">
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
    <table className="table" aria-label="Search Results">
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
  );
};

export default SearchResults;
