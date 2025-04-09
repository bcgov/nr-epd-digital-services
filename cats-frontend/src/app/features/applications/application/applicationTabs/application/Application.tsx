import { useEffect, useState } from "react";
//@ts-ignore
import { Form, Errors } from "react-formio";
import { useParams } from "react-router-dom";
import { getApplicationForm, getApplicationFormData, getBundleForms, getFormDetails } from "./FormioEndpoints";
import { getUser } from "../../../../../helpers/utility";
import './Application.css'
import PropTypes from "prop-types";
import { SpinnerIcon } from "../../../../../components/common/icon";

Form.propTypes = {
  options: PropTypes.shape({
      readOnly: PropTypes.func,
  }),
};


export const Application = () => {
  const userDetails = getUser();
  if (userDetails) {
    localStorage.setItem('UserDetails', JSON.stringify(userDetails?.profile));
  }

  const { id: applicationId } = useParams<{ id?: string }>();
  const [formData, setFormData] = useState<any>({});  
  const [formJson, setFormJson] = useState<any>({});  
  const [application, setApplication] = useState<any>(null);
  const [selectedForms, setSelectedForms] = useState<any[]>([]); 
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch application data
  const submissionId =  
  //"82507662-445c-4ba6-b910-99327732dba1"; 
"d522f979-5998-4b75-9a56-0de90946ab38";
  const formId = 
  //"652858d27f5004da00d5448d"; 
   "652856b37f5004da00d5445f";

  useEffect(() => {
  if (!applicationId) return;

  // Initial setup
  setIsLoading(true);
  setActiveStep(0);
  setError(null);  // Clear any previous error   

  const fetchApplicationData = async () => {
      try {
        const res = await getFormDetails(formId);  // Fetching application data (replace '770' with actual applicationId if needed)
        if (res) {
          setApplication(res?.data);
          const {formType, id } = res?.data;

          // Fetch forms and data based on the form type
          if (formType === 'bundle') {
            const bundleForms: any = await getBundleForms(id);
            const formPromises = bundleForms?.data?.map(async (form: any) => {
              const formData = await getApplicationForm(form.formId);
              return {
                formId: form.formId,
                formJson: formData?.data,
              };
            });

            const forms = await Promise.all(formPromises);
            setSelectedForms(forms);
            setFormJson(forms[0]?.formJson || {});  // Set the form JSON for the first form in the bundle
          }

          // Fetch form data for the single form if not a bundle
          const formData = await getApplicationFormData(formId, submissionId);
          setFormData(formData?.data);
          

          // If it's not a bundle, fetch the form directly
          if (formType !== 'bundle') {
            const form = await getApplicationForm(formId);
            setFormJson(form?.data);
          }
        }
      } catch (err) {
        console.error("Error fetching application data:", err);
        setError("Failed to load application data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationData();

    return () => {
      setIsLoading(false);
      setError(null);
    };
  }, [applicationId]);  // The effect will run when applicationId changes.

  // Ensure hooks are not conditionally called
  const handleStepClick = (index: number, e?: any) => {
    rippleEffect(e);
    setActiveStep(index);
    const selectedForm = selectedForms[index];
    if (selectedForm) {
      setFormJson(selectedForm?.formJson || {});
    }
  };

  const handleBackForm = () => {
    if (activeStep > 0)
    {
     setActiveStep(activeStep - 1);
     handleStepClick(activeStep - 1);
    } 
  };

  const handleNextForm = () => {
    if (activeStep < selectedForms.length - 1)
    {
      setActiveStep(activeStep + 1);
      handleStepClick(activeStep + 1);
    }
  };

  useEffect(() => {
    document.getElementById("main")?.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);  

  const rippleEffect = (e: any) => {
    const stepDiv = e.currentTarget;
    const oldRipple = stepDiv.querySelector(".ripple-effect");

    if (oldRipple) oldRipple.remove();
    
    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    const rect = stepDiv.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    ripple.style.left = `${offsetX - size / 2}px`;
    ripple.style.top = `${offsetY - size / 2}px`;
    stepDiv.appendChild(ripple);
  }

  if (isLoading) {
    return (
    <div className="application-container" id = "loader">
      <SpinnerIcon className="fa-spin" />
    </div>
    );
  }

  if (error) {
    return <div className="application-container">{error}</div>;
  }


  
  return (
    <div className="application-container" id='main'>
      {application?.formType === "bundle" ? (
        <div className="py-2">
          <div className="application-container padding-bottom-3x mb-1">
              <div className="mb-3">
                <div className="steps d-flex flex-wrap flex-sm-nowrap justify-content-between pt-2 pb-1">
                  {
                    selectedForms?.map((step, index) => (
                      <div key={index} className={`step pt-4 pb-4 ${index === activeStep ? "completed" : ""}`} onClick={(e) => handleStepClick(index, e)}>
                        <div className="step-label-wrap">
                          <div className="step-label"> {index + 1}</div>
                        </div>
                        <h4 className="step-title">{step?.formJson?.title ?? ''}</h4>
                      </div>
                    ))
                  } 
                </div>
              </div>
          </div>
          <div className="px-3 pt-5">
            <div>
              <h3 className="px-3 py-2 text-truncate">{formJson?.title}</h3>
              <div className="px-3 py-2">
                <Errors errors={error} />
                {formJson && formData && (
                  <Form
                    form={formJson}
                    submission={formData}
                    options={{
                      hide: { submit: true },
                      noAlerts: false,
                      readOnly: true, 
                      viewAsHtml: true
                    }}
                  />
                )}
              </div>
              <div className="d-flex align-items-center justify-content-end px-3 py-2">
                {activeStep > 0 && (
                  <button
                    onClick={handleBackForm}
                    className="btn btn-secondary mr-2"
                  >
                    Previous Form
                  </button>
                )}
                {activeStep < selectedForms?.length - 1 && (
                  <button
                    onClick={handleNextForm}
                    className="btn btn-primary"
                  >
                    Next Form
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="ml-3 task-head text-truncate" style={{ height: "45px" }}>
            {formJson?.title}
          </h3>
          <div>
          <Errors errors={error} />
          {formJson && formData && (
            <Form
              form={formJson}
              submission={formData}
              options={{
                hide: { submit: true },
                noAlerts: false,
                readOnly: true, 
                viewAsHtml: true
              }}
            />
          )}
          </div>
        </div>
      )}
    </div>
  );
};
