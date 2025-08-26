import React from "react";
import { useState } from "react";
import ApplicationTimeline from "./ApplicationTimeline";
import { useSelector } from "react-redux";
import { getUserRolePermission } from "../../helper/user";
import { getClientApplicationStatus } from "../../helper/helper";
import { CLIENT } from "../../constants/constants";

function RequestStatus({ requests }) {
  const [requestItems, setRequestItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const showClientStatus = (applicationStatus) => {
    const userRoles = useSelector((state) => state.user.roles);
    if (getUserRolePermission(userRoles, CLIENT)) {
      return getClientApplicationStatus(applicationStatus);
    } else {
      return applicationStatus;
    }
  };

  const handleRowExpansion = (items, index) => {
    setSelectedRow(index === selectedRow ? null : index);
    setRequestItems(items);
  };
  const timeLine = () => {
    return (
      <tr className="table-header">
        <td
          colSpan={6}
          style={{
            padding: "35px",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div style={{ display: "flex" }}>
            <ApplicationTimeline applicationHistory={requestItems} />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <table className="table bt-0" style={{ width: "80%" }}>
      <thead>
        <tr className="table-header">
          <th scope="col" style={{ paddingRight: "500px" }}>
            Request Name
          </th>
          <th scope="col" style={{ textAlign: "inherit" }}>
            Status
          </th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {requests?.map((e, index) => {
          return (
            <>
              <tr key={index}>
                <td>{e?.requestType}</td>
                <td>
                  <span className="btn status-button" disabled>
                    {showClientStatus(
                      e.items[e.items.length - 1].requestStatus
                    )}
                  </span>
                </td>
                <td>
                  <i
                    className={`fa fa-chevron-${
                      selectedRow === index ? "up" : "down"
                    }`}
                    onClick={() => handleRowExpansion(e?.items, index)}
                  ></i>
                </td>
              </tr>
              {selectedRow === index && <>{timeLine()}</>}
            </>
          );
        })}
      </tbody>
    </table>
  );
}

export default RequestStatus;
