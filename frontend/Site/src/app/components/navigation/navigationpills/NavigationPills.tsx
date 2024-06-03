import React, { ReactNode, useState } from 'react';
import './NavigationPills.css';
import { INavigationPills } from './INavigationPills';
import { Link } from 'react-router-dom';

const NavigationPills: React.FC<INavigationPills> = ({ items, components }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handlePillClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div>
      <div className="d-flex gap-2">
        {items.map((item, index) => (
          <Link
            key={index}
            to="#"
            className={`pill ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handlePillClick(index)}
          >
            {item}
          </Link>
        ))}
      </div>
      <div className="content">
        {components.map((component, index) =>
          index === activeIndex ? <div key={index}>{component}</div> : null
        )}
      </div>
    </div>
  );
};

export default NavigationPills;