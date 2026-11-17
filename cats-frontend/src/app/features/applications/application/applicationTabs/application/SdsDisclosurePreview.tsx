import { useEffect, useState } from 'react';
import { Button } from '../../../../../components/button/Button';
import { formatDateUTC } from '../../../../../helpers/utility';
import { buildSiteRegistryDisclosureTabUrl } from '../../ApplicationActionsConfig';
import { SdsDisclosureDetails } from './SdsDisclosureDetails';
import { PushSiteDisclosureModal } from './PushSiteDisclosureModal';
import { useGetSdsDisclosurePreviewQuery } from './SdsDisclosurePreview.generated';
import styles from './SdsDisclosurePreview.module.css';

type SdsDisclosurePreviewProps = {
  applicationId: number;
  linkedSiteId?: number | null;
  onPushStatusChange?: (hasBeenPushed: boolean) => void;
};

type LastPush = {
  siteId: number;
  lastPushedAt: string;
};

const formatPushedAt = (value: string): string =>
  formatDateUTC(value, 'yyyy/MM/dd HH:mm');

export const SdsDisclosurePreview: React.FC<SdsDisclosurePreviewProps> = ({
  applicationId,
  linkedSiteId: linkedSiteIdProp,
  onPushStatusChange,
}) => {
  const [lastPush, setLastPush] = useState<LastPush | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, loading, error } = useGetSdsDisclosurePreviewQuery({
    variables: { applicationId },
    fetchPolicy: 'network-only',
    skip: !applicationId,
  });

  const response = data?.getSdsDisclosurePreview;
  const preview = response?.data;
  const disclosure = preview?.disclosure;

  const linkedSiteId =
    linkedSiteIdProp !== undefined
      ? linkedSiteIdProp
      : (preview?.siteId ?? null);
  const lastPushedSiteId =
    lastPush?.siteId ?? preview?.lastPushedSiteId ?? null;
  const lastPushedAt = lastPush?.lastPushedAt ?? preview?.lastPushedAt ?? null;

  useEffect(() => {
    onPushStatusChange?.(lastPushedAt != null);
  }, [lastPushedAt, onPushStatusChange]);

  const errorMessage = error
    ? 'Site disclosure preview could not be loaded.'
    : response?.success === false
      ? response?.message || 'Site disclosure preview could not be loaded.'
      : null;

  const siteDisclosureUrl = buildSiteRegistryDisclosureTabUrl(linkedSiteId);

  return (
    <section className={styles.section} data-testid="sds-disclosure-preview">
      <h2 className={styles.heading}>Site Disclosure Statement</h2>

      {errorMessage ? (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      ) : loading && !disclosure ? (
        <p className={styles.loading} role="status">
          Loading site disclosure…
        </p>
      ) : (
        <>
          <SdsDisclosureDetails disclosure={disclosure} />

          <div className={styles.pushArea}>
            <div className={styles.pushRow}>
              <Button
                type="button"
                onClick={() => setModalOpen(true)}
                disabled={linkedSiteId == null}
                data-testid="push-button"
              >
                Push to Site Registry
              </Button>
              {linkedSiteId == null && (
                <span
                  className={styles.disabledReason}
                  data-testid="push-disabled-reason"
                >
                  Link a Site ID before pushing this disclosure.
                </span>
              )}
            </div>

            {lastPushedAt != null && (
              <div className={styles.lastPushed} data-testid="last-pushed">
                <p className={styles.lastPushedText}>
                  Last pushed to Site ID {lastPushedSiteId} on{' '}
                  {formatPushedAt(lastPushedAt)}
                </p>
                {siteDisclosureUrl && (
                  <a
                    className={styles.lastPushedLink}
                    href={siteDisclosureUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="site-disclosure-link"
                  >
                    View disclosures in Site Registry
                  </a>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {modalOpen && linkedSiteId != null && (
        <PushSiteDisclosureModal
          applicationId={applicationId}
          siteId={linkedSiteId}
          disclosure={disclosure}
          onClose={() => setModalOpen(false)}
          onPushed={(result) => {
            setLastPush(result);
            setModalOpen(false);
          }}
        />
      )}
    </section>
  );
};
