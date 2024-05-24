export enum ColumnType {
    Link,
    Text,
    TextBox,
    DropDown,
    Checkbox,
    Calender
  }

export enum ColumnSize{
  Default,
  Double,
  Triple
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
      public isChecked?: boolean = false,
      public displayType: ColumnType = ColumnType.Text,   
      public linkRedirectionURL: string = '',
      public dynamicColumn: boolean = false,
      public columnSize: ColumnSize = ColumnSize.Default,
    ) {}
  }
  