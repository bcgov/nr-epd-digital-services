import React, { useState } from 'react';
import { Button } from '../../components/button/Button';
import {
  useGetManualIntakeFormsQuery,
  useProcessChefsSubmissionManuallyMutation,
} from './graphql/formIntake.generated';

const FormIntake: React.FC = () => {
  const [appTypeAbbrev, setAppTypeAbbrev] = useState('');
  const [chefsSubmissionId, setChefsSubmissionId] = useState('');
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const { data: formsData, loading: formsLoading } =
    useGetManualIntakeFormsQuery();
  const [processSubmission, { loading: processing }] =
    useProcessChefsSubmissionManuallyMutation();

  const forms = formsData?.getManualIntakeForms?.data ?? [];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setResult(null);

    try {
      const response = await processSubmission({
        variables: {
          appTypeAbbrev,
          chefsSubmissionId: chefsSubmissionId.trim(),
        },
      });
      const payload = response.data?.processChefsSubmissionManually;
      const applicationId = payload?.data?.applicationId;

      setResult({
        success: !!payload?.success,
        message: payload?.success
          ? `${payload?.message ?? 'Submission processed'}${
              applicationId ? ` (application ${applicationId})` : ''
            }`
          : (payload?.message ?? 'Failed to process submission'),
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: error?.message ?? 'Failed to process submission',
      });
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '640px' }}>
      <h1 className="h4 mb-2">Manual form intake</h1>
      <p className="text-muted">
        Fetch a CHEFS submission by ID and run it through the standard intake
        process.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="form-intake-form">
            Form
          </label>
          <select
            id="form-intake-form"
            className="form-select"
            value={appTypeAbbrev}
            onChange={(e) => setAppTypeAbbrev(e.target.value)}
            disabled={formsLoading}
            required
          >
            <option value="">Select a form</option>
            {forms.map((form) => (
              <option key={form.appTypeAbbrev} value={form.appTypeAbbrev}>
                {form.displayName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="form-intake-submission-id">
            CHEFS submission ID
          </label>
          <input
            id="form-intake-submission-id"
            className="form-control"
            value={chefsSubmissionId}
            onChange={(e) => setChefsSubmissionId(e.target.value)}
            placeholder="00000000-0000-0000-0000-000000000000"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={processing || !appTypeAbbrev || !chefsSubmissionId.trim()}
        >
          {processing ? 'Processing…' : 'Process submission'}
        </Button>
      </form>

      {result && (
        <div
          className={`alert mt-3 ${result.success ? 'alert-success' : 'alert-danger'}`}
          role="alert"
        >
          {result.message}
        </div>
      )}
    </div>
  );
};

export default FormIntake;
