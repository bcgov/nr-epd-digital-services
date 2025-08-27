import React from 'react';
import './FilterControls.css';
import { Button } from '../button/Button';
import { IFilterControls } from './IFilterControls';

const FilterControls: React.FC<IFilterControls> = ({ options }) => {
  return (
    <div className="d-flex gap-2 flex-wrap align-items-center justify-content-start">
      {options?.map(({ label, value, onClick, isSelected, icon }) => (
        <div key={value} className="d-flex">
          <Button
            variant="tertiary"
            onClick={onClick}
            className={isSelected ? 'table-controls__button--selected' : ''}
          >
            <span className="d-flex align-items-center gap-2 justify-content-center">
              {icon}
              <span>{label}</span>
            </span>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FilterControls;
