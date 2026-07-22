import { Peoples } from './People';

export type PeopleSearchMode = 'AND' | 'OR';
export type PeopleActiveFilter = 'active' | 'inactive' | 'all';

/**
 * The full set of inputs needed to run a People search. This is the single
 * typed criteria object recorded in Redux and consumed by the People Saga and
 * typed People API module.
 */
export interface PeopleSearchCriteria {
  searchParam: string;
  page: number;
  pageSize: number;
  searchMode: PeopleSearchMode;
  activeFilter: PeopleActiveFilter;
  // Advanced filter values are accepted for backward compatibility with the
  // existing UI, but the current searchPerson GraphQL operation has no
  // corresponding filter inputs, so they are not sent to the API.
  filter?: Record<string, string>;
}

export interface PeopleSearchResult {
  persons: Peoples[];
  count: number;
  page: number;
  pageSize: number;
}

export interface PeopleSearchFailure {
  message: string;
}
