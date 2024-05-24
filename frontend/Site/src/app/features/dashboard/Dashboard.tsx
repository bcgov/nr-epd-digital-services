import React from 'react'
import { ColumnType, TableColumn } from '../../components/table/TableColumn';
import Table
 from '../../components/table/Table';
import { RequestStatus } from '../../helpers/requests/status';
const Dashboard = () => {

  const loading = RequestStatus.success;

  const data = [
    { id: 1, siteId: "001", siteAddress: "123 Main St", city: "New York", generalDescription: "Lorem ipsum", lastUpdated: "2024-05-01", map: "", details: "" },
    { id: 2, siteId: "002", siteAddress: "456 Oak Ave", city: "Los Angeles", generalDescription: "Dolor sit amet", lastUpdated: "2024-05-02", map: "", details: "" },   
  ];

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
    )]
  return (
   <div>
    <Table label='Recent Views' isLoading={loading} columns={columns} data={data} showPageOptions={false} idColumnGQLPropName="id" allowRowsSelect={false}  />
   </div>
  
  )
}

export default Dashboard