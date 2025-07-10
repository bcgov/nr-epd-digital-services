import React from 'react';
import { IWidget } from './IWidget';
import Table from '../table/Table';
import { CheckBoxInput } from '../input-controls/InputControls';
import { FormFieldType } from '../input-controls/IFormField';
import { RequestStatus } from '../../helpers/requests/status';

import styles from './Widget.module.css';

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
  changeResultsPerPage,
  resultsPerPage,
  selectPage,
  totalResults,
  filter,
  widgetLabelContainerCss,
}) => {
  let widgetSortHandler = sortHandler ?? (() => {});

  return (
    <div
      className={`d-flex flex-column ${styles.widgetContainer} ${customWidgetCss ?? ''}`}
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
          <div
            className={`${widgetLabelContainerCss || styles.widgetLblContainer} w-100 me-1 d-flex flex-wrap align-items-center justify-content-between`}
          >
            <h4
              className={`${customLabelCss ?? styles.widgetLabel} ${isRequired ? styles.widgetRequiredField : ''}`}
            >
              {title}
            </h4>
            {filter}
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
            selectPage={selectPage}
            changeResultsPerPage={changeResultsPerPage}
            resultsPerPage={resultsPerPage}
            totalResults={totalResults}
          />
        </div>
      )}
    </div>
  );
};

export default Widget;
