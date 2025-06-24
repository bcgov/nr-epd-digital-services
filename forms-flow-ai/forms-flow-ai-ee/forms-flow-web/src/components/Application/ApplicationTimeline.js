import React from "react";
import { Typography } from "@material-ui/core";
import { MULTITENANCY_ENABLED } from "../../constants/constants";
import { useSelector } from "react-redux";
import {
  getLocalDate,
  getLocalTime,
} from "../../apiManager/services/formatterService";
import { getUserRolePermission } from "../../helper/user";
import { getClientApplicationStatus } from "../../helper/helper";
import { CLIENT } from "../../constants/constants";

function ApplicationTimeline({ applicationHistory }) {
  const tenantKey = useSelector((state) => state.tenants?.tenantId);
  const formName = useSelector((state) => state.form.form.title);
  const userRoles = useSelector((state) => state.user.roles);
  const redirectUrl = MULTITENANCY_ENABLED ? `/tenant/${tenantKey}/` : "/";
  const history = [...applicationHistory].reverse();

  const showClientStatus = (e) => {
    const status = e.applicationStatus || e.requestStatus;
    if (getUserRolePermission(userRoles, CLIENT)) {
      return getClientApplicationStatus(status);
    } else {
      return status;
    }
  };

  return (
    <>
      <div className="circle-icon-container ml-3">
        {history.map((e, index) => (
          <>
            <div className="circle-icon"></div>
            {index !== history.length - 1 && <div className="line"></div>}
          </>
        ))}
      </div>
      <div className="d-flex flex-column">
        {history.map((e, index) => {
          return (
            <div
              key={index}
              className="ml-5 d-flex align-items-center"
              style={{
                display: "flex",
                gap: "65px",
                marginTop: index !== 0 ? "25px" : "0",
              }}
            >
              <div style={{ width: "120px" }}>
                <Typography className="m-0">
                  <span style={{ fontWeight: "bold" }}>
                    {getLocalDate(e.created)}
                  </span>
                  <br />
                  <span>{getLocalTime(e.created)}</span>
                </Typography>
              </div>
              <div style={{ flex: 1, paddingBottom: "20px" }}>
                <Typography className="m-0">
                  <span style={{ fontWeight: "bold" }}>
                    {showClientStatus(e)}
                  </span>
                  <span style={{ marginLeft: "6px" }}>{formName}</span>
                  <span style={{ marginLeft: "6px" }}>by</span>
                  <span style={{ fontWeight: "bold", marginLeft: "6px" }}>
                    {e.submittedBy}
                  </span>
                </Typography>
              </div>
              <div
                className="mr-5"
                style={{
                  width: "150px",
                  paddingBottom: "20px",
                }}
              >
                <a
                  href={`${redirectUrl}bundle/${e.formId}/submission/${e.submissionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "12px" }}
                >
                  View Submission <i className="fa fa-pencil-square-o mr-1"></i>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ApplicationTimeline;
