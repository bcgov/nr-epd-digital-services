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
  customIcon?: React.ReactNode;
}

interface ButtonWithLabelProps {
  clickHandler: (event: any) => void;
  label: string | number;
  customIcon?: React.ReactNode;
}

export const SaveButton: React.FC<ButtonProps> = ({
  clickHandler,
  label = 'Save',
  showIcon,
  variant,
  isDisabled,
  showTickIcon = false,
  customIcon = showTickIcon ? <TickIcon /> : <FloppyDisk />,
}) => {
  showIcon = showIcon ?? true;
  return (
    <Button variant={variant} onClick={clickHandler} disabled={isDisabled}>
      {customIcon}
      {label}
    </Button>
  );
};

export const CancelButton: React.FC<ButtonProps> = ({
  clickHandler,
  label = 'Cancel',
  showIcon,
  variant,
  isDisabled,
  customIcon = <XmarkIcon />,
}) => {
  showIcon = showIcon ?? true;
  return (
    <Button variant={variant} onClick={clickHandler} disabled={isDisabled}>
      {showIcon && customIcon}
      {label}
    </Button>
  );
};

export const DiscardButton: React.FC<ButtonProps> = ({
  clickHandler,
  label = 'Discard Changes',
  showIcon,
  customIcon = <XmarkIcon />,
}) => {
  showIcon = showIcon ?? true;
  return (
    <Button variant="secondary" onClick={clickHandler}>
      {showIcon && customIcon}
      {label}
    </Button>
  );
};

export const CustomPillButton: React.FC<ButtonWithLabelProps> = ({
  clickHandler,
  label,
  customIcon = <XmarkIcon className="custom-pill-close-btn" />,
}) => {
  return (
    <div className="custom-pill-button" onClick={(e) => clickHandler(label)}>
      <span className="custom-pill-button-label">{label}</span>
      {customIcon}
    </div>
  );
};
