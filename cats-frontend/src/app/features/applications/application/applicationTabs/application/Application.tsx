import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDateUTC, getUser } from '../../../../../helpers/utility';
import './Application.css';
import {
  useGetApplicationByIdQuery,
  useGetApplicationStatusTypesQuery,
  useGetSubmissionByApplicationIdQuery,
  useUpdateApplicationStatusMutation,
} from './Application.generated';
import LoadingOverlay from '../../../../../components/loader/LoadingOverlay';
import { DropdownInput } from '../../../../../components/input-controls/InputControls';
import { FormFieldType } from '../../../../../components/input-controls/IFormField';
import '../../../../../components/form/Form.css';
import { Form } from '@formio/react';
import 'formiojs/dist/formio.full.min.css';
import '../../../../../../../common-hosted-form-service/components/lib/use';

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
  const [statusTypeId, setStatusTypeId] = useState('');

  const applicationId = parseInt(id ?? '', 10);

  const { data: submissionData, loading: submissionLoading } =
    useGetSubmissionByApplicationIdQuery({
      variables: { applicationId },
      fetchPolicy: 'network-only',
      skip: !applicationId,
    });

  const { data: applicationData } = useGetApplicationByIdQuery({
    variables: { applicationId },
    skip: !applicationId,
  });

  const { data: statusTypesData, loading: statusTypesLoading } =
    useGetApplicationStatusTypesQuery();

  const [updateApplicationStatus, { loading: updatingStatus }] =
    useUpdateApplicationStatusMutation();

  const currentStatusId =
    applicationData?.getApplicationDetailsById?.data?.currentStatus?.id;

  useEffect(() => {
    setStatusTypeId(currentStatusId ? String(currentStatusId) : '');
  }, [currentStatusId]);

  const submission = submissionData?.getSubmissionByApplicationId?.data;
  const submissionFormData = submission?.formData;
  const submissionFormSchema = submission?.formSchema;
  const chefsSubmissionId = submission?.chefsSubmissionId?.trim() || '';

  const chefsAppBaseUrl = (
    import.meta.env.VITE_CHEFS_APP_URL ||
    window?._env_?.VITE_CHEFS_APP_URL ||
    'https://submit.digital.gov.bc.ca'
  ).replace(/\/$/, '');

  const originalSubmissionUrl = chefsSubmissionId
    ? `${chefsAppBaseUrl}/app/form/view?s=${encodeURIComponent(chefsSubmissionId)}`
    : null;
  const originalSubmissionLinkLabel = originalSubmissionUrl
    ? originalSubmissionUrl.replace(/^https?:\/\//, '')
    : null;

  const receivedAt =
    submission?.receivedAt ?? formData?.data?.form?.submittedAt ?? null;
  const formattedReceivedDate = receivedAt
    ? formatDateUTC(receivedAt, 'yyyy/MM/dd')
    : null;

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

  const handleStatusChange = async (value: string) => {
    const nextStatusTypeId = String(value ?? '').trim();
    if (!applicationId || nextStatusTypeId === statusTypeId) {
      return;
    }

    const previousStatusTypeId = statusTypeId;
    setStatusTypeId(nextStatusTypeId);

    // Empty value is a valid choice, same as the All Applications filter.
    if (!nextStatusTypeId) {
      return;
    }

    try {
      const result = await updateApplicationStatus({
        variables: {
          applicationId,
          statusTypeId: Number(nextStatusTypeId),
        },
        refetchQueries: ['getApplicationById', 'getApplicationDetailsById'],
      });

      if (!result.data?.updateApplicationStatus?.success) {
        setStatusTypeId(previousStatusTypeId);
      }
    } catch {
      setStatusTypeId(previousStatusTypeId);
    }
  };

  const statusOptions =
    statusTypesData?.getAllStatusTypes?.map((status) => ({
      key: String(status.id),
      value: status.description,
    })) ?? [];

  if (isLoading) {
    return <LoadingOverlay loading={isLoading} />;
  }

  return (
    <div className="application-container" id="main">
      <div className="application-form-content">
        <div
          className="application-status-bar"
          data-testid="application-status-bar"
        >
          {formattedReceivedDate && (
            <p className="application-received-label">
              Application Received: {formattedReceivedDate}
            </p>
          )}
          <div className="application-status-bar__status">
            <span className="application-status-bar__status-label">
              Status:
            </span>
            <DropdownInput
              type={FormFieldType.DropDown}
              label=""
              placeholder="Select Status"
              value={statusTypeId}
              isEditing
              isDisabled={statusTypesLoading || updatingStatus}
              options={statusOptions}
              onChange={(value) => handleStatusChange(String(value ?? ''))}
            />
          </div>
        </div>
        {originalSubmissionUrl && originalSubmissionLinkLabel && (
          <p
            className="application-original-submission"
            data-testid="original-submission-link"
          >
            <span className="application-original-submission__label">
              Original Submission Link:
            </span>{' '}
            <a
              href={originalSubmissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="application-original-submission__link"
            >
              {originalSubmissionLinkLabel}
            </a>
          </p>
        )}
        {error ? (
          <div className="error-container">
            <div className="error-message">
              <p className="error-details">
                Application was not submitted through the platform. Please check
                your file records for reference.
              </p>
            </div>
          </div>
        ) : formJson?.components?.length > 0 ? (
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
  );
};
