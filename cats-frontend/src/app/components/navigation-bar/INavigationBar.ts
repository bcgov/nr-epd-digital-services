import { ReactNode } from 'react';

export interface NavigationBarProps {
  isVisible: boolean;
  backButtonText: any;
  backButtonProps?: any;
  onClickBackButton?: () => void;
  navigationBarText?: any;
  customContainerCss?: string;
  customNavigationBarTxtCss?: string;
  customChildernCss?: string;
  childern?: any;
  buttonIcon?: ReactNode;
}
