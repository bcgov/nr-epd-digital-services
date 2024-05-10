import React, { FC } from 'react'
import { SpinnerIcon } from '../../common/icon';
import { RequestStatus } from '../../../helpers/requests/status';
import { ColumnType, TableColumn } from '../TableColumn';

interface TableBodyProps {
   
    isLoading: RequestStatus;
    columns: TableColumn[];
    data: any;   
  }

const TableBody: FC<TableBodyProps> = ({isLoading,columns,data}) => {

    const renderNoResultsFound = () => {
        return (
          <tr>
            <td colSpan={20} className="noContent table-border-light">
              {isLoading === RequestStatus.loading ? (
                <div className="content-loading">
                  <SpinnerIcon data-testid="loading-spinner" className="fa-spin " />
                  <span className="noContentText"> Searching </span>
                </div>
              ) : (
                <span className="noContentText">No Results Found</span>
              )}
            </td>
          </tr>
        );
      };
    
      const getTableCellHtml = (
        type: ColumnType,
        displayName: string,
        value: string,
        rowKey: number
      ) => {
        if (type === ColumnType.Link) {
          return (
            <td key={rowKey} className="table-border-light content-text">
              <a href="/site/details" aria-label={`${displayName + " " + value}`}>
                {value}
              </a>
            </td>
          );
        } else {
          return (
            <td
              key={rowKey}
              className="table-border-light content-text"
              aria-label={`${displayName + " " + value}`}
            >
              {value}
            </td>
          );
        }
      };
    
      const getValue = (rowIndex: number, propertyName: string) => {
        return data[rowIndex][propertyName];
      };
    
      const renderTableCell = (
        column: TableColumn,
        rowIndex: number,
        columnIndex: number
      ) => {
        if (isNaN(rowIndex)) return "";
    
        if (data[rowIndex] === undefined) {
          return "";
        }
    
        const cellValue = column.graphQLPropertyName
          .split(",")
          .map((graphQLPropertyName) => getValue(rowIndex, graphQLPropertyName))
          .join(" ");
    
        return getTableCellHtml(
          column.displayType,
          column.displayName,
          cellValue,
          columnIndex + rowIndex
        );
      };
    
      const renderTableRow = (rowIndex: number) => {
        return (
          <React.Fragment key={rowIndex}>
            <tr>
              <td className="table-border-light content-text">
                <input
                  type="checkbox"
                  className="checkbox-color"
                  aria-label="Select Row"
                />
              </td>
              {columns &&
                columns.map((column, columnIndex) => {
                  return renderTableCell(column, rowIndex, columnIndex);
                })}
              <td className="table-border-light content-text">
                <a href="/map">View</a>
              </td>
              <td className="table-border-light content-text">
                <a href="/site/details">Details</a>
              </td>
            </tr>
          </React.Fragment>
        );
      };
      
  return (
    <tbody>
    {data.length === 0
      ? renderNoResultsFound()
      : data.map((item: any, index: number) => renderTableRow(index))}
  </tbody>
  )
}

export default TableBody