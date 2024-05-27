import { ColumnSize, ColumnType, TableColumn } from "../../components/table/TableColumn";

export const recentViewedColumns: TableColumn[] = [
  {
    id: 1,
    displayName: "Site ID",
    active: true,
    graphQLPropertyName: "siteId",
    displayType: ColumnType.Link,
  },
  {
    id: 2,
    displayName: "Site Address",
    active: true,
    graphQLPropertyName: "address",
    displayType: ColumnType.Text,
  },
  {
    id: 3,
    displayName: "City",
    active: true,
    graphQLPropertyName: "city",
    displayType: ColumnType.Text,
  },
  {
    id: 4,
    displayName: "General Description",
    active: true,
    graphQLPropertyName: "generalDescription",
    displayType: ColumnType.Text,
    columnSize: ColumnSize.Triple
  },
  {
    id: 5,
    displayName: "Last Updates",
    active: true,
    graphQLPropertyName: "whenUpdated",
    displayType: ColumnType.Text,
  },
  {
    id: 6,
    displayName: "Map",
    active: true,
    graphQLPropertyName: "siteId",
    displayType: ColumnType.Link,
    linkRedirectionURL: 'site/map/',
  },
  {
    id: 7,
    displayName: "Details",
    active: true,
    graphQLPropertyName: "siteId",
    displayType: ColumnType.Link,
    linkRedirectionURL: 'site/details/',
  },
 
];

export const recentFoliosColumns: TableColumn[] = [
  {
    id: 1,
    displayName: "Folio ID",
    active: true,
    graphQLPropertyName: "siteId",
    displayType: ColumnType.Link,
  },
  {
    id: 2,
    displayName: "Description",
    active: true,
    graphQLPropertyName: "address",
    displayType: ColumnType.Text,
    columnSize: ColumnSize.Triple
  },
  {
    id: 3,
    displayName: "Last Modified",
    active: true,
    graphQLPropertyName: "city",
    displayType: ColumnType.Text,
  },
  {
    id: 4,
    displayName: "Details",
    active: true,
    graphQLPropertyName: "siteId",
    displayType: ColumnType.Link,
    linkRedirectionURL: 'site/details/',
  },
];

export const recentAssignedColumn: TableColumn[] = [
  {
    id: 1,
    displayName: "Site ID",
    active: true,
    graphQLPropertyName: "siteId",
    displayType: ColumnType.Link,
  },
  {
    id: 2,
    displayName: "Site Address",
    active: true,
    graphQLPropertyName: "address",
    displayType: ColumnType.Text,
  },
  {
    id: 3,
    displayName: "City",
    active: true,
    graphQLPropertyName: "city",
    displayType: ColumnType.Text,
  },
  {
    id: 4,
    displayName: "General Description",
    active: true,
    graphQLPropertyName: "generalDescription",
    displayType: ColumnType.Text,
    columnSize: ColumnSize.Triple
  },
  {
    id: 5,
    displayName: "Last Updates",
    active: true,
    graphQLPropertyName: "whenUpdated",
    displayType: ColumnType.Text,
  },
  {
    id: 6,
    displayName: "Map",
    active: true,
    graphQLPropertyName: "siteId",
    displayType: ColumnType.Link,
    linkRedirectionURL: 'site/map/',
  },
  {
    id: 7,
    displayName: "Details",
    active: true,
    graphQLPropertyName: "siteId",
    displayType: ColumnType.Link,
    linkRedirectionURL: 'site/details/',
  },
];
