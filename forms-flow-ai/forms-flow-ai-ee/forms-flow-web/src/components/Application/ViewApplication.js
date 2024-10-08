import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import startCase from "lodash/startCase";

import { Tabs, Tab } from "react-bootstrap";
import Details from "./Details";
import { getApplicationById } from "../../apiManager/services/applicationServices";
import Loading from "../../containers/Loading";
import {
  setApplicationDetailLoader,
  setApplicationDetailStatusCode,
} from "../../actions/applicationActions";
import ProcessDiagram from "../BPMN/ProcessDiagramHook";
import History from "./ApplicationHistory";
import View from "../Form/Item/Submission/Item/View";
import { getForm, getSubmission } from "react-formio";
import NotFound from "../NotFound";
import { Translation, useTranslation } from "react-i18next";
import {
  CUSTOM_SUBMISSION_URL,
  CUSTOM_SUBMISSION_ENABLE,
  MULTITENANCY_ENABLED,
} from "../../constants/constants";
import { fetchAllBpmProcesses } from "../../apiManager/services/processServices";
import { getCustomSubmission } from "../../apiManager/services/FormServices";
import { setBundleSubmissionData } from "../../actions/bundleActions";
import BundleView from "../Bundle/item/submission/View";
import BundleHistory from "./BundleHistory";
import { TYPE_BUNDLE } from "../../constants/applicationConstants";
import Nodata from "../Nodata";

const ViewApplication = React.memo(() => {
  const { t } = useTranslation();
  const { applicationId } = useParams();
  const applicationDetail = useSelector(
    (state) => state.applications.applicationDetail
  );
  const applicationDetailStatusCode = useSelector(
    (state) => state.applications.applicationDetailStatusCode
  );
  const isApplicationDetailLoading = useSelector(
    (state) => state.applications.isApplicationDetailLoading
  );

  const applicationProcess = useSelector(
    (state) => state.applications.applicationProcess
  );
  const currentForm = useSelector((state) => state.form?.form);
  const tenantKey = useSelector((state) => state.tenants?.tenantId);
  const dispatch = useDispatch();
  const redirectUrl = MULTITENANCY_ENABLED ? `/tenant/${tenantKey}/` : "/";
  const [customSubmissionAPIFailed, setCustomSubmissionAPIFailed] = useState(false);

  useEffect(() => {
    dispatch(setApplicationDetailLoader(true));
    dispatch(
      getApplicationById(applicationId, (err, res) => {
        if (!err) {
          if (res.submissionId && res.formId) {
            dispatch(getForm("form", res.formId));
            if (CUSTOM_SUBMISSION_URL && CUSTOM_SUBMISSION_ENABLE) {
              dispatch(
                getCustomSubmission(
                  res.submissionId,
                  res.formId,
                  (err, data) => {
                    if (err) {
                      setCustomSubmissionAPIFailed(true);
                      dispatch(setBundleSubmissionData({ data: null }));
                    }
                    else {
                      if (res.formType === TYPE_BUNDLE) {
                        dispatch(setBundleSubmissionData({ data: data.data }));
                      }
                    }
                  }
                )
              );
            } else {
              dispatch(
                getSubmission(
                  "submission",
                  res.submissionId,
                  res.formId,
                  (err, data) => {
                    if (res.formType === TYPE_BUNDLE) {
                      dispatch(setBundleSubmissionData({ data: data.data }));
                    }
                  }
                )
              );
            }
          }
        }
      })
    );
    return () => {
      dispatch(setApplicationDetailLoader(true));
      dispatch(setApplicationDetailStatusCode(""));
    };
  }, [applicationId, dispatch]);

  useEffect(() => {
    if (tenantKey) {
      dispatch(fetchAllBpmProcesses());
    }
  }, [dispatch, tenantKey]);

  if (isApplicationDetailLoading) {
    return <Loading />;
  }

  if (
    Object.keys(applicationDetail)?.length === 0 &&
    applicationDetailStatusCode === 403
  ) {
    return (
      <NotFound
        errorMessage={t("Access Denied")}
        errorCode={applicationDetailStatusCode}
      />
    );
  }

  return (
    <div className="container">
      <div className="main-header">
        <Link title={t("go back")} to={`${redirectUrl}application`}>
          <i className="fa fa-chevron-left fa-lg" />
        </Link>
        <h3 className="ml-3 text-truncate" style={{ height: "45px" }}>
          <span className="application-head-details">
            <i className="fa fa-list-alt" aria-hidden="true" />
            &nbsp; <Translation>{(t) => t("Applications Package Dashboard")}</Translation> /
          </span>{" "}
          {`${startCase(applicationDetail.applicationName)}`}
        </h3>
      </div>
      <br />
      <Tabs id="application-details" defaultActiveKey="details" mountOnEnter>
        <Tab
          eventKey="details"
          title={<Translation>{(t) => t("Details")}</Translation>}
        >
          <Details application={applicationDetail} />
        </Tab>
        <Tab
          eventKey="form"
          title={
            <Translation>
              {(t) =>
                t(
                  applicationDetail.formType === TYPE_BUNDLE ? "Forms" : "Form"
                )
              }
            </Translation>
          }
        >
          {

            customSubmissionAPIFailed ? (<Nodata />) :
              applicationDetail.formType === TYPE_BUNDLE &&
                currentForm.isBundle ? (
                <BundleView
                  bundleIdProp={applicationDetail.formId}
                  submissionIdProp={applicationDetail.submissionId}
                  showPrintButton={true}
                />
              ) : (
                <View page="application-detail" />
              )
          }
        </Tab>
        <Tab
          eventKey="history"
          title={<Translation>{(t) => t("History")}</Translation>}
        >
          {applicationDetail.formType === TYPE_BUNDLE ? (
            <BundleHistory applicationId={applicationId} />
          ) : (
            <History page="application-detail" applicationId={applicationId} />
          )}
        </Tab>
        <Tab
          eventKey="process-diagram"
          title={<Translation>{(t) => t("Process Diagram")}</Translation>}
        >
          <ProcessDiagram
            processKey={applicationProcess.processKey}
            processInstanceId={applicationDetail.processInstanceId}
            tenant={applicationDetail.processTenant}
          />
        </Tab>
      </Tabs>
    </div>
  );
});

export default ViewApplication;
