import React from 'react';
import { IWidget } from './IWidget';
import Table from '../table/Table';
import './Widget.css';
import { CheckBoxInput } from '../input-controls/InputControls';
import { FormFieldType } from '../input-controls/IFormField';
import { RequestStatus } from '../../helpers/requests/status';

const Widget: React.FC<IWidget> = ({
  title,
  tableColumns,
  tableIsLoading,
  tableData,
  children,
  customLabelCss,
  allowRowsSelect,
  hideTable,
  hideTitle,
  editMode,
  srMode,
  primaryKeycolumnName,
  currentPage,
  changeHandler,
  handleCheckBoxChange,
  sortHandler,
  showPageOptions,
  isRequired,
  widgetIschecked,
  hideWidgetCheckbox,
  customWidgetCss,
}) => {
  let widgetSortHandler = sortHandler ?? (() => {});

  return (
    <div
      className={`d-flex flex-column widget-container ${customWidgetCss ?? ''}`}
    >
      {!hideTitle && title && (
        <div className="d-flex align-items-center">
          {srMode && !hideWidgetCheckbox && (
            <CheckBoxInput
              type={FormFieldType.Checkbox}
              label={''}
              isLabel={false}
              onChange={handleCheckBoxChange ?? (() => {})}
              srMode={srMode}
              isChecked={widgetIschecked}
            />
          )}
          <div className="w-100 me-1">
            <h4
              className={`${customLabelCss ?? `widget-lbl`} ${isRequired ? 'widget-required-field' : ''}`}
            >
              {title}
            </h4>
          </div>
        </div>
      )}
      {children && <div>{children}</div>}
      {!hideTable && (
        <div className="me-1">
          <Table
            label={title ?? ''}
            isLoading={tableIsLoading ?? RequestStatus.idle}
            columns={tableColumns ?? []}
            data={tableData ?? []}
            showPageOptions={showPageOptions}
            allowRowsSelect={allowRowsSelect}
            changeHandler={changeHandler ?? (() => {})}
            editMode={editMode ?? false}
            srMode={srMode ?? false}
            idColumnName={primaryKeycolumnName ?? ''}
            sortHandler={widgetSortHandler}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
};

export default Widget;
