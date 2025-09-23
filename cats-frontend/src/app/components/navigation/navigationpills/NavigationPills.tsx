import React, { useCallback, useMemo, useEffect } from 'react';
import './NavigationPills.css';
import { INavigationPills } from './INavigationPills';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Actions from '../../action/Actions';
import { Button } from '../../button/Button';

import { navigationItems } from '../../../features/navigation/NavigationPillsConfig';

const NavigationPills: React.FC<INavigationPills> = ({ disabled = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const currentPath = useMemo(() => {
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    const currentComponent = navigationItems.find(
      (item) => item.path === lastSegment,
    );
    return currentComponent?.path || navigationItems[0].path;
  }, [location.pathname]);

  useEffect(() => {
    if (
      id &&
      !navigationItems.some((item) => location.pathname.endsWith(item.path))
    ) {
      const newPath = `${location.pathname}/${navigationItems[0].path}`;
      navigate(newPath, { replace: true });
    }
  }, [location.pathname, navigate, id]);

  const handlePillClick = (tabKey: string) => {
    const component = navigationItems.find((item) => item.value === tabKey);
    if (component) {
      const currentPathSegments = location.pathname.split('/');
      currentPathSegments.pop();
      const newPath = `${currentPathSegments.join('/')}/${component.path}`;
      navigate(newPath);
    }
  };

  const getCurrentElementIndex = useCallback(() => {
    const currentComponentIndex = navigationItems.findIndex(
      (tab: any) => tab.path === currentPath,
    );

    return currentComponentIndex;
  }, [currentPath]);

  const isActiveTabFirstPosition = () => {
    return getCurrentElementIndex() === 0;
  };

  const isActiveTabLastPosition = () => {
    return getCurrentElementIndex() + 1 === navigationItems.length;
  };

  const getNextElement = () => {
    const currentComponentindex = getCurrentElementIndex();
    return navigationItems[currentComponentindex + 1].value;
  };

  const getPreviousElement = () => {
    const currentComponentindex = getCurrentElementIndex();
    return navigationItems[currentComponentindex - 1].value;
  };

  return (
    <div>
      <div className="d-flex d-xxl-flex d-xl-flex gap-2 d-none">
        {navigationItems.map((item) => (
          <Button
            key={item.value}
            size="small"
            disabled={disabled && item.path !== currentPath}
            variant={item.path === currentPath ? 'primary' : 'tertiary'}
            onClick={() => handlePillClick(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="d-flex d-xl-none justify-content-between align-items-center w-100">
        <div className="d-flex justify-content-between w-100 flex-column flex-sm-row">
          <div>
            <Actions
              label="Select Page"
              items={navigationItems}
              onItemClick={(value) => handlePillClick(value)}
              customCssToggleBtn={'custom-nav-btn'}
              customCssMenu={'custom-nav-action-menu'}
              disable={disabled}
              toggleButtonVariant={'secondary'}
              // toggleButtonSize={isMobileScreen ? 'medium' : 'small'}
            />
          </div>
          <div>
            <div className="d-flex align-items-center">
              <div className="m-0">
                <span
                  className={`custom-nav-carousel-left-icon ${isActiveTabFirstPosition() ? 'd-none' : ''}`}
                  aria-hidden="true"
                  onClick={() =>
                    !disabled &&
                    !isActiveTabFirstPosition() &&
                    handlePillClick(getPreviousElement())
                  }
                ></span>
              </div>
              <div className="ps-3 pe-2 m-0 p-0 w-100 text-center">
                {navigationItems.map(
                  (tab) =>
                    tab.path === currentPath && (
                      <Button
                        key={tab.value}
                        // size={isMobileScreen ? 'medium' : 'small'}
                        className="custom-nav-pill"
                      >
                        {tab.label}
                      </Button>
                    ),
                )}
              </div>
              <div className="m-0">
                <span
                  className={`custom-nav-carousel-right-icon m-0 ${isActiveTabLastPosition() ? 'd-none' : ''}`}
                  aria-hidden="true"
                  onClick={() =>
                    !disabled &&
                    !isActiveTabLastPosition() &&
                    handlePillClick(getNextElement())
                  }
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationPills;
