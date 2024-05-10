import { TableColumn , ColumnType } from "../../../components/table/TableColumn";

const getSiteSearchResultsColumns = () => {
  const columns: TableColumn[] = [
    new TableColumn(
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
    new TableColumn(
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
    new TableColumn(
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
    new TableColumn(
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
    new TableColumn(
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
    new TableColumn(
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
    new TableColumn(
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
    new TableColumn(
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
    new TableColumn(
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
    new TableColumn(
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
    new TableColumn(
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
    new TableColumn(
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
    new TableColumn(
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
    new TableColumn(
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
    new TableColumn(
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
    new TableColumn(
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


