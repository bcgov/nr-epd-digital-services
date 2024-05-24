import React, { FC } from 'react';
import { ColumnSize, TableColumn } from '../TableColumn';
import { SortIcon } from '../../common/icon';
import './TableHeader.css'

interface TableHeaderProps
{
    columns: TableColumn[];
    allowRowsSelect: boolean
}

const TableHeader:FC<TableHeaderProps> = ({columns,allowRowsSelect}) => {
    if (!columns || columns.length === 0) {
        return null;
      }
  
      return (
        <tr className="table-header">
         {allowRowsSelect && <th scope="col" className="table-header-th checkbox-column">
            <input type="checkbox" className="checkbox-color" />
          </th>}
          {columns &&
            columns.map((item, index) => (
              <th
                key={index}
                scope="col"
                className={`table-header-th ${
                  item.displayName === "Region" ||
                  item.displayName === "Last Updated Date"
                    ? "hide-custom"
                    : ""
                } ${item.columnSize === ColumnSize.Triple ? "triple": ""} `}
              >
                {item.displayName}
                <SortIcon className="column-sort-icon" />
              </th>
            ))}
          {/* <th scope="col" className={`table-header-th`}>
            View Map
            <SortIcon className="column-sort-icon" />
          </th>
          <th scope="col" className={`table-header-th`}>
            Details
            <SortIcon className="column-sort-icon" />
          </th> */}
        </tr>
      );
}

export default TableHeader