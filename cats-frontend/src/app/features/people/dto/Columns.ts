import { FormFieldType } from "../../../components/input-controls/IFormField";
import { TableColumn, ColumnSize } from "../../../components/table/TableColumn";

const getPeopleSearchResultsColumns = () => {
  const columns: TableColumn[] = [
    {
      id: 1,
      displayName: "First Name",
      active: true,
      graphQLPropertyName: "id",
      groupId: 1,
      disabled: true,
      isDefault: true,
      sortOrder: 1,
      isChecked: true,
      displayType: getColumnType("First Name", "id", ""),
      stickyCol: true,
    },
    new TableColumn(
      6,
      "Last Name",
      true,
      "addrLine_1,addrLine_2,addrLine_3",
      2,
      true,
      true,
      1,
      true,
      getColumnType("Last Name", "addrLine_1,addrLine_2,addrLine_3", ""),
      "people/details/",
      false,
      ColumnSize.Triple
    ),
    new TableColumn(
      7,
      "Address",
      true,
      "city",
      2,
      false,
      true,
      1,
      true,
      getColumnType("Address", "city", "")
    ),
    new TableColumn(
      2,
      "Email",
      true,
      "srStatus",
      1,
      false,
      true,
      1,
      true,
      getColumnType("Email", "srStatus", "")
    ),
    new TableColumn(
      3,
      "Active",
      true,
      "peopleRiskCode",
      1,
      false,
      true,
      1,
      true,
      getColumnType("Active", "peopleRiskCode", "")
    ),
    new TableColumn(
      4,
      "Tax Exempt",
      true,
      "generalDescription",
      1,
      false,
      true,
      1,
      true,
      getColumnType("Tax Exempt", "generalDescription", "")
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
      getColumnType("Common Name", "commonName", "")
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
      getColumnType("Latitude", "latdeg", "")
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
      getColumnType("Latitude(D,M,S)", "latDegrees,latMinutes,latSeconds", "")
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
      getColumnType("Longitude", "longdeg", "")
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
      getColumnType(
        "Longitude(D,M,S)",
        "longDegrees,longMinutes,longSeconds",
        ""
      )
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
      getColumnType("Lat/Long Reliability", "latlongReliabilityFlag", "")
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
      getColumnType("Created By", "whoCreated", "")
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
      getColumnType("Date Created", "whenCreated", "")
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
      getColumnType("Last Updated", "whenCreated", "")
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
      getColumnType("Consultant Submitted", "consultantSubmitted", "")
    ),
    // new TableColumn(
    //   17,
    //   "View",
    //   true,
    //   "id",
    //   4,
    //   true,
    //   true,
    //   1,
    //   true,
    //   getLinkColumnType("Map","id","","people/map/") ,
    //   "people/map/",
    //   true
    // ),

    {
      id: 18,
      displayName: "Actions",
      active: true,
      graphQLPropertyName: "id",
      groupId: 4,
      disabled: true,
      isDefault: true,
      sortOrder: 1,
      isChecked: true,
      displayType: getLinkColumnType(
        "Details",
        "id",
        "",
        "/people/details/",
        "Details",
        'Manage People'
      ),
      linkRedirectionURL: "people/details/",
      dynamicColumn: true,
      stickyCol: true,
    },
  ];

  return columns;
};

const getColumnTypeWithSticky = (
  label: string,
  propertyName: string,
  value: string
) => {
  return {
    type: FormFieldType.Label,
    label: label,
    graphQLPropertyName: propertyName,
    value: value,
    customLabelCss: "custom-lbl-text",
    customInputTextCss: "custom-input-text",
    tableMode: true,
    stickyCol: true,
  };
};

const getColumnType = (label: string, propertyName: string, value: string) => {
  return {
    type: FormFieldType.Label,
    label: label,
    graphQLPropertyName: propertyName,
    value: value,
    customLabelCss: "custom-lbl-text",
    customInputTextCss: "custom-input-text",
    tableMode: true,
    stickyCol: false,
  };
};

const getLinkColumnType = (
  label: string,
  propertyName: string,
  value: string,
  href: string,
  customLabel?: string,
  componentName?: string
) => {
  return {
    type: FormFieldType.Link,
    label: label,
    graphQLPropertyName: propertyName,
    value: value,
    customLabelCss: "link-for-table",
    customInputTextCss: "link-for-table",
    tableMode: true,
    stickyCol: true,
    href: href,
    customLinkValue: customLabel ?? null,
    componentName: componentName
  };
};

export { getPeopleSearchResultsColumns };

export const B: any = 1;
