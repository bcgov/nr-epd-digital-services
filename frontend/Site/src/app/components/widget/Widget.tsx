import React from 'react';
import { IWidget } from './IWidget';
import Table from '../table/Table';
import './Widget.css';

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
    changeHandler
}) => {
    return(
        <div className={`d-flex flex-column widget-container`}>
        {!hideTitle && title && <h4 className={`${customLabelCss ?? `widget-lbl`}`}>{title}</h4>}
        {children && 
          <div>
            {children}
          </div>
        }
        { !hideTable && 
          <div>
            <Table
              label={title ?? ""}
              isLoading={tableIsLoading}
              columns={tableColumns}
              data={tableData}
              showPageOptions={false}
              allowRowsSelect={allowRowsSelect}
              changeHandler={changeHandler}
              editMode={editMode ?? false}
            />
          </div>
        }
      </div>
    );
}

export default Widget;