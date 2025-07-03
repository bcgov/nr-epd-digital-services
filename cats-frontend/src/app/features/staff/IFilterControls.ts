import { Filter } from '../../../generated/types';

export interface IFilterControls {
  handleFilterChange: (filter: Filter) => void;
  filter: Filter;
  toggleColumnSelect: () => void;
}
