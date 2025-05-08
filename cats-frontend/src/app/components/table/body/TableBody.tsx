import React, { FC, ReactNode, useEffect, useState } from 'react';
import { SpinnerIcon } from '../../common/icon';
import { RequestStatus } from '../../../helpers/requests/status';
import { TableColumn } from '../TableColumn';

import { FormFieldType } from '../../input-controls/IFormField';
import {
  Label,
  TextInput,
  Link,
  CheckBoxInput,
  DropdownInput,
  DateInput,
  TextAreaInput,
  DropdownSearchInput,
  DeleteIcon,
  IconButton,
  SearchCustomInput,
  Icon,
} from '../../input-controls/InputControls';
import { get } from '../utils';

import styles from './TableBody.module.css';

interface TableBodyProps {
  isLoading: RequestStatus;
  columns: TableColumn[];
  data: any;
  allowRowsSelect: boolean;
  changeHandler: (data: any) => void;
  editMode: boolean;
  srMode?: boolean;
  idColumnName: string;
  rowDeleteHandler: (data: any) => void;
  allRowsSelected: boolean;
  currentPage: number;
  allRowsSelectedPages: number[];
  allRowsSelectedEventFlag: boolean;
  resetAllRowsSelectedEventFlag: () => void;
  removePageFromAllRowsSelected: () => void;
}

interface SelectedRowsType {
  [key: number]: string[]; // or whatever type `rowsIds` is
}

const TableBody: FC<TableBodyProps> = ({
  isLoading,
  columns,
  data,
  allowRowsSelect,
  changeHandler,
  editMode,
  srMode,
  idColumnName,
  rowDeleteHandler,
  allRowsSelected,
  currentPage,
  allRowsSelectedPages,
  allRowsSelectedEventFlag,
  resetAllRowsSelectedEventFlag,
  removePageFromAllRowsSelected,
}) => {
  const [selectedRowIds, SetSelectedRowsId] = useState<SelectedRowsType>({});

  useEffect(() => {
    if (!allRowsSelectedEventFlag) return;

    const rowsIds: string[] = data.map((item: any, index: number) => {
      const checkboxId = getValue(index, idColumnName);
      return checkboxId;
    });

    if (allRowsSelected) {
      SetSelectedRowsId((prevItems) => ({
        ...prevItems,
        [currentPage]: [...(prevItems[currentPage] || []), ...rowsIds],
      }));
    } else {
      SetSelectedRowsId((prevItems) => ({
        ...prevItems,
        [currentPage]: (prevItems[currentPage] || []).filter(
          (item) => !rowsIds.includes(item),
        ),
      }));
    }

    if (allRowsSelectedEventFlag) {
      changeHandler({
        id: 'select_all',
        property: 'select_all',
        value: data,
        selected: allRowsSelected,
      });
      resetAllRowsSelectedEventFlag();
    }
  }, [allRowsSelected]);

  const handleSelectTableRow = (isChecked: any, id: string, rowIndex: any) => {
    if (isChecked) {
      SetSelectedRowsId((prevItems) => ({
        ...prevItems,
        [currentPage]: [...(prevItems[currentPage] || []), id],
      }));
    } else {
      SetSelectedRowsId((prevItems) => ({
        ...prevItems,
        [currentPage]: (prevItems[currentPage] || []).filter(
          (item) => item !== id,
        ),
      }));

      removePageFromAllRowsSelected();
    }

    tableRecordChangeHandler(rowIndex, 'select_row', isChecked);
  };

  const isChecked = (id: string) => {
    return (
      selectedRowIds[currentPage] &&
      selectedRowIds[currentPage].indexOf(id) !== -1
    );
  };

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

  const tableRecordChangeHandler = (
    rowKey: number,
    propertyName: any,
    value: any,
    isDeleteRow?: boolean,
  ) => {
    const changeRecord = {
      row: getDataRow(rowKey),
      property: propertyName,
      value: value,
    };

    if (isDeleteRow) {
      rowDeleteHandler(changeRecord);
    } else {
      changeHandler(changeRecord);
    }
  };

  const getTableCellHtml = (
    field: any,
    displayName: string,
    value: string | ReactNode,
    rowKey: number,
    href: string,
    changeHandler: any,
    editMode: boolean,
    columnIndex: number,
  ) => {
    if (field.type === FormFieldType.Text) {
      return (
        <TextInput
          key={columnIndex}
          label={field.label}
          customLabelCss={field.customLabelCss}
          customInputTextCss={field.customInputTextCss}
          customEditLabelCss={field.customEditLabelCss}
          customEditInputTextCss={field.customEditInputTextCss}
          customPlaceholderCss={field.customPlaceholderCss}
          placeholder={field.placeholder}
          value={value}
          onChange={(value) =>
            tableRecordChangeHandler(rowKey, field.graphQLPropertyName, value)
          }
          type={field.type}
          validation={field.validation}
          allowNumbersOnly={field.allowNumbersOnly}
          isEditing={editMode ?? true}
          tableMode={field.tableMode ?? false}
          stickyCol={field.stickyCol}
          isDisabled={field.isDisabled}
        />
      );
    } else if (field.type === FormFieldType.Search) {
      return (
        <SearchCustomInput
          key={columnIndex}
          label={field.label}
          customLabelCss={field.customLabelCss}
          customInputTextCss={field.customInputTextCss}
          customEditLabelCss={field.customEditLabelCss}
          customEditInputTextCss={field.customEditInputTextCss}
          placeholder={field.placeholder}
          value={value}
          options={field.options || []}
          onChange={(value) =>
            tableRecordChangeHandler(rowKey, field.graphQLPropertyName, value)
          }
          type={FormFieldType.Text}
          validation={field.validation}
          allowNumbersOnly={field.allowNumbersOnly}
          isEditing={editMode ?? true}
          tableMode={field.tableMode ?? false}
          stickyCol={field.stickyCol}
          customPlaceholderCss={field.customPlaceholderCss}
          isLoading={field.isLoading}
          customInfoMessage={field.customInfoMessage}
          customMenuMessage={field.customMenuMessage}
        />
      );
    } else if (field.type === FormFieldType.Label) {
      return (
        <Label
          key={columnIndex}
          label={field.label}
          customLabelCss={field.customLabelCss}
          customInputTextCss={field.customInputTextCss}
          customEditLabelCss={field.customEditLabelCss}
          customEditInputTextCss={field.customEditInputTextCss}
          placeholder={field.placeholder}
          value={value}
          onChange={(value) =>
            tableRecordChangeHandler(rowKey, field.graphQLPropertyName, value)
          }
          type={field.type}
          validation={field.validation}
          allowNumbersOnly={field.allowNumbersOnly}
          isEditing={editMode ?? true}
          tableMode={field.tableMode ?? false}
          stickyCol={field.stickyCol}
        />
      );
    } else if (field.type === FormFieldType.Link) {
      return (
        <Link
          key={columnIndex}
          label={field.label}
          customLabelCss={field.customLabelCss}
          customInputTextCss={field.customInputTextCss}
          customEditLabelCss={field.customEditLabelCss}
          customEditInputTextCss={field.customEditInputTextCss}
          placeholder={field.placeholder}
          value={value}
          onChange={(value) =>
            tableRecordChangeHandler(rowKey, field.graphQLPropertyName, value)
          }
          type={field.type}
          validation={field.validation}
          allowNumbersOnly={field.allowNumbersOnly}
          isEditing={editMode ?? true}
          tableMode={field.tableMode ?? false}
          stickyCol={field.stickyCol}
          href={field.href}
          customLinkValue={field.customLinkValue}
          customIcon={field.customIcon}
          componentName={field.componentName}
        />
      );
    } else if (field.type === FormFieldType.DropDown) {
      return (
        <DropdownInput
          key={columnIndex}
          label={field.label}
          customLabelCss={field.customLabelCss}
          customInputTextCss={field.customInputTextCss}
          customEditLabelCss={field.customEditLabelCss}
          customEditInputTextCss={field.customEditInputTextCss}
          customPlaceholderCss={field.customPlaceholderCss}
          placeholder={field.placeholder}
          value={value}
          onChange={(value) =>
            tableRecordChangeHandler(rowKey, field.graphQLPropertyName, value)
          }
          type={field.type}
          validation={field.validation}
          allowNumbersOnly={field.allowNumbersOnly}
          isEditing={editMode ?? true}
          tableMode={field.tableMode ?? false}
          stickyCol={field.stickyCol}
          href={field.href}
          options={field.options}
        />
      );
    } else if (field.type === FormFieldType.Checkbox) {
      return (
        <CheckBoxInput
          key={columnIndex}
          label={field.label}
          customLabelCss={field.customLabelCss}
          customInputTextCss={field.customInputTextCss}
          customEditLabelCss={field.customEditLabelCss}
          customEditInputTextCss={field.customEditInputTextCss}
          customPlaceholderCss={field.customPlaceholderCss}
          placeholder={field.placeholder}
          isChecked={value === 'true' ? true : false}
          // value={value}
          onChange={(value) =>
            tableRecordChangeHandler(rowKey, field.graphQLPropertyName, value)
          }
          type={field.type}
          validation={field.validation}
          allowNumbersOnly={field.allowNumbersOnly}
          isEditing={editMode ?? true}
          srMode={srMode ?? true}
          tableMode={field.tableMode ?? false}
          stickyCol={field.stickyCol}
          href={field.href}
          options={field.options}
        />
      );
    } else if (field.type === FormFieldType.Date) {
      return (
        <DateInput
          key={columnIndex}
          label={field.label}
          customLabelCss={field.customLabelCss}
          customInputTextCss={field.customInputTextCss}
          customEditLabelCss={field.customEditLabelCss}
          customEditInputTextCss={field.customEditInputTextCss}
          customPlaceholderCss={field.customPlaceholderCss}
          placeholder={field.placeholder}
          value={value}
          onChange={(value) =>
            tableRecordChangeHandler(rowKey, field.graphQLPropertyName, value)
          }
          type={field.type}
          isEditing={editMode ?? true}
          tableMode={field.tableMode ?? false}
          stickyCol={field.stickyCol}
          dateFormat={field.dateFormat}
        />
      );
    } else if (field.type === FormFieldType.TextArea) {
      return (
        <TextAreaInput
          key={columnIndex}
          label={field.label}
          customLabelCss={field.customLabelCss}
          customInputTextCss={field.customInputTextCss}
          customEditLabelCss={field.customEditLabelCss}
          customEditInputTextCss={field.customEditInputTextCss}
          customPlaceholderCss={field.customPlaceholderCss}
          placeholder={field.placeholder}
          value={value}
          onChange={(value) =>
            tableRecordChangeHandler(rowKey, field.graphQLPropertyName, value)
          }
          type={field.type}
          validation={field.validation}
          allowNumbersOnly={field.allowNumbersOnly}
          isEditing={editMode ?? true}
          textAreaRow={field.textAreaRow}
          textAreaColoum={field.textAreaColoum}
          tableMode={field.tableMode ?? false}
          stickyCol={field.stickyCol}
        />
      );
    } else if (field.type === FormFieldType.DropDownWithSearch) {
      return (
        <DropdownSearchInput
          key={columnIndex}
          label={field.label}
          customLabelCss={field.customLabelCss}
          customInputTextCss={field.customInputTextCss}
          customEditLabelCss={field.customEditLabelCss}
          customEditInputTextCss={field.customEditInputTextCss}
          customPlaceholderCss={field.customPlaceholderCss}
          placeholder={field.placeholder}
          options={field.options || []}
          value={value}
          onChange={(value) =>
            tableRecordChangeHandler(rowKey, field.graphQLPropertyName, value)
          }
          type={field.type}
          isEditing={editMode ?? true}
          tableMode={field.tableMode ?? false}
          stickyCol={field.stickyCol}
          handleSearch={field.handleSearch}
          filteredOptions={field.filteredOptions || []}
          isLoading={field.isLoading}
          customInfoMessage={field.customInfoMessage}
        />
      );
    } else if (field.type === FormFieldType.DeleteIcon) {
      return (
        <DeleteIcon
          key={columnIndex}
          label={field.label}
          customLabelCss={field.customLabelCss}
          customInputTextCss={field.customInputTextCss}
          customEditLabelCss={field.customEditLabelCss}
          customEditInputTextCss={field.customEditInputTextCss}
          placeholder={field.placeholder}
          options={field.options || []}
          value={value}
          onChange={(value) =>
            tableRecordChangeHandler(
              rowKey,
              field.graphQLPropertyName,
              value,
              true,
            )
          }
          type={field.type}
          isEditing={editMode ?? true}
          tableMode={field.tableMode ?? false}
          stickyCol={field.stickyCol}
        />
      );
    } else if (field.type === FormFieldType.IconButton) {
      return (
        <IconButton
          key={columnIndex}
          label={field.label}
          customLabelCss={field.customLabelCss}
          customInputTextCss={field.customInputTextCss}
          customEditLabelCss={field.customEditLabelCss}
          customEditInputTextCss={field.customEditInputTextCss}
          placeholder={field.placeholder}
          options={field.options || []}
          value={value}
          onChange={(value) =>
            tableRecordChangeHandler(rowKey, field.graphQLPropertyName, value)
          }
          type={field.type}
          isEditing={editMode ?? true}
          tableMode={field.tableMode ?? false}
          stickyCol={field.stickyCol}
          customLinkValue={field.customLinkValue}
          customIcon={field.customIcon}
        />
      );
    } else if (field.type === FormFieldType.Icon) {
      return (
        <Icon
          key={columnIndex}
          label={field.label}
          customLabelCss={field.customLabelCss}
          customInputTextCss={field.customInputTextCss}
          customEditLabelCss={field.customEditLabelCss}
          customEditInputTextCss={field.customEditInputTextCss}
          placeholder={field.placeholder}
          options={field.options || []}
          value={value}
          onChange={(value) =>
            tableRecordChangeHandler(rowKey, field.graphQLPropertyName, value)
          }
          type={field.type}
          isEditing={editMode ?? true}
          tableMode={field.tableMode ?? false}
          stickyCol={field.stickyCol}
          customLinkValue={field.customLinkValue}
          customIcon={field.customIcon}
        />
      );
    }
  };

  const getValue = (rowIndex: number, propertyName: string) => {
    return get(data[rowIndex], propertyName);
  };

  const getDataRow = (rowIndex: number) => {
    return data[rowIndex];
  };

  const renderTableCell = (
    column: TableColumn,
    rowIndex: number,
    columnIndex: number,
  ) => {
    if (isNaN(rowIndex)) return '';

    if (data[rowIndex] === undefined) {
      return '';
    }

    let cellData: any = column.graphQLPropertyName
      .split(',')
      .map((graphQLPropertyName) => getValue(rowIndex, graphQLPropertyName));

    let rowData = getDataRow(rowIndex);

    let cellValue: string | ReactNode;

    if (column.renderCell && typeof column.renderCell === 'function') {
      cellValue = cellData.map((data: any, i: number) => (
        <React.Fragment key={i}>{column.renderCell!(data, rowData)}</React.Fragment>
      ));
    } else {
      cellValue = cellData.join(' ');
    }

    return getTableCellHtml(
      column.displayType,
      column.displayName,
      cellValue ?? '',
      rowIndex,
      column.linkRedirectionURL ?? '',
      changeHandler,
      editMode,
      columnIndex,
    );
  };

  const renderTableRow = (rowIndex: number) => {
    const checkboxId = getValue(rowIndex, idColumnName);
    const rowChecked = isChecked(checkboxId);

    return (
      <React.Fragment key={rowIndex}>
        <tr data-testid="table-row" key={rowIndex}>
          {allowRowsSelect && (
            <td className="table-border-light content-text positionSticky align-content-center checkbox-column">
              <input
                id={getValue(rowIndex, idColumnName)}
                type="checkbox"
                className="checkbox-color"
                aria-label="Select Row"
                onChange={(event) => {
                  handleSelectTableRow(
                    event.target.checked,
                    checkboxId,
                    rowIndex,
                  );
                }}
                checked={rowChecked || false}
              />
            </td>
          )}
          {columns &&
            columns.map((column, columnIndex) => {
              return renderTableCell(column, rowIndex, columnIndex);
            })}
        </tr>
      </React.Fragment>
    );
  };

  return (
    <tbody className={styles.tbodyBaseStyles}>
      {data?.length === 0
        ? renderNoResultsFound()
        : data?.map((item: any, index: number) => renderTableRow(index))}
    </tbody>
  );
};

export default TableBody;
