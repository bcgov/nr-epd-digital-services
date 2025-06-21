import React, { FC, useState } from 'react';
import { ColumnSize, TableColumn } from '../TableColumn';
import { SortIcon, DropdownUpIcon, DropdownIcon } from '../../common/icon';

interface HeaderCellProps {
  item: TableColumn;
  index: number;
  sortHandler: (row: any, ascSort: boolean) => void;
  currentSortColumn?: string;
}

const getColumnSize = (columnSize: ColumnSize | undefined) => {
  switch (columnSize) {
    case ColumnSize.Triple:
      return 'triple';
    case ColumnSize.Double:
      return 'double';
    case ColumnSize.Small:
      return 'custom-small';
    case ColumnSize.XtraSmall:
      return 'xtraSmall';
    default:
      return '';
  }
};

const HeaderCell: FC<HeaderCellProps> = ({
  item,
  index,
  sortHandler,
  currentSortColumn,
}) => {
  const [ascendingSort, setSortDirection] = useState(false);

  return (
    <th
      key={index}
      scope="col"
      className={`${getColumnSize(item.columnSize)} ${item.customHeaderCss} `}
    >
      {item.displayName}
      {!item.dynamicColumn &&
        currentSortColumn === item.graphQLPropertyName &&
        ascendingSort && (
          <DropdownUpIcon
            data-testid={`${item.graphQLPropertyName}-table-sort-ascending`}
            className="column-sort-icon"
            onClick={() => {
              sortHandler(item, !ascendingSort);
              setSortDirection(!ascendingSort);
            }}
          />
        )}
      {!item.dynamicColumn &&
        currentSortColumn === item.graphQLPropertyName &&
        !ascendingSort && (
          <DropdownIcon
            data-testid={`${item.graphQLPropertyName}-table-sort-descending`}
            className="column-sort-icon"
            onClick={() => {
              sortHandler(item, !ascendingSort);
              setSortDirection(!ascendingSort);
            }}
          />
        )}
      {!item.dynamicColumn &&
        currentSortColumn !== item.graphQLPropertyName && (
          <SortIcon
            data-testid={`${item.graphQLPropertyName}-table-sort`}
            className="column-sort-icon"
            onClick={() => {
              sortHandler(item, !ascendingSort);
              setSortDirection(!ascendingSort);
            }}
          />
        )}
    </th>
  );
};

export default HeaderCell;
