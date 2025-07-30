import React, { Children, ReactNode, useState } from 'react';
import './ModalDialog.css';
import { XmarkIcon, FloppyDisk } from '../common/icon';
import {
  CancelButton,
  DiscardButton,
  SaveButton,
} from '../simple/CustomButtons';
import { Button, ButtonVariant } from '../button/Button';

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
  cancelButtonVariant?: ButtonVariant;
  saveButtonVariant?: ButtonVariant;
  discardButtonVariant?: ButtonVariant;
  cancelButtonDisabled?: boolean;
  saveButtonDisabled?: boolean;
  discardButtonDisabled?: boolean;
  noFooterOptions?: boolean;
  showTickIcon?: boolean;
  showIcon?: boolean;
  validator?: () => boolean;
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
  saveButtonVariant,
  cancelButtonVariant,
  discardButtonVariant,
  discardButtonDisabled,
  cancelButtonDisabled,
  saveButtonDisabled,
  noFooterOptions,
  showTickIcon = false,
  showIcon = true,
  validator,
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
    if (validator && !validator()) {
      return;
    }

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
            <Button
              variant="tertiary"
              className="custom-modal-header-close"
              onClick={handleClose}
              disabled={cancelButtonDisabled}
            >
              <XmarkIcon />
            </Button>
          </div>
          {children && <div className="custom-modal-data">{children}</div>}
          {!noFooterOptions && !discardOption && !errorOption && (
            <div
              className={`${customFooterCss || 'custom-modal-actions-footer'}`}
            >
              <CancelButton
                variant={cancelButtonVariant ?? 'tertiary'}
                clickHandler={handleClose}
                label={cancelBtnLabel}
                isDisabled={cancelButtonDisabled}
              />
              <SaveButton
                variant={saveButtonVariant ?? 'primary'}
                clickHandler={handleSave}
                label={saveBtnLabel}
                isDisabled={saveButtonDisabled}
                showTickIcon={showTickIcon}
                showIcon={showIcon}
              />
            </div>
          )}
          {!noFooterOptions && discardOption && (
            <div
              className={`${customFooterCss || 'custom-modal-actions-footer'}`}
            >
              <CancelButton
                variant={cancelButtonVariant ?? 'tertiary'}
                clickHandler={handleClose}
                label={cancelBtnLabel}
                isDisabled={cancelButtonDisabled}
              />
              <DiscardButton
                clickHandler={handleDiscard}
                label={dicardBtnLabel}
                showIcon={false}
                variant={discardButtonVariant}
                isDisabled={discardButtonDisabled}
              />
              <SaveButton
                clickHandler={handleSave}
                label={saveBtnLabel}
                variant={saveButtonVariant}
                isDisabled={saveButtonDisabled}
              />
            </div>
          )}
          {!noFooterOptions && errorOption && (
            <div
              className={`${customFooterCss || 'custom-modal-actions-footer'}`}
            >
              <CancelButton
                clickHandler={handleClose}
                label={cancelBtnLabel}
                variant={cancelButtonVariant}
                isDisabled={cancelButtonDisabled}
              />
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
