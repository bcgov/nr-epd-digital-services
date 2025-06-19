import React, { FC, useEffect, useState } from 'react';
import { TableColumn } from '../TableColumn';
import './TableHeader.css';
import HeaderCell from './HeaderCell';

interface TableHeaderProps {
  columns: TableColumn[];
  allowRowsSelect: boolean;
  sortHandler: (row: any, ascSort: boolean) => void;
  currentSortColumn?: string;
  selectAllRowsHandler: (event: any, checked: boolean) => void;
  currentPageAllRowsSelected: boolean;
}

const TableHeader: FC<TableHeaderProps> = ({
  columns,
  allowRowsSelect,
  sortHandler,
  currentSortColumn,
  selectAllRowsHandler,
  currentPageAllRowsSelected,
}) => {
  const [isCurrentPageSelected, SetIsCurrentPageSelected] = useState(
    currentPageAllRowsSelected,
  );

  useEffect(() => {
    SetIsCurrentPageSelected(currentPageAllRowsSelected);
  }, [currentPageAllRowsSelected]);

  if (!columns || columns.length === 0) {
    return null;
  }
  return (
    <tr>
      {allowRowsSelect && (
        <th
          scope="col"
          className={`checkbox-column`}
        >
          <input
            type="checkbox"
            className="checkbox-color"
            checked={isCurrentPageSelected}
            onChange={(event) => {
              selectAllRowsHandler(event, !currentPageAllRowsSelected);
            }}
          />
        </th>
      )}
      {columns &&
        columns.map((item, index) => (
          <HeaderCell
            key={index}
            item={item}
            index={index}
            sortHandler={sortHandler}
            currentSortColumn={currentSortColumn}
          />
        ))}
    </tr>
  );
};

export default TableHeader;
