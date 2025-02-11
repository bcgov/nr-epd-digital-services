import React, { useState } from "react";
import { TableColumn } from "../../components/table/TableColumn";

// This is all very temporary code to bootstrap the application frontend.

type ApplicationData = {
  id: string;
  site_id: string;
  site_address: string;
  application_type: string;
  last_updated: string;
  status: string;
  priority: string;
  link: string;
};

const stubbedData: ApplicationData[] = [
  {
    id: "1",
    site_id: "101",
    site_address: "123 Main St",
    application_type: "Type A",
    last_updated: "2023-01-01",
    status: "Pending",
    priority: "High",
    link: "/applications/1",
  },
  {
    id: "2",
    site_id: "102",
    site_address: "456 Elm St",
    application_type: "Type B",
    last_updated: "2023-02-01",
    status: "Approved",
    priority: "Medium",
    link: "/applications/2",
  },
  {
    id: "3",
    site_id: "103",
    site_address: "789 Oak St",
    application_type: "Type C",
    last_updated: "2023-03-01",
    status: "Rejected",
    priority: "Low",
    link: "/applications/3",
  },
];

const columns: TableColumn[] = [
  {
    id: 0,
    displayName: "ID",
    active: true,
    graphQLPropertyName: "id",
  },
  {
    id: 1,
    displayName: "Site ID",
    active: true,
    graphQLPropertyName: "site_id",
  },
  {
    id: 2,
    displayName: "Site Address",
    active: true,
    graphQLPropertyName: "site_address",
  },
  {
    id: 3,
    displayName: "Application Type",
    active: true,
    graphQLPropertyName: "application_type",
  },
  {
    id: 4,
    displayName: "Last Updated",
    active: true,
    graphQLPropertyName: "last_updated",
  },
  {
    id: 5,
    displayName: "Status",
    active: true,
    graphQLPropertyName: "status",
  },
  {
    id: 6,
    displayName: "Priority",
    active: true,
    graphQLPropertyName: "priority",
  },
  {
    id: 7,
    displayName: "Link",
    active: true,
    graphQLPropertyName: "link",
  },
];

const ApplicationSearch: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(stubbedData);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = stubbedData.filter((item) =>
      item.site_address.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div>
      <h1>Application Search</h1>
      <input
        aria-label="Search Applications"
        placeholder="Search Applications"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        type="text"
      />

      <table>
        <thead>
          {columns.map((column) => (
            <th key={column.id}>{column.displayName}</th>
          ))}
        </thead>
        <tbody>
          {filteredData.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.id}>
                  {column.graphQLPropertyName === "link" ? (
                    <a href={row.link}>View</a>
                  ) : (
                    row[column.graphQLPropertyName as keyof ApplicationData]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationSearch;
