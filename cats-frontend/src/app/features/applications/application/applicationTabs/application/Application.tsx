import { useEffect, useState } from 'react';
//@ts-ignore
import { Form, Errors } from 'react-formio';
import { useParams } from 'react-router-dom';
import {
  getApplicationForm,
  getApplicationFormData,
  getBundleForms,
  getFormDetails,
} from './FormioEndpoints';
import { getUser } from '../../../../../helpers/utility';
import './Application.css';
import PropTypes from 'prop-types';
import { SpinnerIcon } from '../../../../../components/common/icon';
import {
  GetApplicationByIdQuery,
  useGetApplicationByIdQuery,
} from './Application.generated';

Form.propTypes = {
  options: PropTypes.shape({
    readOnly: PropTypes.func,
  }),
};

type ApplicationDetails =
  GetApplicationByIdQuery['getApplicationDetailsById']['data'];

type FormJson = {
  title?: string;
};

interface ApplicationForm {
  formId: string;
  formJson: FormJson;
}

interface ApplicationProps {}

export const Application: React.FC<ApplicationProps> = () => {
  const userDetails = getUser();
  if (userDetails) {
    localStorage.setItem('UserDetails', JSON.stringify(userDetails?.profile));
  }

  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formJson, setFormJson] = useState<FormJson>({});
  const [formType, setFormType] = useState<string | null>(null);
  const [selectedForms, setSelectedForms] = useState<ApplicationForm[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const applicationId = parseInt(id ?? '', 10);
  const { data } = useGetApplicationByIdQuery({
    variables: {
      applicationId,
    },
    skip: !applicationId,
  });

  const application: ApplicationDetails =
    data?.getApplicationDetailsById.data ?? null;
  const formId = application?.formId ?? '';
  const submissionId = application?.submissionId ?? '';

  useEffect(() => {
    if (!formId || !submissionId) {
      setError('Form details not found.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setActiveStep(0);
    setError(null);

    const fetchApplicationData = async () => {
      try {
        const res = await getFormDetails(formId);
        if (res) {
          const { formType, id } = res?.data;
          setFormType(formType);

          const formData = await getApplicationFormData(formId, submissionId);
          setFormData(formData?.data);

          if (formType === 'bundle') {
            const bundleForms = await getBundleForms(id);
            const formPromises = bundleForms?.data?.map(async (form: any) => {
              const formData = await getApplicationForm(form.formId);
              return {
                formId: form.formId,
                formJson: formData?.data,
              };
            });

            const forms = await Promise.all(formPromises);
            setSelectedForms(forms);
            setFormJson(forms[0]?.formJson || {});
          }

          if (formType !== 'bundle') {
            const form = await getApplicationForm(formId);
            setFormJson(form?.data);
          }
        }
      } catch (err) {
        console.error('Error fetching application data:', err);
        setError('Failed to load application data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationData();

    return () => {
      setIsLoading(false);
      setError(null);
    };
  }, [application, formId, submissionId]);

  const handleStepClick = (
    index: number,
    e?: React.MouseEvent<HTMLDivElement>,
  ) => {
    rippleEffect(e);
    setActiveStep(index);
    const selectedForm = selectedForms[index];
    if (selectedForm) {
      setFormJson(selectedForm?.formJson || {});
    }
  };

  const handleBackForm = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      handleStepClick(activeStep - 1);
    }
  };

  const handleNextForm = () => {
    if (activeStep < selectedForms.length - 1) {
      setActiveStep(activeStep + 1);
      handleStepClick(activeStep + 1);
    }
  };

  useEffect(() => {
    document.getElementById('main')?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStep]);

  const rippleEffect = (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!e) return;
    const stepDiv = e.currentTarget;
    const oldRipple = stepDiv.querySelector('.ripple-effect');

    if (oldRipple) oldRipple.remove();

    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    const rect = stepDiv.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    ripple.style.left = `${offsetX - size / 2}px`;
    ripple.style.top = `${offsetY - size / 2}px`;
    stepDiv.appendChild(ripple);
  };

  if (isLoading) {
    return (
      <div className="application-container" id="loader">
        <SpinnerIcon className="fa-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2 className="error-title">Oops! Something went wrong</h2>
          <p className="error-details">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="application-container" id="main">
      {formType === 'bundle' ? (
        <div className="py-2">
          <div className="application-container padding-bottom-3x mb-1">
            <div className="mb-3">
              <div className="steps d-flex flex-wrap flex-sm-nowrap justify-content-between pt-2 pb-1">
                {selectedForms?.map((step, index) => (
                  <div
                    key={index}
                    className={`step pt-4 pb-4 ${index === activeStep ? 'completed' : ''}`}
                    onClick={(e) => handleStepClick(index, e)}
                  >
                    <div className="step-label-wrap">
                      <div className="step-label"> {index + 1}</div>
                    </div>
                    <h4 className="step-title">
                      {step?.formJson?.title ?? ''}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="px-3 pt-5">
            <div>
              <h3 className="px-3 py-2 text-truncate fw-bold">
                {formJson?.title}
              </h3>
              <div className="px-3 py-2">
                <Errors errors={error} />
                {formJson && formData && (
                  <Form
                    form={formJson}
                    submission={formData}
                    options={{
                      hide: { submit: true },
                      noAlerts: false,
                      readOnly: () => true,
                      viewAsHtml: true,
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
                  <button onClick={handleNextForm} className="btn btn-primary">
                    Next Form
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h3
            className="ml-3 task-head text-truncate fw-bold"
            style={{ height: '45px' }}
          >
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
                  readOnly: () => true,
                  viewAsHtml: true,
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
