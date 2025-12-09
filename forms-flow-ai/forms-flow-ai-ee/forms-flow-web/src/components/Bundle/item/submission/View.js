import React, { useEffect, useState } from "react";
import BundleSubmissionView from "../BundleSubmissionComponent";
import { setBundleSelectedForms } from "../../../../actions/bundleActions";
import { getFormProcesses } from "../../../../apiManager/services/processServices";
import { executeRule } from "../../../../apiManager/services/bundleServices";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Errors } from "react-formio/lib/components";
import Loading from "../../../../containers/Loading";

const BundleView = ({
  bundleIdProp,
  submissionIdProp,
  showPrintButton = true,
}) => {
  const { bundleId, submissionId } = useParams();
  const updatedSubmissionId = submissionIdProp || submissionId;
  const dispatch = useDispatch();
  const bundleData = useSelector((state) => state.process.formProcessList);
  const selectedForms = useSelector(
    (state) => state.bundle.selectedForms || []
  );
  const bundleSubmission = useSelector(
    (state) => state.bundle.bundleSubmission
  );
  const applicationId = useSelector(
    (state) => state.bundle?.bundleSubmission?.data?.applicationId || null
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    setLoading(true);
    dispatch(
      getFormProcesses(bundleIdProp || bundleId, (err, data) => {
        if (err) {
          setErrors(err);
          setLoading(false);
        } else {
          executeRule(bundleSubmission || {}, data.id)
            .then((res) => {
              dispatch(setBundleSelectedForms(res.data));
            })
            .catch((err) => {
              setErrors(err);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      })
    );
    return () => {
      dispatch(setBundleSelectedForms([]));
    };
  }, [bundleId, dispatch, bundleIdProp]);

  if (loading) {
    return (
      <div data-testid="loading-view-component">
        <Loading />
      </div>
    );
  }

  if (errors) {
    return (
      <div className="p-3">
        <Errors errors={errors} />
      </div>
    );
  }

  if (!selectedForms.length) return null;

  return (
    <>
      <BundleSubmissionView
        readOnly={true}
        showPrintButton={showPrintButton}
        submissionId={updatedSubmissionId}
        applicationId={applicationId}
        bundleId={bundleData.id}
      />
    </>
  );
};

export default BundleView;
