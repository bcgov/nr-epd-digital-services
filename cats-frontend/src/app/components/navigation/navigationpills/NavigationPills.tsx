import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './NavigationPills.css';
import { INavigationPills } from './INavigationPills';
import { useSearchParams } from 'react-router-dom';
import Actions from '../../action/Actions';
import { Button } from '../../button/Button';

const NavigationPills: React.FC<INavigationPills> = ({
  components,
  disabled = false,
  tabSearchKey,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = useMemo(() => {
    const tab = searchParams.get(tabSearchKey);
    if (!tab) return components[0].value;
    return (
      components.find((item) => item.value === tab)?.value ||
      components[0].value
    );
    // Only need the value set at the initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activeTabKey, setActiveTabKey] = useState<string>(initialTab);

  useEffect(() => {
    const currentTab = searchParams.get(tabSearchKey);
    if (currentTab) {
      const component = components.find((item) => item.value === currentTab);

      if (component) {
        setActiveTabKey(component.value);
      }
    }
  }, [components, searchParams, tabSearchKey]);

  const handlePillClick = (tabKey: string) => {
    setActiveTabKey(tabKey);
    setSearchParams((params) => {
      params.set(tabSearchKey, tabKey);
      return params;
    });
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
    <div>
      <div className="d-flex d-xxl-flex d-xl-flex gap-2 d-none">
        {components.map((item) => (
          <Button
            key={item.value}
            size="small"
            disabled={disabled && item.value !== activeTabKey}
            variant={item.value === activeTabKey ? 'primary' : 'tertiary'}
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
              items={components}
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
                {components.map(
                  (tab) =>
                    tab.value === activeTabKey && (
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
      <div className="mt-4">
        {components &&
          activeTabKey !== '' &&
          components?.map((tabComponent) => {
            return tabComponent.value === activeTabKey ? (
              <div key={tabComponent.value}>{tabComponent.component}</div>
            ) : null;
          })}
      </div>
    </div>
  );
};

export default NavigationPills;
