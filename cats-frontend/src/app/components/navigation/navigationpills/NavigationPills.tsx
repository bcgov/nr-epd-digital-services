import React, { useCallback, useMemo, useEffect } from 'react';
import './NavigationPills.css';
import { INavigationPills } from './INavigationPills';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Actions from '../../action/Actions';
import { Button } from '../../button/Button';

import {
  DEFAULT_APPLICATION_TAB_PATH,
  navigationItems as defaultNavigationItems,
} from '../../../features/navigation/NavigationPillsConfig';

const NavigationPills: React.FC<INavigationPills> = ({
  disabled = false,
  items,
  actions,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const navigationItems = items ?? defaultNavigationItems;
  const defaultPath = navigationItems[0]?.path ?? DEFAULT_APPLICATION_TAB_PATH;

  const currentPath = useMemo(() => {
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    const currentComponent = navigationItems.find(
      (item) => item.path === lastSegment,
    );
    return currentComponent?.path || defaultPath;
  }, [location.pathname, navigationItems, defaultPath]);

  // Keep the URL on a tab that is visible for this app type (CSSA vs non-CSSA).
  // `navigationItems` = filtered pills; `defaultNavigationItems` = full tab set.
  useEffect(() => {
    if (!id || navigationItems.length === 0) {
      return;
    }

    // e.g. /applications/123/details → ['applications', '123', 'details']
    const segments = location.pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    // Already on a visible tab (e.g. /notes when Notes is in the filtered list)
    const onKnownTab = navigationItems.some(
      (item) => item.path === lastSegment,
    );

    if (!onKnownTab) {
      // Last segment may be a hidden tab (e.g. non-CSSA on /details) or the app id
      // (/applications/123). Only pop real tab paths so we don't drop the id.
      const allTabPaths = new Set(
        defaultNavigationItems.map((item) => item.path),
      );
      if (allTabPaths.has(lastSegment)) {
        segments.pop();
      }
      // Land on default tab (Application) without creating .../details/application
      navigate(`/${[...segments, defaultPath].join('/')}`, { replace: true });
    }
  }, [location.pathname, navigate, id, navigationItems, defaultPath]);

  const handlePillClick = (tabKey: string) => {
    const component = navigationItems.find((item) => item.value === tabKey);
    if (component) {
      // Replace the current tab segment (if any) with the clicked tab's path
      const segments = location.pathname.split('/').filter(Boolean);
      const lastSegment = segments[segments.length - 1];
      const allTabPaths = new Set(
        defaultNavigationItems.map((item) => item.path),
      );
      if (allTabPaths.has(lastSegment)) {
        segments.pop();
      }
      navigate(`/${[...segments, component.path].join('/')}`);
    }
  };

  const getCurrentElementIndex = useCallback(() => {
    return navigationItems.findIndex((tab) => tab.path === currentPath);
  }, [currentPath, navigationItems]);

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
      <div className="d-none d-xl-flex justify-content-between align-items-center w-100 gap-2">
        <div className="d-flex gap-2 flex-wrap">
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
        {actions}
      </div>
      <div className="d-flex d-xl-none flex-column gap-2 w-100">
        {actions && (
          <div className="d-flex justify-content-end w-100">{actions}</div>
        )}
        <div className="d-flex justify-content-between align-items-center w-100">
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
    </div>
  );
};

export default NavigationPills;
