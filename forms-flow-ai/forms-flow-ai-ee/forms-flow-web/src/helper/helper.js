import NotFound from "../components/NotFound";
import { Translation } from "react-i18next";

export const getClientApplicationStatus = (applicationStatus) => {
  const statusMap = {
    municipality: "With Municipality",
    csap: "With CSAP",
    new: "Submitted",
    queued: "Accepted",
    "additional information requested": "Additional Information Requested",
    "pending pre payment": "Pending Pre Payment",
    rejected: "Closed",
    "closed, outcome rejected": "Closed",
    "review in progress src team": "Accepted",
    "to be assigned": "Accepted",
    "review in progress caseworker": "Review",
    "review in progress sdm": "Review",
    "reassignment required": "Review",
    "additional resources required": "Review",
    "outcome decision made - satisfactory": "Completed",
    "outcome decision made - unsatisfactory": "Completed",
    withdrawn: "Completed",
    "awaiting payment": "Invoice sent",
    closed: "Closed",
    returned: "Additional Information Requested",
    resubmit: "Additional Information Requested",
    "received from municipality": "Review",
    "review in progress": "Review",
  };

  const normalizedStatus = applicationStatus.toLowerCase();
  return statusMap[normalizedStatus] || applicationStatus;
};

const replaceUrl = (URL, key, value) => {
  return URL.replace(key, value);
};

const addTenantkey = (value, tenantkey) => {
  const tenantKeyCheck = value.match(`${tenantkey}-`);
  if (
    tenantKeyCheck &&
    tenantKeyCheck[0].toLowerCase() === `${tenantkey.toLowerCase()}-`
  ) {
    return value.toLowerCase();
  } else {
    return `${tenantkey.toLowerCase()}-${value.toLowerCase()}`;
  }
};

const removeTenantKey = (value, tenantkey) => {
  const tenantKeyCheck = value.match(`${tenantkey}-`);
  if (
    tenantKeyCheck &&
    tenantKeyCheck[0].toLowerCase() === `${tenantkey.toLowerCase()}-`
  ) {
    return value.replace(`${tenantkey.toLowerCase()}-`, "");
  } else {
    return false;
  }
};

const textTruncate = (wordLength, targetLength, text) => {
  return text?.length > wordLength
    ? text.substring(0, targetLength) + "..."
    : text;
};

export const getUrlLastPath = (url) => {
  url = url?.split("/");
  return url[url?.length - 1];
};

const renderPage = (formStatus, processLoadError) => {
  if (!processLoadError && (formStatus === "inactive" || !formStatus)) {
    return (
      <span>
        <div
          className="container"
          style={{
            maxWidth: "900px",
            margin: "auto",
            height: "50vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h3>{<Translation>{(t) => t("Form not published")}</Translation>}</h3>
          <p>
            {
              <Translation>
                {(t) => t("You can't submit this form until it is published")}
              </Translation>
            }
          </p>
        </div>
      </span>
    );
  } else {
    return (
      <NotFound
        errorMessage={<Translation>{(t) => t("Access Denied")}</Translation>}
        errorCode={"403"}
      />
    );
  }
};
export { replaceUrl, addTenantkey, removeTenantKey, textTruncate, renderPage };
