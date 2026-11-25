import { FC, useEffect, useState } from 'react';
import ModalDialog from '../../../../components/modaldialog/ModalDialog';
import { notifyError } from '../../../../components/alert/Alert';
import { getStatusReasonModalCopy } from '../statusCommentPolicy';

type StatusReasonModalProps = {
  isOpen: boolean;
  statusAbbrev?: string | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: (comment: string) => Promise<void> | void;
};

const StatusReasonModal: FC<StatusReasonModalProps> = ({
  isOpen,
  statusAbbrev,
  isSubmitting = false,
  onCancel,
  onConfirm,
}) => {
  const [comment, setComment] = useState('');
  const copy = getStatusReasonModalCopy(statusAbbrev);

  useEffect(() => {
    if (isOpen) {
      setComment('');
    }
  }, [isOpen, statusAbbrev]);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalDialog
      headerLabel={copy.title}
      cancelBtnLabel="Cancel"
      saveBtnLabel={copy.confirmLabel}
      cancelButtonDisabled={isSubmitting}
      saveButtonDisabled={isSubmitting}
      validator={() => {
        if (!comment.trim()) {
          notifyError('Enter a comment before confirming.');
          return false;
        }
        return true;
      }}
      closeHandler={async (saved) => {
        if (!saved) {
          setComment('');
          onCancel();
          return;
        }

        await onConfirm(comment.trim());
      }}
    >
      <p className="mb-3">{copy.helpText}</p>
      <label className="form-label" htmlFor="status-reason-comment">
        Comment <span className="text-danger">*</span>
      </label>
      <textarea
        id="status-reason-comment"
        className="form-control"
        rows={5}
        value={comment}
        disabled={isSubmitting}
        placeholder="Enter the reason for the applicant."
        onChange={(event) => setComment(event.target.value)}
      />
    </ModalDialog>
  );
};

export default StatusReasonModal;
