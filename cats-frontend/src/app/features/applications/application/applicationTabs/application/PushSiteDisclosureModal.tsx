import { useState } from 'react';
import { Button } from '../../../../../components/button/Button';
import { ModalDialogWrapper } from '../../../../../components/modaldialog/ModalDialog';
import { XmarkIcon } from '../../../../../components/common/icon';
import { SdsDisclosureDetails, SdsDisclosure } from './SdsDisclosureDetails';
import { usePushSiteDisclosureMutation } from './PushSiteDisclosure.generated';
import styles from './PushSiteDisclosureModal.module.css';

const DUPLICATE_ERROR_CODE = 'DUPLICATE_DATE_COMPLETED';
const DUPLICATE_MESSAGE =
  'A disclosure already exists for this site with the same Date Completed. Site Registry did not create another one. Review the date and try again when appropriate.';

type PushSiteDisclosureModalProps = {
  applicationId: number;
  siteId: number;
  disclosure?: SdsDisclosure | null;
  onClose: () => void;
  onPushed: (result: { siteId: number; lastPushedAt: string }) => void;
};

export const PushSiteDisclosureModal: React.FC<
  PushSiteDisclosureModalProps
> = ({ applicationId, siteId, disclosure, onClose, onPushed }) => {
  const [error, setError] = useState<string | null>(null);
  const [pushSiteDisclosure, { loading }] = usePushSiteDisclosureMutation();

  const handleConfirm = async () => {
    setError(null);

    try {
      const response = await pushSiteDisclosure({
        variables: { applicationId },
      });

      const payload = response.data?.pushSiteDisclosure;

      if (!payload?.success) {
        setError(
          payload?.errorCode === DUPLICATE_ERROR_CODE
            ? DUPLICATE_MESSAGE
            : payload?.message || 'Unable to push the disclosure to SITE',
        );
        return;
      }

      const pushedSiteId = payload.data?.siteId ?? siteId;
      const lastPushedAt = payload.data?.lastPushedAt;
      if (!lastPushedAt) {
        setError('Site Registry did not confirm the push. Please try again.');
        return;
      }

      onPushed({ siteId: pushedSiteId, lastPushedAt });
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to push the disclosure to SITE',
      );
    }
  };

  return (
    <ModalDialogWrapper
      closeHandler={onClose}
      customModalCss={styles.modal}
      customContentCss={styles.modalContent}
    >
      <div className="custom-modal-header">
        <span className="custom-modal-header-text">Push to Site Registry</span>
        <Button
          variant="tertiary"
          className="custom-modal-header-close"
          onClick={onClose}
          disabled={loading}
          aria-label="Close"
        >
          <XmarkIcon />
        </Button>
      </div>

      <div className="custom-modal-data">
        <p className={styles.confirmation} data-testid="push-confirmation">
          This will add a <strong>new</strong> disclosure to Site ID {siteId} in
          Site Registry. Existing SITE disclosures are not updated or merged.
        </p>

        <SdsDisclosureDetails disclosure={disclosure} />

        {error && (
          <p className={styles.error} role="alert" data-testid="push-error">
            {error}
          </p>
        )}
      </div>

      <div className="custom-modal-actions-footer">
        <Button variant="tertiary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={loading}>
          {loading ? 'Pushing…' : 'Push'}
        </Button>
      </div>
    </ModalDialogWrapper>
  );
};
