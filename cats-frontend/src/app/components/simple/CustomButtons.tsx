import React from 'react';
import { FloppyDisk, XmarkIcon } from '../common/icon';
import './CustomButtons.css';

interface ButtonProps {
  clickHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
  label?: string;
  showIcon?: boolean;
}

interface ButtonWithLabelProps {
  clickHandler: (event: any) => void;
  label: string | number;
}

export const SaveButton: React.FC<ButtonProps> = ({
  clickHandler,
  label,
  showIcon,
}) => {
  showIcon = showIcon ?? true;
  return (
    <div className="custom-save-btn" onClick={clickHandler}>
      {showIcon && <FloppyDisk />}
      {label && label !== '' ? label : 'Save'}
    </div>
  );
};

export const CancelButton: React.FC<ButtonProps> = ({
  clickHandler,
  label,
  showIcon,
}) => {
  showIcon = showIcon ?? true;
  return (
    <div className="custom-cancel-btn" onClick={(e) => clickHandler(e)}>
      {showIcon && <XmarkIcon />}
      {label && label !== '' ? label : 'Cancel'}
    </div>
  );
};

export const DiscardButton: React.FC<ButtonProps> = ({
  clickHandler,
  label,
  showIcon,
}) => {
  showIcon = showIcon ?? true;
  return (
    <div className="discard-button-border" onClick={(e) => clickHandler(e)}>
      {showIcon && <XmarkIcon />}
      {label && label !== '' ? label : 'Dicard Changes'}
    </div>
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
