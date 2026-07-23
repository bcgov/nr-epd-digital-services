import { useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { notifyError } from '../../../components/alert/Alert';
import { searchPeople, PEOPLE_SEARCH_ERROR_MESSAGE } from '../api/PeopleApi';
export type PeopleSearchMode = 'AND' | 'OR';
export type PeopleActiveFilter = 'active' | 'inactive' | 'all';

export type PeopleSearchCriteria = {
  searchParam: string;
  page: number;
  pageSize: number;
  searchMode: PeopleSearchMode;
  activeFilter: PeopleActiveFilter;
};

export const DEFAULT_PEOPLE_PAGE_SIZE = 5;

export const peopleSearchKeys = {
  all: ['people', 'search'] as const,
  search: (criteria: PeopleSearchCriteria) =>
    [...peopleSearchKeys.all, criteria] as const,
};

export const parsePeopleSearchCriteria = (
  urlParams: URLSearchParams,
): PeopleSearchCriteria => {
  const searchModeParam = urlParams.get('searchMode');
  const activeFilterParam = urlParams.get('activeFilter');

  return {
    searchParam: urlParams.get('search') || '',
    page: parseInt(urlParams.get('page') || '1', 10) || 1,
    pageSize:
      parseInt(
        urlParams.get('pageSize') || String(DEFAULT_PEOPLE_PAGE_SIZE),
        10,
      ) || DEFAULT_PEOPLE_PAGE_SIZE,
    searchMode: searchModeParam === 'AND' ? 'AND' : 'OR',
    activeFilter:
      activeFilterParam === 'active' || activeFilterParam === 'inactive'
        ? activeFilterParam
        : 'all',
  };
};

export const usePeopleSearch = () => {
  const [urlParams] = useSearchParams();
  const criteria = parsePeopleSearchCriteria(urlParams);
  const enabled = criteria.searchParam.trim().length > 0;

  const query = useQuery({
    queryKey: peopleSearchKeys.search(criteria),
    queryFn: ({ signal }) => searchPeople(criteria, signal),
    enabled,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (query.isError) {
      notifyError(
        PEOPLE_SEARCH_ERROR_MESSAGE,
        'Search could not be completed',
        'Please try again or contact support.',
      );
    }
  }, [query.isError, query.errorUpdatedAt]);

  return {
    ...query,
    criteria,
    enabled,
  };
};
