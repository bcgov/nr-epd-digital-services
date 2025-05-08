import { ReactNode } from 'react';
import { IFormField } from '../input-controls/IFormField';

// export enum ColumnType {
//     Link,
//     Text,
//     TextBox,
//     DropDown,
//     Checkbox,
//     Calender
//   }

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
    public stickyCol?: boolean,
    public customHeaderCss?: string,
    public renderCell?: (value: any, rowData: any) => ReactNode,
  ) {
    this.dynamicColumn = dynamicColumn ?? false;
  }
}
