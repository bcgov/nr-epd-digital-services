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
  headerLabel?: string;
  customHeaderCss?: string;
  customHeaderTextCss?: string;
  customFooterCss?: string;
  discardOption?: boolean;
  errorOption?: boolean;
}

const ModalDialog: React.FC<ModalDialogCloseHandlerProps> = ({
  closeHandler,
  children,
  label,
  saveBtnLabel,
  cancelBtnLabel,
  dicardBtnLabel,
  discardOption,
  errorOption,
  headerLabel,
  customHeaderCss,
  customHeaderTextCss,
  customFooterCss,
}) => {
  saveBtnLabel = saveBtnLabel ?? '';
  cancelBtnLabel = cancelBtnLabel ?? '';
  dicardBtnLabel = dicardBtnLabel ?? '';

  const [open, setOpen] = useState<boolean>(true);
  const displayLabel = label ?? '';

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
        <ModalDialogWrapper closeHandler={handleClose}>
          <div className={`${customHeaderCss || 'custom-modal-header'}`}>
            <span
              className={`${customHeaderTextCss || 'custom-modal-header-text'}`}
            >
              {headerLabel || displayLabel}
            </span>
            <XmarkIcon
              className="custom-modal-header-close"
              onClick={handleClose}
            ></XmarkIcon>
          </div>
          {children && <div className="custom-modal-data">{children}</div>}
          {!discardOption && !errorOption && (
            <div
              className={`${customFooterCss || 'custom-modal-actions-footer'}`}
            >
              <CancelButton
                variant="tertiary"
                clickHandler={handleClose}
                label={cancelBtnLabel}
              />
              <SaveButton
                variant="primary"
                clickHandler={handleSave}
                label={saveBtnLabel}
              />
            </div>
          )}
          {discardOption && (
            <div
              className={`${customFooterCss || 'custom-modal-actions-footer'}`}
            >
              <CancelButton
                variant="tertiary"
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
          {errorOption && (
            <div
              className={`${customFooterCss || 'custom-modal-actions-footer'}`}
            >
              <CancelButton clickHandler={handleClose} label={cancelBtnLabel} />
            </div>
          )}
        </ModalDialogWrapper>
      )}
    </div>
  );
};

export default ModalDialog;

export const ModalDialogWrapper: React.FC<ModalDialogCloseHandlerProps> = ({
  closeHandler,
  children,
}) => {
  return (
    <div>
      <div className="custom-modal">
        <div className="custom-modal-content">{children}</div>
      </div>
    </div>
  );
};

export const ModalDialogHeaderOnly: React.FC<ModalDialogCloseHandlerProps> = ({
  closeHandler,
  children,
}) => {
  return <div className="custom-modal-header">{children}</div>;
};

export const ModalDialogWrapperWithHeader: React.FC<
  ModalDialogCloseHandlerProps
> = ({ closeHandler, children }) => {
  return (
    <div>
      <ModalDialogWrapper closeHandler={ModalDialogHeaderOnly}>
        <ModalDialogHeaderOnly closeHandler={ModalDialogHeaderOnly}>
          {children}
        </ModalDialogHeaderOnly>
      </ModalDialogWrapper>
    </div>
  );
};
