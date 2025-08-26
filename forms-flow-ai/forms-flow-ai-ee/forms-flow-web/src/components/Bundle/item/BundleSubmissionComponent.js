import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFormById } from "../../../apiManager/services/bpmFormServices";
import Loading from "../../../containers/Loading";
import { Form, Errors } from "react-formio";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import { Formio } from "formiojs";
import {
  setBundleSelectedForms,
  setBundleSubmissionData,
  setBundleSubmitLoading,
} from "../../../actions/bundleActions";
import LoadingOverlay from "react-loading-overlay";
import {
  clearFormError,
  setFormFailureErrorData,
} from "../../../actions/formActions";
import { executeRule } from "../../../apiManager/services/bundleServices";
import { useTranslation } from "react-i18next";
import StepButton from "@material-ui/core/StepButton";
import { textTruncate } from "../../../helper/helper";
import { formio_resourceBundles } from "../../../resourceBundles/formio_resourceBundles";
import { StepLabel } from "@material-ui/core";

const BundleSubmissionComponent = ({
  readOnly,
  onSubmit,
  onChange,
  submitButtonDisable = false,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onChangeFunction = onChange ? onChange : () => {};
  const options = readOnly ? { readOnly: true, viewAsHtml: true } : {};
  const bundleData = useSelector((state) => state.process.formProcessList);
  const selectedForms = useSelector((state) => state.bundle.selectedForms);
  const { error } = useSelector((state) => state.form);
  const [validationError, setValidationError] = useState("");
  const [validationErrorIndex, setValidationErroIndex] = useState(null);
  const [formStep, setFormStep] = useState({ step: 0 });
  const [getFormLoading, setGetFormLoading] = useState(false);
  const [form, setForm] = useState({});
  const bundleSubmission = useSelector(
    (state) => state.bundle.bundleSubmission,
  );
  const [submission, setSubmission] = useState(null);
  const bundleSubmitLoading = useSelector(
    (state) => state.bundle.bundleSubmitLoading,
  );
  const formRef = useRef();
  const [formCache, setFormCache] = useState({});
  const lang = useSelector((state) => state.user.lang);

  let isFormValidationPending = true;

  useEffect(() => {
    getForm();
    document.getElementById("main")?.scrollTo({ top: 0, behavior: "smooth" });
  }, [formStep]);

  const getForm = (done = () => {}) => {
    if (selectedForms?.length) {
      dispatch(clearFormError("form"));
      setGetFormLoading(true);
      fetchFormById(selectedForms[formStep.step].formId)
        .then((res) => {
          if (!readOnly) {
            !formCache[res.data._id] &&
              setFormCache({ ...formCache, [res.data._id]: res.data });
          }
          setForm(res.data);
        })
        .catch((err) => {
          dispatch(
            setFormFailureErrorData("form", err.response?.data || err.message),
          );
        })
        .finally(() => {
          setGetFormLoading(false);
          done();
        });
    }
  };

  const handleSubmisionData = () => {
    dispatch(
      setBundleSubmissionData({
        data: { ...bundleSubmission.data, ...submission.data },
      }),
    );
  };

  // checking the forms order changed or not
  const checkFormStepChange = (responseData) => {
    let changed = null;
    if (responseData) {
      responseData.forEach((i, index) => {
        if (changed === null && selectedForms[index]?.formId !== i.formId) {
          changed = index;
        }
      });
    }
    return changed;
  };

  const onLabelClick = (step) => {
    if (step === formStep.step) {
      return;
    }
    if (readOnly) {
      setFormStep({ step: step });
      return;
    }
    handleSubmisionData();
    setValidationErroIndex(null);
    setValidationError(false);
    dispatch(setBundleSubmitLoading(true));
    if (validationErrorIndex !== null) {
      setValidationErroIndex(null);
    }
    executeRule({ data: submission.data }, bundleData.id)
      .then((res) => {
        let changed = null;
        if (res.data?.length !== selectedForms?.length) {
          changed = checkFormStepChange(res.data);
          if (changed == null) {
            changed = formStep.step;
          }
        }
        dispatch(setBundleSelectedForms(res.data));
        setFormStep({ step: changed !== null ? changed : step });
      })
      .finally(() => {
        dispatch(setBundleSubmitLoading(false));
      });
  };

  const handleNextForm = () => {
    if (readOnly) {
      setFormStep({ step: formStep.step + 1 });
      return;
    }
    handleSubmisionData();
    // try to submit current form if any validation error it through
    formRef.current
      .submit()
      .then(() => {
        setValidationErroIndex(null);
        setValidationError(false);
        dispatch(setBundleSubmitLoading(true));
        executeRule({ data: submission.data }, bundleData.id)
          .then((res) => {
            let changed = null;
            const { data } = res;
            if (data?.length !== selectedForms?.length) {
              changed = checkFormStepChange(data);
            }
            dispatch(setBundleSelectedForms(data));
            // checking the result forms are less than form step or grater than form step
            let updatedStep = null;
            if (changed !== null) {
              updatedStep = changed;
              if (selectedForms.length > 1) {
                updatedStep = formStep.step + 1;
              }
            } else if (data?.length - 1 > formStep.step) {
              updatedStep = formStep.step + 1;
            } else if (data?.length - 1 < formStep.step) {
              updatedStep = data?.length - 1;
            } else {
              updatedStep = formStep.step;
            }

            setFormStep({ step: updatedStep });
          })
          .finally(() => {
            dispatch(setBundleSubmitLoading(false));
          });
      })
      .catch(() => {
        // if any error caught it will show here
        setValidationErroIndex(formStep.step);
        setValidationError(true);
      });
  };

  const handleBackForm = () => {
    setFormStep({ step: formStep.step - 1 });
  };

  const bundleFormValidation = async (valid, index) => {
    // the form is not valid
    //form validationNotOver is once this variable true then don't need to check other forms
    if (!valid && isFormValidationPending) {
      isFormValidationPending = valid;
      setValidationErroIndex(index);
      setFormStep({ step: index });
      setValidationError(true);
      dispatch(setBundleSubmitLoading(false));
      return;
    }
    if (
      valid &&
      index === selectedForms?.length - 1 &&
      isFormValidationPending
    ) {
      isFormValidationPending = false;
      // maybe the current form is not be last one so need to execute rule again
      const response = await executeRule(
        { data: submission.data },
        bundleData.id,
      );
      if (response && response.data?.length !== selectedForms?.length) {
        // if the previous lenght of form and response form length are not same
        const changed = checkFormStepChange(response.data);
        dispatch(setBundleSelectedForms(response.data));
        setFormStep({ step: changed });
        dispatch(setBundleSubmitLoading(false));
        return;
      }
      onSubmit({ data: submission.data }, bundleData.formId);
    }
  };

  const checkAllFormsCachedToValidate = async () => {
    // cache all forms if some forms are not cached then need to fetch those form's data
    if (selectedForms.length == formCache.length) {
      handleSubmit(formCache);
    } else {
      const cachedForms = { ...formCache };
      for (const form of selectedForms) {
        {
          if (!formCache[form.formId]) {
            try {
              const { data } = await fetchFormById(form.formId);
              setFormCache((prev) => ({ ...prev, [data._id]: data }));
              cachedForms[form.formId] = data;
            } catch (err) {
              console.error(err);
            }
          }
        }
      }
      handleSubmit(cachedForms);
    }
  };

  const handleSubmit = async (cachedForms) => {
    handleSubmisionData();
    formRef.current
      .submit()
      .then(() => {
        dispatch(setBundleSubmitLoading(true));
        setValidationErroIndex(null);
        setValidationError(false);
        selectedForms.forEach(async (form, index) => {
          const formioForm = await Formio.createForm(cachedForms[form.formId], {
            alwaysDirty: true,
          });
          formioForm.submission = { data: submission.data };
          formioForm.on("change", function () {
            formioForm.setPristine(false);
            formioForm.redraw();
            bundleFormValidation(formioForm.checkValidity(null, true), index);
          });
        });
      })
      .catch(() => {
        setValidationErroIndex(formStep.step);
        setValidationError(true);
      });
  };

  useEffect(() => {
    const sucessELement = document.querySelector(".alert-success");
    if (sucessELement) sucessELement.style.display = "none";
  });

  const onCustomEvent = (customEventData) => {
    onSubmit(
      { data: formRef.current.data },
      bundleData.formId,
      customEventData,
    );
  };

  if (!form.title && getFormLoading) {
    return <Loading />;
  }

  return (
    <div className="p-3 bundle">
      <div>
        {/* {
        validationError ? <span className="text-danger">Please check the form and correct all the errors
        </span> : ""
      } */}
        <LoadingOverlay
          active={bundleSubmitLoading || getFormLoading}
          spinner
          text={"Loading..."}
        >
          <div className="py-2">
            <Stepper nonLinear activeStep={formStep.step} alternativeLabel>
              {selectedForms?.map((form, index) => (
                <Step
                  key={form.id}
                  onClick={() => {
                    onLabelClick(index);
                  }}
                >
                  <StepButton>
                    <StepLabel error={validationErrorIndex === index}>
                      {form.formName.includes(" ")
                        ? form.formName
                        : textTruncate(30, 20, form.formName)}
                    </StepLabel>
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <div className="px-3">
              <div>
                <Errors errors={error} />
                <h3 className="px-3 py-2 text-truncate">{form.title}</h3>
                <div className="px-3 py-2">
                  <Errors errors={error} />
                  <Form
                    form={form}
                    options={{
                      hide: { submit: true },
                      ...options,
                      noAlerts: false,
                      language: lang,
                      i18n: formio_resourceBundles,
                    }}
                    onFormLoad={() => {
                      if (validationErrorIndex !== null) {
                        formRef.current.submit();
                      }
                    }}
                    onCustomEvent={onCustomEvent}
                    formReady={(e) => {
                      formRef.current = e;
                    }}
                    submission={bundleSubmission}
                    onChange={(e) => {
                      onChangeFunction(e);
                      setSubmission(e);
                    }}
                  />
                </div>
                {validationError ? (
                  <span className="text-danger">
                    Please check the form and correct all the errors
                  </span>
                ) : (
                  ""
                )}
                <div className="d-flex align-items-center justify-content-end px-3 py-2">
                  {formStep.step === 0 ? (
                    ""
                  ) : (
                    <button
                      onClick={handleBackForm}
                      className="btn btn-secondary mr-2"
                    >
                      {t("Previous Form")}
                    </button>
                  )}
                  {(readOnly || submitButtonDisable) &&
                  selectedForms?.length - 1 == formStep.step ? (
                    ""
                  ) : (
                    <button
                      onClick={
                        selectedForms?.length - 1 === formStep.step
                          ? checkAllFormsCachedToValidate
                          : handleNextForm
                      }
                      disabled={bundleSubmitLoading}
                      className="btn btn-primary"
                    >
                      {selectedForms?.length - 1 === formStep.step
                        ? "Submit Form"
                        : "Next Form"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </LoadingOverlay>
      </div>
    </div>
  );
};

export default BundleSubmissionComponent;
