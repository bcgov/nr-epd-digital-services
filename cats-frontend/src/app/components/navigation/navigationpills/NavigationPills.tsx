import React, { useCallback, useEffect, useState } from 'react';
import './NavigationPills.css';
import { INavigationPills } from './INavigationPills';
import { useLocation } from 'react-router-dom';
import Actions from '../../action/Actions';
import { Button } from '../../button/Button';

const NavigationPills: React.FC<INavigationPills> = ({
  components,
  isDisable,
}) => {
  const [activeTabKey, setactiveTabKey] = useState<string>(components[0].value);

  const location = useLocation();

  useEffect(() => {
    if (location?.search !== '') {
      const component = components.find(
        (item: any) => item.value === location?.search.replace('?', ''),
      );

      if (component !== null) {
        handlePillClick(component.value);
      }
    }
  }, [location, components]);

  const handlePillClick = (tabKey: string) => {
    setactiveTabKey(tabKey);
  };

  const getCurrentElementIndex = useCallback(() => {
    const currentComponentIndex = components.findIndex(
      (tab: any) => tab.value === activeTabKey,
    );

    return currentComponentIndex;
  }, [components, activeTabKey]);

  const isActiveTabFirstPosition = () => {
    return getCurrentElementIndex() === 0;
  };

  const isActiveTabLastPosition = () => {
    return getCurrentElementIndex() + 1 === components.length;
  };

  const getNextElement = () => {
    const currentComponentindex = getCurrentElementIndex();
    return components[currentComponentindex + 1].value;
  };

  const getPreviousElement = () => {
    const currentComponentindex = getCurrentElementIndex();
    return components[currentComponentindex - 1].value;
  };

  return (
    <div className="pt-5">
      <div className="d-flex d-xxl-flex d-xl-flex gap-2 d-none">
        {components.map((item: any) => (
          <Button
            size="small"
            disabled={isDisable && item !== activeTabKey}
            variant={item.value === activeTabKey ? 'primary' : 'tertiary'}
            onClick={() => handlePillClick(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="d-flex d-xl-none d-lg-flex d-md-flex d-sm-flex d-xs-flex justify-content-between align-items-center w-100">
        <div className="d-flex justify-content-between w-100 flex-column flex-sm-row">
          <div>
            <Actions
              label="Select Page"
              items={components}
              onItemClick={
                isDisable ? () => {} : (value) => handlePillClick(value)
              }
              customCssToggleBtn={'custom-nav-btn'}
              customCssMenu={'custom-nav-action-menu'}
              disable={isDisable}
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
                  onClick={
                    isDisable
                      ? () => {}
                      : () =>
                          !isActiveTabFirstPosition() &&
                          handlePillClick(getPreviousElement())
                  }
                ></span>
              </div>
              <div className="ps-3 pe-2 m-0 p-0 w-100 text-center">
                {components.map(
                  (tab: any) =>
                    tab.value === activeTabKey && (
                      <Button
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
                  onClick={
                    isDisable
                      ? () => {}
                      : () =>
                          !isActiveTabLastPosition() &&
                          handlePillClick(getNextElement())
                  }
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        {components &&
          activeTabKey !== '' &&
          components?.map((tabComponent: { value: string, component: React.ReactNode }, index: number) => {
            console.log("nupur -type of tabComponent: ", typeof(tabComponent));
            return tabComponent.value === activeTabKey ? (
              <div key={index}>{tabComponent.component}</div>
            ) : null;
          })}
      </div>
    </div>
  );
};

export default NavigationPills;
