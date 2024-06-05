import { FormFieldType } from "../../../components/input-controls/IFormField";
import { TableColumn , ColumnSize } from "../../../components/table/TableColumn";

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
      getColumnType("Site ID","id","")    
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
      getColumnType("Site Address","addrLine_1,addrLine_2,addrLine_3","")  ,
      "site/details/",
      false,
      ColumnSize.Triple
      ,
      
      
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
      getColumnType("City","city","")  
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
      getColumnType("Site Remediation Status","srStatus","")  
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
      getColumnType("Site Risk code","siteRiskCode","")  
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
      getColumnType("General Description","generalDescription","")  
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
      getColumnType("Common Name","commonName","")  
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
      getColumnType("Latitude","latdeg","")  
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
      getColumnType("Latitude(D,M,S)","latDegrees,latMinutes,latSeconds","")  
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
      getColumnType("Longitude","longdeg","")  
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
      getColumnType("Longitude(D,M,S)","longDegrees,longMinutes,longSeconds","") 
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
      getColumnType("Lat/Long Reliability","latlongReliabilityFlag","") 
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
      getColumnType("Created By","whoCreated","") 
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
      getColumnType("Date Created","whenCreated","") 
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
      getColumnType("Last Updated","whenCreated","") 
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
      getColumnType("Consultant Submitted","consultantSubmitted","") 
    ),
    new TableColumn(
      17,
      "View",
      true,
      "id",
      4,
      true,
      true,
      1,
      true,
      getLinkColumnType("Map","id","","site/map/") ,
      "site/map/",
      true
    ),
    new TableColumn(
      18,
      "Details",
      true,
      "id",
      4,
      true,
      true,
      1,
      true,
      getLinkColumnType("Details","id","","site/details/"),
      "site/details/",
    
      true,      
    ),
  ];

  return columns;
};


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
      customLabelCss: "link-for-table",
      customInputTextCss: "link-for-table",
      tableMode: true,
      href: href
    }
  }

export { getSiteSearchResultsColumns };

export const B: any =1 ;


