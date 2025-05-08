import React from 'react';
import { FloppyDisk, TickIcon, XmarkIcon } from '../common/icon';
import './CustomButtons.css';
import { Button, ButtonVariant } from '../button/Button';

interface ButtonProps {
  clickHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
  showIcon?: boolean;
  isDisabled?: boolean;
  variant?: ButtonVariant;
  showTickIcon?: boolean;
}

interface ButtonWithLabelProps {
  clickHandler: (event: any) => void;
  label: string | number;
}

export const SaveButton: React.FC<ButtonProps> = ({
  clickHandler,
  label,
  showIcon,
  variant,
  isDisabled,
  showTickIcon = false,
}) => {
  showIcon = showIcon ?? true;
  return (
    <Button variant={variant} onClick={clickHandler} disabled={isDisabled}>
      {!showTickIcon && showIcon && <FloppyDisk />}
      {showTickIcon && showIcon && <TickIcon />}
      {label && label !== '' ? label : 'Save'}
    </Button>
  );
};

export const CancelButton: React.FC<ButtonProps> = ({
  clickHandler,
  label,
  showIcon,
  variant,
  isDisabled,
}) => {
  showIcon = showIcon ?? true;
  return (
    <Button variant={variant} onClick={clickHandler} disabled={isDisabled}>
      {showIcon && <XmarkIcon />}
      {label && label !== '' ? label : 'Cancel'}
    </Button>
  );
};

export const DiscardButton: React.FC<ButtonProps> = ({
  clickHandler,
  label,
  showIcon,
}) => {
  showIcon = showIcon ?? true;
  return (
    <Button variant="secondary" onClick={clickHandler}>
      {showIcon && <XmarkIcon />}
      {label && label !== '' ? label : 'Dicard Changes'}
    </Button>
  );
};

export const CustomPillButton: React.FC<ButtonWithLabelProps> = ({
  clickHandler,
  label,
}) => {
  return (
    <div className="custom-pill-button" onClick={(e) => clickHandler(label)}>
      <span className="custom-pill-button-label">{label}</span>
      <XmarkIcon className="custom-pill-close-btn" />
    </div>
  );
};
