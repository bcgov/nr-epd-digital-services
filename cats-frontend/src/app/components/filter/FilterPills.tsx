import React from 'react';
import { XmarkIcon } from '../common/icon';
import type { FilterPill } from './filterPill';
import './FilterPills.css';

export type { FilterPill };

interface FilterPillsProps {
  filters: FilterPill[];
  onRemoveFilter: (filter: FilterPill) => void;
}

const FilterPills: React.FC<FilterPillsProps> = ({
  filters,
  onRemoveFilter,
}) => {
  return (
    <div
      id="filter-pill"
      data-testid="filter-pill"
      className="d-flex justify-content-end flex-wrap selected-filter"
    >
      {filters.map((filter) => (
        <div
          key={`${filter.key}-${filter.value}`}
          className="d-flex custom-pill align-items-center"
        >
          {`${filter.label} : ${filter.value}`}
          <button
            type="button"
            className="d-flex align-items-center x-mark"
            aria-label={`Remove ${filter.label} filter`}
            onClick={() => onRemoveFilter(filter)}
          >
            <XmarkIcon />
          </button>
        </div>
      ))}
    </div>
  );
};

export default FilterPills;
