import { useState } from 'react';
import { Button } from '../../../../../components/button/Button';
import ModalDialog from '../../../../../components/modaldialog/ModalDialog';
import { GetHeaderDetailsByApplicationIdDocument } from '../../ApplicationDetails.generated';
import { useLinkApplicationSiteIdMutation } from './LinkToSiteId.generated';
import styles from './LinkToSiteId.module.css';

const NUMERIC_SITE_ID = /^\d+$/;
const MAX_STORABLE_SITE_ID = 2147483647;
const UNLINKED_MESSAGE =
  'Submission Address, PID, PIN not linked to any Site ID';

type LinkToSiteIdProps = {
  applicationId: number;
  linkedSiteId?: number | null;
  linkedSiteAddress?: string | null;
  linkedSiteCity?: string | null;
  hasBeenPushed?: boolean;
};

const formatLocation = (
  siteAddress?: string | null,
  siteCity?: string | null,
): string | null => {
  const parts = [siteAddress?.trim(), siteCity?.trim()].filter(
    (part): part is string => Boolean(part),
  );
  return parts.length ? parts.join(', ') : null;
};

export const LinkToSiteId: React.FC<LinkToSiteIdProps> = ({
  applicationId,
  linkedSiteId = null,
  linkedSiteAddress = null,
  linkedSiteCity = null,
  hasBeenPushed = false,
}) => {
  const [siteIdInput, setSiteIdInput] = useState(
    linkedSiteId != null ? String(linkedSiteId) : '',
  );
  const [savedSiteId, setSavedSiteId] = useState<number | null>(
    linkedSiteId ?? null,
  );
  const [savedLocation, setSavedLocation] = useState<string | null>(
    formatLocation(linkedSiteAddress, linkedSiteCity),
  );
  const [noticeDismissed, setNoticeDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingChange, setPendingChange] = useState<string | null>(null);

  const [linkSiteId, { loading }] = useLinkApplicationSiteIdMutation();

  const validate = (value: string): string | null => {
    if (value !== '' && !NUMERIC_SITE_ID.test(value)) {
      return 'Site ID must be a number';
    }

    if (value !== '') {
      const numeric = Number(value);
      if (
        !Number.isSafeInteger(numeric) ||
        numeric < 1 ||
        numeric > MAX_STORABLE_SITE_ID
      ) {
        return 'Site ID is out of range';
      }
    }

    return null;
  };

  const performLink = async (value: string) => {
    try {
      const response = await linkSiteId({
        variables: { applicationId, siteId: value },
        refetchQueries: [
          {
            query: GetHeaderDetailsByApplicationIdDocument,
            variables: { applicationId },
          },
        ],
        awaitRefetchQueries: true,
      });

      const payload = response.data?.linkApplicationSiteId;
      if (!payload?.success) {
        setError(payload?.message || 'Unable to link Site ID');
        return;
      }

      setSavedSiteId(payload.data?.siteId ?? null);
      setSavedLocation(
        formatLocation(payload.data?.siteAddress, payload.data?.siteCity),
      );
      setNoticeDismissed(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to link Site ID');
    }
  };

  const handleSave = () => {
    const trimmed = siteIdInput.trim();
    setError(null);

    const validationError = validate(trimmed);
    if (validationError) {
      setError(validationError);
      return;
    }

    const currentValue = savedSiteId != null ? String(savedSiteId) : '';
    if (hasBeenPushed && trimmed !== currentValue) {
      setPendingChange(trimmed);
      return;
    }

    performLink(trimmed);
  };

  const showUnlinkedNotice = savedSiteId == null && !noticeDismissed;

  return (
    <section className={styles.section}>
      {showUnlinkedNotice && (
        <div className={styles.notice} role="status">
          <svg
            className={styles.noticeIcon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M12 2 1 21h22L12 2Zm1 15h-2v-2h2v2Zm0-4h-2V8h2v5Z"
            />
          </svg>
          <span className={styles.noticeText}>{UNLINKED_MESSAGE}</span>
          <button
            type="button"
            className={styles.dismiss}
            aria-label="Dismiss"
            onClick={() => setNoticeDismissed(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M18.3 5.71 12 12.01l-6.3-6.3-1.41 1.41 6.3 6.3-6.3 6.3 1.41 1.41 6.3-6.3 6.3 6.3 1.41-1.41-6.3-6.3 6.3-6.3-1.41-1.41Z"
              />
            </svg>
          </button>
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="link-to-site-id-input">
          Link to Site ID
        </label>
        <div className={styles.row}>
          <input
            id="link-to-site-id-input"
            className={`form-control ${styles.input}`}
            placeholder="12345"
            inputMode="numeric"
            autoComplete="off"
            value={siteIdInput}
            onChange={(event) => {
              setSiteIdInput(event.target.value);
              setError(null);
            }}
          />
          <Button type="button" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving…' : savedSiteId == null ? 'Link' : 'Save'}
          </Button>
        </div>
      </div>

      {savedSiteId != null && (
        <p className={styles.current} data-testid="site-id-current">
          Linked to Site ID {savedSiteId}
          {savedLocation ? ` — ${savedLocation}` : ''}
        </p>
      )}

      {error && (
        <p className={styles.error} role="alert" data-testid="site-id-error">
          {error}
        </p>
      )}

      {pendingChange !== null && (
        <ModalDialog
          headerLabel="Change linked Site ID?"
          cancelBtnLabel="Cancel"
          saveBtnLabel="Confirm"
          closeHandler={(save: any) => {
            const value = pendingChange;
            setPendingChange(null);
            if (save === true && value !== null) {
              performLink(value);
            }
          }}
        >
          <p data-testid="change-site-confirmation">
            Disclosures already pushed stay on the previously linked site.
            Changing or unlinking the Site ID does not move, update, or delete
            any Site Registry records.
          </p>
        </ModalDialog>
      )}
    </section>
  );
};
