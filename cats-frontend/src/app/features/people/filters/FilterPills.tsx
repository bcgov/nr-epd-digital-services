import React from "react";
import { XmarkIcon } from "../../../components/common/icon";
import "./PeopleFilterForm.css";

export interface FilterPill {
  key: string;
  value: string;
  label: string;
}

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
      {filters.map((filter, index) => (
        <div key={index} className="d-flex custom-pill align-items-center">
          {filter && `${filter.label} : ${filter.value}`}
          <div
            className="d-flex align-items-center x-mark"
            onClick={() => onRemoveFilter(filter)}
          >
            <XmarkIcon />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterPills;
