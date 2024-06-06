import React, { FC } from "react";
import { SpinnerIcon } from "../../common/icon";
import { RequestStatus } from "../../../helpers/requests/status";
import { TableColumn } from "../TableColumn";

import { FormFieldType, IFormField } from "../../input-controls/IFormField";
import { Label, TextInput , Link ,Dropdown,CheckBoxInput } from "../../input-controls/InputControls";
import { ChangeTracker } from "../../common/IChangeType";

interface TableBodyProps {
  isLoading: RequestStatus;
  columns: TableColumn[];
  data: any;
  allowRowsSelect: boolean;
  changeHandler: (
    data:any
  ) => void;
  editMode: boolean;
}

const TableBody: FC<TableBodyProps> = ({
  isLoading,
  columns,
  data,
  allowRowsSelect,
  changeHandler,
  editMode,
}) => {
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

  const tableRecordChangeHandler= (rowKey:number,propertyName:any,value:any)=>
    {
        const changeRecord = {
          "row": getDataRow(rowKey),
          "property":propertyName,
          "value":value
        }

        changeHandler(changeRecord);
    }

  const getTableCellHtml = (
    field: any,
    displayName: string,
    value: string,
    rowKey: number,
    href: string,
    changeHandler: any,
    editMode: boolean
  ) => {
    if (field.type === FormFieldType.Text) {
      return (
        <TextInput
          label={field.label}
          customLabelCss={field.customLabelCss}
          customInputTextCss={field.customInputTextCss}
          customEditLabelCss={field.customEditLabelCss}
          customEditInputTextCss={field.customEditInputTextCss}
          placeholder={field.placeholder}
          value={value}
          onChange={(value) => tableRecordChangeHandler(rowKey,field.graphQLPropertyName, value)}
          type={field.type}
          validation={field.validation}
          allowNumbersOnly={field.allowNumbersOnly}
          isEditing={editMode ?? true}
          tableMode={field.tableMode ?? false}
        />
      );
    }
    else if(field.type === FormFieldType.Label)
      {
        return (
          <Label
            label={field.label}
            customLabelCss={field.customLabelCss}
            customInputTextCss={field.customInputTextCss}
            customEditLabelCss={field.customEditLabelCss}
            customEditInputTextCss={field.customEditInputTextCss}
            placeholder={field.placeholder}
            value={value}
            onChange={(value) => tableRecordChangeHandler(rowKey,field.graphQLPropertyName, value)}
            type={field.type}
            validation={field.validation}
            allowNumbersOnly={field.allowNumbersOnly}
            isEditing={editMode ?? true}
            tableMode={field.tableMode ?? false}
          />
        );
      }
      else if(field.type === FormFieldType.Link)
        {
          return (
            <Link 
              label={field.label}
              customLabelCss={field.customLabelCss}
              customInputTextCss={field.customInputTextCss}
              customEditLabelCss={field.customEditLabelCss}
              customEditInputTextCss={field.customEditInputTextCss}
              placeholder={field.placeholder}
              value={value}
              onChange={(value) => tableRecordChangeHandler(rowKey,field.graphQLPropertyName, value)}
              type={field.type}
              validation={field.validation}
              allowNumbersOnly={field.allowNumbersOnly}
              isEditing={editMode ?? true}
              tableMode={field.tableMode ?? false}
              href={field.href}
            />
          );
        }
        else if(field.type === FormFieldType.DropDown)
          {
            return (
              <Dropdown 
                label={field.label}
                customLabelCss={field.customLabelCss}
                customInputTextCss={field.customInputTextCss}
                customEditLabelCss={field.customEditLabelCss}
                customEditInputTextCss={field.customEditInputTextCss}
                placeholder={field.placeholder}
                value={value}
                onChange={(value) => tableRecordChangeHandler(rowKey,field.graphQLPropertyName, value)}
                type={field.type}
                validation={field.validation}
                allowNumbersOnly={field.allowNumbersOnly}
                isEditing={editMode ?? true}
                tableMode={field.tableMode ?? false}
                href={field.href}
                options={field.options}
              />
            );
          }
          else if(field.type === FormFieldType.Checkbox)
            {
              return (
                <CheckBoxInput 
                  label={field.label}
                  customLabelCss={field.customLabelCss}
                  customInputTextCss={field.customInputTextCss}
                  customEditLabelCss={field.customEditLabelCss}
                  customEditInputTextCss={field.customEditInputTextCss}
                  placeholder={field.placeholder}
                  value={value}
                  onChange={(value) => tableRecordChangeHandler(rowKey,field.graphQLPropertyName, value)}
                  type={field.type}
                  validation={field.validation}
                  allowNumbersOnly={field.allowNumbersOnly}
                  isEditing={editMode ?? true}
                  tableMode={field.tableMode ?? false}
                  href={field.href}
                  options={field.options}
                />
              );
            }
  };

  const getValue = (rowIndex: number, propertyName: string) => {
    return data[rowIndex][propertyName];
  };

  const getDataRow = (rowIndex: number) => {
    return data[rowIndex];
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

    const cellValue =
      column.graphQLPropertyName &&
      column.graphQLPropertyName
        .split(",")
        .map((graphQLPropertyName) => getValue(rowIndex, graphQLPropertyName))
        .join(" ");

    return getTableCellHtml(
      column.displayType,
      column.displayName,
      cellValue ?? "",
      rowIndex,
      column.linkRedirectionURL ?? "",
      changeHandler,
      editMode
    );
  };

  const renderTableRow = (rowIndex: number) => {
    return (
      <React.Fragment key={rowIndex}>
        <tr>
          {allowRowsSelect && (
            <td className="table-border-light content-text">
              <input
                type="checkbox"
                className="checkbox-color"
                aria-label="Select Row"
              />
            </td>
          )}
          {columns &&
            columns.map((column, columnIndex) => {
              return renderTableCell(column, rowIndex, columnIndex);
            })}
          {/* <td className="table-border-light content-text">               
                <a href={"/map?id=" + getValue(rowIndex, idColumnGQLPropName)}>View</a>
              </td>
              <td className="table-border-light content-text">
              <a href={"/details?id=" + getValue(rowIndex, idColumnGQLPropName)}>Details</a>
              </td> */}
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
  );
};

export default TableBody;
