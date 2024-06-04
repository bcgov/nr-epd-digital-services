import { FormFieldType } from "../../components/input-controls/IFormField";
import { ColumnSize,  TableColumn } from "../../components/table/TableColumn";



const getColumnType = (label:string, propertyName:string, value:string) =>
  {
    return   {
      type: FormFieldType.Label,
      label: label,       
      graphQLPropertyName: propertyName,
      value:value,      
      customLabelCss: "custom-lbl-text",
      customInputTextCss: "custom-input-text",
      tableMode: true,
    }
  }
  
  const getLinkColumnType = (label:string, propertyName:string, value:string, href:string) =>
    {
      return   {
        type: FormFieldType.Link,
        label: label,       
        graphQLPropertyName: propertyName,
        value:value,      
        customLabelCss: "custom-lbl-text",
        customInputTextCss: "custom-input-text",
        tableMode: true,
        href: href
      }
    }
  


export const recentViewedColumns: TableColumn[] = [
  {
    id: 1,
    displayName: "Site ID",
    active: true,
    graphQLPropertyName: "siteId",
    displayType: getColumnType("Site ID","siteId","")
  },
  {
    id: 2,
    displayName: "Site Address",
    active: true,
    graphQLPropertyName: "address",
    displayType: getColumnType("Site ID","siteId",""),
  },
  {
    id: 3,
    displayName: "City",
    active: true,
    graphQLPropertyName: "city",
    displayType: getColumnType("City","city",""),
  },
  {
    id: 4,
    displayName: "General Description",
    active: true,
    graphQLPropertyName: "generalDescription",
    displayType: getColumnType("General Description","generalDescription",""),
    columnSize: ColumnSize.Triple
  },
  {
    id: 5,
    displayName: "Last Updates",
    active: true,
    graphQLPropertyName: "whenUpdated",
    displayType: getColumnType("Last Updates","whenUpdated",""),
  },
  {
    id: 6,
    displayName: "Map",
    active: true,
    graphQLPropertyName: "siteId",
    displayType: getLinkColumnType("Map","siteId","",'site/map/'),
    linkRedirectionURL: 'site/map/',
  },
  {
    id: 7,
    displayName: "Details",
    active: true,
    graphQLPropertyName: "siteId",
    displayType: getLinkColumnType("Details","siteId","",'site/map/'),
    linkRedirectionURL: 'site/details/',
  },
 
];

export const recentFoliosColumns: TableColumn[] = [
  {
    id: 1,
    displayName: "Folio ID",
    active: true,
    graphQLPropertyName: "siteId",
    displayType: getColumnType("Folio ID","siteId",""),
  },
  {
    id: 2,
    displayName: "Description",
    active: true,
    graphQLPropertyName: "address",
    displayType: getColumnType("Description","address",""),
    columnSize: ColumnSize.Triple
  },
  {
    id: 3,
    displayName: "Last Modified",
    active: true,
    graphQLPropertyName: "city",
    displayType: getColumnType("Last Modified","city",""),
  },
  {
    id: 4,
    displayName: "Details",
    active: true,
    graphQLPropertyName: "siteId",
    displayType: getLinkColumnType("Details","siteId","","site/details/"),
    linkRedirectionURL: 'site/details/',
  },
];

export const recentAssignedColumn: TableColumn[] = [
  {
    id: 1,
    displayName: "Site ID",
    active: true,
    graphQLPropertyName: "siteId",
    displayType: getColumnType("Site ID","siteId",""),
  },
  {
    id: 2,
    displayName: "Site Address",
    active: true,
    graphQLPropertyName: "address",
    displayType: getColumnType("Site Address","address",""),
  },
  {
    id: 3,
    displayName: "City",
    active: true,
    graphQLPropertyName: "city",
    displayType: getColumnType("City","city",""),
  },
  {
    id: 4,
    displayName: "General Description",
    active: true,
    graphQLPropertyName: "generalDescription",
    displayType: getColumnType("General Description","generalDescription",""),
    columnSize: ColumnSize.Triple
  },
  {
    id: 5,
    displayName: "Last Updates",
    active: true,
    graphQLPropertyName: "whenUpdated",
    displayType: getColumnType("Last Updates","whenUpdated",""),
  },
  {
    id: 6,
    displayName: "Map",
    active: true,
    graphQLPropertyName: "siteId",
    displayType: getLinkColumnType("Map","whenUpdated","",'site/map/'),
    linkRedirectionURL: 'site/map/',
  },
  {
    id: 7,
    displayName: "Details",
    active: true,
    graphQLPropertyName: "siteId",
    displayType: getLinkColumnType("Details","whenUpdated","",'site/details/'),
    linkRedirectionURL: 'site/details/',
  },
];
