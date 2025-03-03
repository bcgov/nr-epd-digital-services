import { ReactElement } from 'react';
import { ButtonSize, ButtonVariant } from '../button/Button';

export interface DropdownItem {
  label: string;
  value: any;
}

export interface IActions {
  label: string;
  items: Array<DropdownItem | ReactElement>;
  disable?: boolean;
  customCssToggleBtn?: string;
  customCssMenu?: string;
  customCssMenuItem?: string;
  onItemClick: (value: string, index?: any) => void;
  toggleButtonVariant?: ButtonVariant;
  toggleButtonSize?: ButtonSize;
}
