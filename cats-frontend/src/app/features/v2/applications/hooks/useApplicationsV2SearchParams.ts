import type { OnChangeFn, SortingState } from '@tanstack/react-table';
import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';
import {
  ApplicationSortByDirection,
  ApplicationSortByField,
} from '../../../../../generated/types';
import {
  DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
  type SearchApplicationsV2QueryVariables,
} from '../api/ApplicationsApi';
import {
  sortParamsToSortingState,
  sortingStateToSortParams,
} from '../applicationsV2Sort';

const isSortByField = (value: string): value is ApplicationSortByField =>
  Object.values(ApplicationSortByField).includes(
    value as ApplicationSortByField,
  );

const isSortByDirection = (
  value: string,
): value is ApplicationSortByDirection =>
  Object.values(ApplicationSortByDirection).includes(
    value as ApplicationSortByDirection,
  );

export const useApplicationsV2SearchParams = () => {
  const [params, setParams] = useQueryParams({
    page: withDefault(NumberParam, DEFAULT_APPLICATIONS_SEARCH_VARIABLES.page),
    pageSize: withDefault(
      NumberParam,
      DEFAULT_APPLICATIONS_SEARCH_VARIABLES.pageSize,
    ),
    search: withDefault(
      StringParam,
      DEFAULT_APPLICATIONS_SEARCH_VARIABLES.searchParam,
    ),
    sortBy: withDefault(
      StringParam,
      DEFAULT_APPLICATIONS_SEARCH_VARIABLES.sortBy,
    ),
    sortByDir: withDefault(
      StringParam,
      DEFAULT_APPLICATIONS_SEARCH_VARIABLES.sortByDir,
    ),
  });

  const sortBy = isSortByField(params.sortBy)
    ? params.sortBy
    : DEFAULT_APPLICATIONS_SEARCH_VARIABLES.sortBy;
  const sortByDir = isSortByDirection(params.sortByDir)
    ? params.sortByDir
    : DEFAULT_APPLICATIONS_SEARCH_VARIABLES.sortByDir;

  const sorting = sortParamsToSortingState(sortBy, sortByDir);

  const setPage = (page: number) => {
    setParams({ page });
  };

  const setPageSize = (pageSize: number) => {
    setParams({ pageSize, page: 1 });
  };

  const setSorting: OnChangeFn<SortingState> = (updater) => {
    const nextSorting =
      typeof updater === 'function' ? updater(sorting) : updater;
    const sortParams = sortingStateToSortParams(nextSorting);

    if (!sortParams) {
      setParams({
        sortBy: DEFAULT_APPLICATIONS_SEARCH_VARIABLES.sortBy,
        sortByDir: DEFAULT_APPLICATIONS_SEARCH_VARIABLES.sortByDir,
        page: 1,
      });
      return;
    }

    setParams({
      sortBy: sortParams.sortBy,
      sortByDir: sortParams.sortByDir,
      page: 1,
    });
  };

  const setSearch = (search: string) => {
    setParams({ search, page: 1 });
  };

  const variables: SearchApplicationsV2QueryVariables = {
    ...DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
    page: params.page,
    pageSize: params.pageSize,
    searchParam: params.search,
    sortBy,
    sortByDir,
  };

  return {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    setPage,
    setPageSize,
    setSearch,
    sorting,
    setSorting,
    variables,
  };
};
