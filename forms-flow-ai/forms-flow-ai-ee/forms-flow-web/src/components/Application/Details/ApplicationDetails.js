import React from "react";
import { Table } from "react-bootstrap";
import startCase from "lodash/startCase";
import { getLocalDateTime } from "../../../apiManager/services/formatterService";
import { Translation } from "react-i18next";
import { getUserRolePermission } from "../../../helper/user";
import { useSelector } from "react-redux";
import { getClientApplicationStatus } from "../../../helper/helper";
import { CLIENT } from "../../../constants/constants";

const ApplicationDetails = React.memo((props) => {
  const application = props.application;

  const showClientStatus = (applicationStatus) => {
    const userRoles = useSelector((state) => state.user.roles);
    if (applicationStatus && getUserRolePermission(userRoles, CLIENT)) {
      return getClientApplicationStatus(applicationStatus);
    } else {
      return applicationStatus;
    }
  };

  return (
    <Table>
      <tbody>
        <tr>
          <td className="border-0">
            <Translation>{(t) => t("Application ID")}</Translation>
          </td>
          <td className="border-0" id="application-id">
            {application.id}
          </td>
        </tr>
        <tr>
          <td className="border-0">
            <Translation>{(t) => t("Application Name")}</Translation>
          </td>
          <td className="border-0 text-truncate" id="application-name">
            {startCase(application.applicationName)}
          </td>
        </tr>
        <tr>
          <td className="border-0">
            <Translation>{(t) => t("Created By")}</Translation>
          </td>
          <td className="border-0" id="created-by">
            {application.createdBy}
          </td>
        </tr>
        <tr>
          <td className="border-0">
            <Translation>{(t) => t("Application Status")}</Translation>
          </td>
          <td className="border-0" id="application-status">
            {showClientStatus(application.applicationStatus)}
          </td>
        </tr>
        <tr>
          <td className="border-0">
            <Translation>{(t) => t("Submitted On")}</Translation>
          </td>
          <td className="border-0" id="application-created">
            {getLocalDateTime(application.created)}
          </td>
        </tr>
        <tr>
          <td className="border-0">
            <Translation>{(t) => t("Modified On")}</Translation>
          </td>
          <td className="border-0" id="application-modified">
            {getLocalDateTime(application.modified)}
          </td>
        </tr>
      </tbody>
    </Table>
  );
});

export default ApplicationDetails;
