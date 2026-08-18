import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUser } from '../../../../../helpers/utility';
import './Application.css';
import { useGetSubmissionByApplicationIdQuery } from './Application.generated';
import LoadingOverlay from '../../../../../components/loader/LoadingOverlay';
import { Form } from '@formio/react';
import { Formio } from 'formiojs';
import 'formiojs/dist/formio.full.min.css';
import BcGovFormioComponents from '../../../../../../../common-hosted-form-service/components/lib';

Formio.use(BcGovFormioComponents);

type FormJson = {
  title?: string;
  components: any[];
};

type Submission = {
  data: { [key: string]: any };
  metadata?: { [key: string]: any };
  state?: string;
};

interface ApplicationProps {}

export const Application: React.FC<ApplicationProps> = () => {
  const userDetails = getUser();
  if (userDetails) {
    localStorage.setItem('UserDetails', JSON.stringify(userDetails?.profile));
  }

  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Submission>({ data: {} });
  const [formJson, setFormJson] = useState<FormJson>({ components: [] });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applicationId = parseInt(id ?? '', 10);

  const { data: submissionData, loading: submissionLoading } =
    useGetSubmissionByApplicationIdQuery({
      variables: { applicationId },
      fetchPolicy: 'network-only',
      skip: !applicationId,
    });

  const submissionFormData =
    submissionData?.getSubmissionByApplicationId?.data?.formData;
  const submissionFormSchema =
    submissionData?.getSubmissionByApplicationId?.data?.formSchema;

  useEffect(() => {
    if (submissionLoading) return;

    if (submissionFormData) {
      try {
        const parsed = JSON.parse(submissionFormData);
        setFormData({ data: parsed });

        if (submissionFormSchema) {
          const schemaResponse = JSON.parse(submissionFormSchema);
          setFormJson(schemaResponse.schema);
        }

        setIsLoading(false);
        return;
      } catch (err) {
        console.error('Error parsing submission form data:', err);
      }
    }

    setError('Form details not found.');
    setIsLoading(false);
  }, [submissionLoading, submissionFormData, submissionFormSchema]);

  if (isLoading) {
    return <LoadingOverlay loading={isLoading} />;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <p className="error-details">
            Application was not submitted through the platform. Please check
            your file records for reference.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="application-container" id="main">
      <div>
        <h3
          className="ml-3 task-head text-truncate fw-bold"
          style={{ height: '45px' }}
        >
          {formJson?.title || 'Application Submission'}
        </h3>
        <div className="px-3 py-2">
          {formJson?.components?.length > 0 ? (
            <Form
              src={formJson as any}
              submission={formData}
              options={
                {
                  hide: { submit: true },
                  noAlerts: false,
                  readOnly: true,
                  viewAsHtml: true,
                } as any
              }
            />
          ) : (
            <pre className="submission-data">
              {JSON.stringify(formData?.data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
