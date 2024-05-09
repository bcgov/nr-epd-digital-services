import React, { FC } from 'react';
import { TableColumn } from '../TableColumn';
import { SortIcon } from '../../common/icon';
import './TableHeader.css'

interface TableHeaderProps
{
    columns: TableColumn[]
}

const TableHeader:FC<TableHeaderProps> = ({columns}) => {
    if (!columns || columns.length === 0) {
        return null;
      }
  
      return (
        <tr className="table-header">
          <th scope="col" className="table-header-th checkbox-column">
            <input type="checkbox" className="checkbox-color" />
          </th>
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
                }`}
              >
                {item.displayName}
                <SortIcon className="column-sort-icon" />
              </th>
            ))}
          <th scope="col" className={`table-header-th`}>
            View Map
            <SortIcon className="column-sort-icon" />
          </th>
          <th scope="col" className={`table-header-th`}>
            Details
            <SortIcon className="column-sort-icon" />
          </th>
        </tr>
      );
}

export default TableHeader