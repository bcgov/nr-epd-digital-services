import { ReactNode } from 'react';
import { IFormField } from '../input-controls/IFormField';

export enum ColumnSize {
  Default,
  Small,
  XtraSmall,
  Double,
  Triple,
}

export class TableColumn {
  constructor(
    public id: number,
    public displayName: string,
    public active: boolean,
    public graphQLPropertyName: string,
    public groupId?: number,
    public disabled?: boolean,
    public isDefault?: boolean,
    public sortOrder?: number,
    public isChecked?: boolean,
    public displayType?: IFormField,
    public linkRedirectionURL?: string,
    public dynamicColumn?: boolean,
    public columnSize?: ColumnSize,
    public customHeaderCss?: string,
    public renderCell?: (value: any, rowData: any) => ReactNode,
    public selectionOrder?: number,
  ) {
    this.dynamicColumn = dynamicColumn ?? false;
  }
}
