import { Button } from '../button/Button';
import { AngleLeft } from '../common/icon';
import { NavigationBarProps } from './INavigationBar';
import './NavigationBar.css';

const NavigationBar: React.FC<NavigationBarProps> = ({
  isVisible,
  backButtonText,
  backButtonProps,
  navigationBarText,
  customContainerCss,
  customNavigationBarTxtCss,
  customChildernCss,
  childern,
  onClickBackButton,
  buttonIcon,
}) => {
  return (
    <div
      className={`d-flex justify-content-between align-items-center ${isVisible ? 'custom-navigation-bar-sticky-header' : 'custom-navigation-bar-header'} w-100 ${customContainerCss ?? ''}`}
    >
      <div className="d-flex gap-4 flex-wrap align-items-center">
        <Button onClick={onClickBackButton} {...backButtonProps}>
          {buttonIcon || <AngleLeft />}
          {backButtonText}
        </Button>
        <div
          className={`d-flex flex-wrap align-items-center pe-3 custom-navigation-bar-sticky-header-lbl ${customNavigationBarTxtCss ?? ''}`}
        >
          {navigationBarText}
        </div>
      </div>

      <div
        className={`d-flex gap-2 justify-align-center pe-2 position-relative ${customChildernCss ?? ''}`}
      >
        {childern}
      </div>
    </div>
  );
};

export default NavigationBar;
