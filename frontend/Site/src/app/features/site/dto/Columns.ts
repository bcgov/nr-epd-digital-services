export enum ColumnType {
  Link,
  Text
}

export class TableColumns {
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

const getSiteSearchResultsColumns = () => {
  const columns: TableColumns[] = [
    new TableColumns(
      1,
      "Site ID",
      true,
      "id",
      1,
      true,
      true,
      1,
      true,
      ColumnType.Link
    ),
    new TableColumns(
      6,
      "Site Address",
      true,
      "addrLine_1,addrLine_2,addrLine_3",
      2,
      true,
      true,
      1,
      true,
      ColumnType.Text
    ),
    new TableColumns(
      7,
      "City",
      true,
      "city",
      2,
      false,
      true,
      1,
      true,
      ColumnType.Text
    ),
    new TableColumns(
      2,
      "Site Remediation Status",
      true,
      "srStatus",
      1,
      false,
      true,
      1,
      false,
      ColumnType.Text
    ),
    new TableColumns(
      3,
      "Site Risk code",
      true,
      "siteRiskCode",
      1,
      false,
      true,
      1,
      false,
      ColumnType.Text
    ),
    new TableColumns(
      4,
      "General Description",
      true,
      "generalDescription",
      1,
      false,
      true,
      1,
      false,
      ColumnType.Text
    ),
    new TableColumns(
      5,
      "Common Name",
      true,
      "commonName",
      2,
      false,
      true,
      1,
      false,
      ColumnType.Text
    ),
    new TableColumns(
      8,
      "Latitude",
      true,
      "latdeg",
      2,
      false,
      true,
      1,
      false,
      ColumnType.Text
    ),
    new TableColumns(
      9,
      "Latitude(D,M,S)",
      true,
      "latDegrees,latMinutes,latSeconds",
      3,
      false,
      true,
      1,
      false,
      ColumnType.Text
    ),
    new TableColumns(
      10,
      "Longitude",
      true,
      "longdeg",
      3,
      false,
      true,
      1,
      false,
      ColumnType.Text
    ),
    new TableColumns(
      11,
      "Longitude(D,M,S)",
      true,
      "longDegrees,longMinutes,longSeconds",
      3,
      false,
      true,
      1,
      false,
      ColumnType.Text
    ),
    new TableColumns(
      12,
      "Lat/Long Reliability",
      true,
      "latlongReliabilityFlag",
      3,
      false,
      true,
      1,
      false,
      ColumnType.Text
    ),
    new TableColumns(
      13,
      "Created By",
      true,
      "whoCreated",
      4,
      false,
      true,
      1,
      false,
      ColumnType.Text
    ),
    new TableColumns(
      14,
      "Date Created",
      true,
      "whenCreated",
      4,
      false,
      true,
      1,
      false,
      ColumnType.Text
    ),
    new TableColumns(
      15,
      "Last Updated",
      true,
      "whenCreated",
      4,
      false,
      true,
      1,
      false,
      ColumnType.Text
    ),
    new TableColumns(
      16,
      "Consultant Submitted",
      true,
      "consultantSubmitted",
      4,
      false,
      true,
      1,
      false,
      ColumnType.Text
    ),
  ];

  return columns;
};

export { getSiteSearchResultsColumns };

export default TableColumns;
