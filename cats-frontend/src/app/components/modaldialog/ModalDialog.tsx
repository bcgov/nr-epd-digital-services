import React, { ReactNode, useState } from 'react';
import './ModalDialog.css';
import { XmarkIcon } from '../common/icon';
import {
  CancelButton,
  DiscardButton,
  SaveButton,
} from '../simple/CustomButtons';
import { Button, ButtonVariant } from '../button/Button';
import clsx from 'clsx';

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
  customChildrenCss?: string;
  customModalCss?: string;
  customContentCss?: string;
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
  customSaveIcon?: React.ReactNode;
  customCancelIcon?: React.ReactNode;
  customDiscardIcon?: React.ReactNode;
  validator?: () => boolean;
  discardHandler?: () => void;
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
  customChildrenCss,
  customModalCss,
  customContentCss,
  saveButtonVariant,
  cancelButtonVariant,
  discardButtonVariant,
  discardButtonDisabled,
  cancelButtonDisabled,
  saveButtonDisabled,
  noFooterOptions,
  showTickIcon = false,
  showIcon = true,
  customSaveIcon,
  customCancelIcon,
  customDiscardIcon,
  validator,
  discardHandler,
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
    // Add discard logic here
    if (discardHandler) {
      discardHandler();
    }
    else {
      // Close the modal after discarding
      setOpen(false);
      closeHandler('discard');
    }
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
        <ModalDialogWrapper
          customModalCss={customModalCss}
          customContentCss={customContentCss}
          closeHandler={handleClose}
        >
          <div className={clsx('custom-modal-header', customHeaderCss)}>
            <span
              className={clsx('custom-modal-header-text', customHeaderTextCss)}
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
          {children && (
            <div className={clsx('custom-modal-data', customChildrenCss)}>
              {children}
            </div>
          )}
          {!noFooterOptions && !discardOption && !errorOption && (
            <div
              className={clsx('custom-modal-actions-footer', customFooterCss)}
            >
              <CancelButton
                variant={cancelButtonVariant ?? 'tertiary'}
                clickHandler={handleClose}
                label={cancelBtnLabel}
                isDisabled={cancelButtonDisabled}
                showIcon={showIcon}
                customIcon={customCancelIcon}
              />
              <SaveButton
                variant={saveButtonVariant ?? 'primary'}
                clickHandler={handleSave}
                label={saveBtnLabel}
                isDisabled={saveButtonDisabled}
                showTickIcon={showTickIcon}
                showIcon={showIcon}
                customIcon={customSaveIcon}
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
                showIcon={showIcon}
                customIcon={customCancelIcon}
              />
              <DiscardButton
                clickHandler={handleDiscard}
                label={dicardBtnLabel}
                showIcon={false}
                variant={discardButtonVariant}
                isDisabled={discardButtonDisabled}
                customIcon={customDiscardIcon}
              />
              <SaveButton
                clickHandler={handleSave}
                label={saveBtnLabel}
                variant={saveButtonVariant}
                isDisabled={saveButtonDisabled}
                showTickIcon={showTickIcon}
                showIcon={showIcon}
                customIcon={customSaveIcon}
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
                showIcon={showIcon}
                customIcon={customCancelIcon}
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
  customModalCss,
  customContentCss,
}) => {
  return (
    <div>
      <div className={clsx('custom-modal', customModalCss)}>
        <div className={clsx('custom-modal-content', customContentCss)}>
          {children}
        </div>
      </div>
    </div>
  );
};

export const ModalDialogHeaderOnly: React.FC<ModalDialogCloseHandlerProps> = ({
  closeHandler,
  children,
  customHeaderCss,
}) => {
  return (
    <div className={clsx('custom-modal-header', customHeaderCss)}>
      {children}
    </div>
  );
};

export const ModalDialogWrapperWithHeader: React.FC<
  ModalDialogCloseHandlerProps
> = ({
  closeHandler,
  children,
  customHeaderCss,
  customModalCss,
  customContentCss,
}) => {
  return (
    <div>
      <ModalDialogWrapper
        closeHandler={ModalDialogHeaderOnly}
        customModalCss={customModalCss}
        customContentCss={customContentCss}
      >
        <ModalDialogHeaderOnly
          closeHandler={ModalDialogHeaderOnly}
          customHeaderCss={customHeaderCss}
        >
          {children}
        </ModalDialogHeaderOnly>
      </ModalDialogWrapper>
    </div>
  );
};
