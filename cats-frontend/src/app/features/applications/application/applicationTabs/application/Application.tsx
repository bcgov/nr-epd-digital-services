import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDateUTC, getUser } from '../../../../../helpers/utility';
import './Application.css';
import {
  useGetApplicationByIdQuery,
  useGetApplicationStatusTypesQuery,
  useGetSubmissionByApplicationIdQuery,
  useUpdateApplicationStatusMutation,
} from './Application.generated';
import { useGetHeaderDetailsByApplicationIdQuery } from '../../ApplicationDetails.generated';
import { isSdsAppType } from '../../../../navigation/NavigationPillsConfig';
import { LinkToSiteId } from './LinkToSiteId';
import { SdsDisclosurePreview } from './SdsDisclosurePreview';
import LoadingOverlay from '../../../../../components/loader/LoadingOverlay';
import { DropdownInput } from '../../../../../components/input-controls/InputControls';
import { FormFieldType } from '../../../../../components/input-controls/IFormField';
import '../../../../../components/form/Form.css';
import { Form } from '@formio/react';
import 'formiojs/dist/formio.full.min.css';
import '../../../../../../../vendor/chefs-formio/bcgov-formio-components.css';
import '../../../../../../../vendor/chefs-formio/chefs-form-viewer.css';
import { registerChefsComponents } from './registerChefsComponents';
import StatusReasonModal from '../../components/StatusReasonModal';
import {
  isCommentRequiredStatus,
  isMoreInformationStatus,
  isRejectionStatus,
} from '../../statusCommentPolicy';
import { notifyError, notifySuccess } from '../../../../../components/alert/Alert';

type FormJson = {
  title?: string;
  components: any[];
};

type Submission = {
  data: { [key: string]: any };
  metadata?: { [key: string]: any };
  state?: string;
};

type PendingStatusSelection = {
  id: string;
  abbrev?: string | null;
  description?: string | null;
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
  const [componentsReady, setComponentsReady] = useState(false);
  const [hasPushed, setHasPushed] = useState(false);
  const [statusTypeId, setStatusTypeId] = useState('');
  const [pendingStatus, setPendingStatus] =
    useState<PendingStatusSelection | null>(null);

  const applicationId = parseInt(id ?? '', 10);

  const { data: submissionData, loading: submissionLoading } =
    useGetSubmissionByApplicationIdQuery({
      variables: { applicationId },
      fetchPolicy: 'network-only',
      skip: !applicationId,
    });

  const { data: applicationData, refetch: refetchApplication } =
    useGetApplicationByIdQuery({
      variables: { applicationId },
      skip: !applicationId,
    });

  const { data: headerData } = useGetHeaderDetailsByApplicationIdQuery({
    variables: { applicationId },
    skip: !applicationId,
  });

  const { data: statusTypesData, loading: statusTypesLoading } =
    useGetApplicationStatusTypesQuery();

  const [updateApplicationStatus, { loading: updatingStatus }] =
    useUpdateApplicationStatusMutation();

  const application = headerData?.getApplicationDetailsById?.data;
  const showLinkPanel = applicationId > 0 && isSdsAppType(application?.appType);

  const applicationDetails =
    applicationData?.getApplicationDetailsById?.data;
  const currentStatusId = applicationDetails?.currentStatus?.id;
  const hasBeenWithdrawn = Boolean(applicationDetails?.hasBeenWithdrawn);

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
    let cancelled = false;
    registerChefsComponents()
      .then(() => {
        if (!cancelled) setComponentsReady(true);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) {
          setError('Form details not found.');
          setComponentsReady(true);
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  const statusTypes = statusTypesData?.getAllStatusTypes ?? [];

  const statusOptions = useMemo(
    () =>
      statusTypes
        .filter((status) => {
          if (!hasBeenWithdrawn) {
            return true;
          }
          // Rejection is once-only: hide WITHDRAWN after it has been used.
          return !isRejectionStatus(status.abbrev);
        })
        .map((status) => ({
          key: String(status.id),
          value: status.description,
        })),
    [statusTypes, hasBeenWithdrawn],
  );

  const commitStatusChange = async (
    nextStatusTypeId: string,
    comment?: string,
  ) => {
    if (!applicationId || !nextStatusTypeId) {
      return false;
    }

    const previousStatusTypeId = statusTypeId;
    setStatusTypeId(nextStatusTypeId);

    try {
      const result = await updateApplicationStatus({
        variables: {
          applicationId,
          statusTypeId: Number(nextStatusTypeId),
          comment: comment ?? null,
        },
        refetchQueries: ['getApplicationById', 'getApplicationDetailsById'],
      });

      if (!result.data?.updateApplicationStatus?.success) {
        setStatusTypeId(previousStatusTypeId);
        notifyError(
          result.data?.updateApplicationStatus?.message ||
            'Failed to update application status.',
        );
        return false;
      }

      await refetchApplication();
      return true;
    } catch {
      setStatusTypeId(previousStatusTypeId);
      notifyError('Failed to update application status.');
      return false;
    }
  };

  const handleStatusChange = async (value: string) => {
    const nextStatusTypeId = String(value ?? '').trim();
    if (!applicationId) {
      return;
    }

    // Empty value is a valid choice, same as the All Applications filter.
    if (!nextStatusTypeId) {
      setStatusTypeId('');
      return;
    }

    const selected = statusTypes.find(
      (status) => String(status.id) === nextStatusTypeId,
    );
    const isSameStatus = nextStatusTypeId === statusTypeId;

    if (isCommentRequiredStatus(selected?.abbrev)) {
      if (hasBeenWithdrawn && isRejectionStatus(selected?.abbrev)) {
        notifyError(
          'This application has already been rejected. The applicant must submit a new application.',
        );
        return;
      }
      // Repeat PEND is allowed (same status + new comment/email). If the
      // dropdown was briefly cleared to allow re-select, put PEND back for
      // display while the modal is open; otherwise leave the prior status.
      if (!statusTypeId) {
        setStatusTypeId(nextStatusTypeId);
      }
      setPendingStatus({
        id: nextStatusTypeId,
        abbrev: selected?.abbrev,
        description: selected?.description,
      });
      return;
    }

    if (isSameStatus) {
      return;
    }

    await commitStatusChange(nextStatusTypeId);
  };

  /**
   * Native <select> does not fire onChange when re-picking the current option.
   * Briefly clear the value when opening the dropdown on PEND so staff can
   * request more information again.
   */
  const handleStatusSelectMouseDown = () => {
    if (
      pendingStatus ||
      updatingStatus ||
      !isMoreInformationStatus(applicationDetails?.currentStatus?.abbrev)
    ) {
      return;
    }
    setStatusTypeId('');
  };

  const restoreCommittedStatus = () => {
    setStatusTypeId(currentStatusId ? String(currentStatusId) : '');
  };

  const handleReasonCancel = () => {
    setPendingStatus(null);
    restoreCommittedStatus();
  };

  const handleReasonConfirm = async (comment: string) => {
    if (!pendingStatus) {
      return;
    }

    const ok = await commitStatusChange(pendingStatus.id, comment);
    if (ok) {
      notifySuccess(
        isRejectionStatus(pendingStatus.abbrev)
          ? 'Application rejected. The applicant has been emailed.'
          : 'Status updated. The applicant has been emailed.',
      );
      setPendingStatus(null);
    }
  };

  if (isLoading || !componentsReady) {
    return <LoadingOverlay loading={isLoading || !componentsReady} />;
  }

  const formName =
    applicationDetails?.appType?.description?.trim() || '';

  return (
    <>
      {showLinkPanel && (
        <>
          <div className="application-link-area">
            {formattedReceivedDate && (
              <p className="application-received-label">
                Application Received: {formattedReceivedDate}
              </p>
            )}
            <LinkToSiteId
              key={applicationId}
              applicationId={applicationId}
              linkedSiteId={application?.siteId ?? null}
              linkedSiteAddress={application?.siteAddress ?? null}
              linkedSiteCity={application?.siteCity ?? null}
              hasBeenPushed={hasPushed}
            />
          </div>
          <div className="application-disclosure-area">
            <SdsDisclosurePreview
              applicationId={applicationId}
              linkedSiteId={application?.siteId}
              onPushStatusChange={setHasPushed}
            />
          </div>
        </>
      )}
      <div className="application-container" id="main">
        <div className="application-form-content application-print-root">
          {formName && (
            <h2
              className="application-form-title print-only"
              data-testid="application-form-title"
            >
              {formName}
            </h2>
          )}
          <div
            className="application-status-bar"
            data-testid="application-status-bar"
          >
            {formattedReceivedDate && (
              <p
                className={`application-received-label${
                  showLinkPanel ? ' print-only' : ''
                }`}
              >
                Application Received: {formattedReceivedDate}
              </p>
            )}
            <div className="application-status-bar__actions no-print">
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
                  isDisabled={
                    statusTypesLoading ||
                    updatingStatus ||
                    Boolean(pendingStatus)
                  }
                  options={statusOptions}
                  onChange={(value) => handleStatusChange(String(value ?? ''))}
                  onMouseDown={handleStatusSelectMouseDown}
                  onBlur={() => {
                    if (!pendingStatus && !statusTypeId) {
                      restoreCommittedStatus();
                    }
                  }}
                />
              </div>
            </div>
          </div>
          {originalSubmissionUrl && originalSubmissionLinkLabel && (
            <p
              className="application-original-submission no-print"
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
                  Application was not submitted through the platform. Please
                  check your file records for reference.
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
        <StatusReasonModal
          isOpen={Boolean(pendingStatus)}
          statusAbbrev={pendingStatus?.abbrev}
          isSubmitting={updatingStatus}
          onCancel={handleReasonCancel}
          onConfirm={handleReasonConfirm}
        />
      </div>
    </>
  );
};
