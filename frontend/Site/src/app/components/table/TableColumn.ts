export enum ColumnType {
    Link,
    Text
  }
  
  export class TableColumn {
    constructor(
      public id: number,
      public displayName: string,
      public active: boolean,
      public graphQLPropertyName: string,
      public groupId: number,
      public disabled: boolean,
      public isDefault: boolean,
      public sortOrder: number,
      public isChecked: boolean = false,
      public displayType: ColumnType = ColumnType.Text,    
    ) {}
  }
  