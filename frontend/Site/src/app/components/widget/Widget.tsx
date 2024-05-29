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
    allowRowsSelect
}) => {
    return(
        <div className={`d-flex flex-column widget-container`}>
        {title && <h4 className={`${customLabelCss ?? `widget-lbl`}`}>{title}</h4>}
        <div>
          {children}
        </div>
        <div>
          <Table
            label={title ?? ""}
            isLoading={tableIsLoading}
            columns={tableColumns}
            data={tableData}
            showPageOptions={false}
            allowRowsSelect={allowRowsSelect}
          />
        </div>
      </div>
    );
}

export default Widget;