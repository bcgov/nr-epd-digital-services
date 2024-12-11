import React, { useEffect, useState } from 'react';
import './NavigationPills.css';
import { INavigationPills } from './INavigationPills';
import { Link, useLocation } from 'react-router-dom';

const NavigationPills: React.FC<INavigationPills> = ({
  items,
  components,
  dropdownItems,
  isDisable,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const location = useLocation();

  useEffect(() => {
    if (location?.search !== '') {
      const componentIndex = components.findIndex(
        (item: any) => item.key === location?.search.replace('?', ''),
      );

      if (componentIndex > -1) {
        handlePillClick(componentIndex);
      }
    }
  }, [location]);

  const handlePillClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="pt-5">
      <div className="d-flex d-xxl-flex d-xl-flex gap-2 d-none ">
        {items.map((item, index) => (
          <Link
            key={index}
            to="#"
            className={`d-flex gap-2 custom-nav-pill ${isDisable ? 'disabled default' : index === activeIndex ? 'active' : 'enabled'}`}
            onClick={isDisable ? () => { } : () => handlePillClick(index)}
          >
            {item}
          </Link>
        ))}
      </div>
      <div className="d-flex d-xl-none d-lg-flex d-md-flex d-sm-flex d-xs-flex justify-content-between px-2 align-items-center w-100">
        <div className="d-flex justify-content-between w-100 flex-column flex-sm-row">
          <div>
            <div className="d-flex align-items-center">
              <div className="m-0">
                <span
                  className={`custom-nav-carousel-left-icon ${activeIndex === 0 ? 'd-none' : ''}`}
                  aria-hidden="true"
                  onClick={
                    isDisable
                      ? () => { }
                      : () =>
                        activeIndex > 0 && handlePillClick(activeIndex - 1)
                  }
                ></span>
              </div>
              <div className="ps-3 pe-2 m-0 p-0 w-100 text-center">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className={`custom-nav-pill ${index === activeIndex ? 'd-block active' : 'd-none'}`}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="m-0">
                <span
                  className={`custom-nav-carousel-right-icon m-0 ${activeIndex === items.length - 1 ? 'd-none' : ''}`}
                  aria-hidden="true"
                  onClick={
                    isDisable
                      ? () => { }
                      : () =>
                        activeIndex < items.length - 1 &&
                        handlePillClick(activeIndex + 1)
                  }
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        {components &&
          components?.map((tabComponent: any, index: number) =>
            index === activeIndex ? (
              <div key={index}>{tabComponent.component}</div>
            ) : null,
          )}
      </div>
    </div>
  );
};

export default NavigationPills;
