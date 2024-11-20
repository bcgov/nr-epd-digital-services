import React, { Children, ReactNode, useState } from 'react';
import './ModalDialog.css';
import { XmarkIcon, FloppyDisk } from '../common/icon';
import {
  CancelButton,
  DiscardButton,
  SaveButton,
} from '../simple/CustomButtons';

interface ModalDialogCloseHandlerProps {
  closeHandler: (save: any) => void;
  children?: ReactNode;
  label?: string;
  saveBtnLabel?: string;
  cancelBtnLabel?: string;
  dicardBtnLabel?: string;
  discardOption?: boolean;
}

const ModalDialog: React.FC<ModalDialogCloseHandlerProps> = ({
  closeHandler,
  children,
  label,
  saveBtnLabel,
  cancelBtnLabel,
  dicardBtnLabel,
  discardOption,
}) => {
  saveBtnLabel = saveBtnLabel ?? '';
  cancelBtnLabel = cancelBtnLabel ?? '';
  dicardBtnLabel = dicardBtnLabel ?? '';

  const [open, setOpen] = useState<boolean>(true);
  const displayLabel =
    label ?? 'Are you sure you want to commit changes to this site?';

  const handleClose = () => {
    setOpen(false);
    closeHandler(false);
  };

  const handleDiscard = () => {
    setOpen(false);
    closeHandler('discard');
  };

  const handleSave = () => {
    // Add save logic here
    setOpen(false);
    closeHandler(true);
  };

  return (
    <div>
      {open && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <div className="custom-modal-header">
              <span className="custom-modal-header-text">{displayLabel}</span>
              <XmarkIcon
                className="custom-modal-header-close"
                onClick={handleClose}
              ></XmarkIcon>
            </div>
            {children && <div className="custom-modal-data">{children}</div>}
            {!discardOption && (
              <div className="custom-modal-actions-footer">
                <CancelButton
                  clickHandler={handleClose}
                  label={cancelBtnLabel}
                />
                <SaveButton clickHandler={handleSave} label={saveBtnLabel} />
              </div>
            )}
            {discardOption && (
              <div className="custom-modal-actions-footer">
                <CancelButton
                  clickHandler={handleClose}
                  label={cancelBtnLabel}
                />
                <DiscardButton
                  clickHandler={handleDiscard}
                  label={dicardBtnLabel}
                  showIcon={false}
                />
                <SaveButton clickHandler={handleSave} label={saveBtnLabel} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalDialog;
