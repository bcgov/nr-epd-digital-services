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
import type { FilterPill } from '../../../../components/filter/filterPill';
import {
  DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
  type SearchApplicationsV2QueryVariables,
} from '../api/ApplicationsApi';
import {
  sortParamsToSortingState,
  sortingStateToSortParams,
} from '../applicationsV2Sort';
import {
  advancedFiltersToGraphqlVariables,
  advancedFiltersToPills,
  ADVANCED_FILTER_URL_KEYS,
  clearedAdvancedFilterUrlUpdates,
  parseAdvancedFiltersFromUrl,
  urlKeysForPill,
  urlUpdatesFromAdvancedFilters,
  type ApplicationsV2AdvancedFilters,
} from '../filters/applicationsV2Filters';

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

const advancedFilterParamConfig = Object.fromEntries(
  ADVANCED_FILTER_URL_KEYS.map((key) => [key, StringParam]),
) as Record<(typeof ADVANCED_FILTER_URL_KEYS)[number], typeof StringParam>;

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
    ...advancedFilterParamConfig,
  });

  const sortBy = isSortByField(params.sortBy)
    ? params.sortBy
    : DEFAULT_APPLICATIONS_SEARCH_VARIABLES.sortBy;
  const sortByDir = isSortByDirection(params.sortByDir)
    ? params.sortByDir
    : DEFAULT_APPLICATIONS_SEARCH_VARIABLES.sortByDir;

  const advancedFilters = parseAdvancedFiltersFromUrl(params);
  const filterPills = advancedFiltersToPills(advancedFilters);

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

  const applyAdvancedFilters = (nextFilters: ApplicationsV2AdvancedFilters) => {
    setParams({
      ...urlUpdatesFromAdvancedFilters(nextFilters),
      page: 1,
    });
  };

  const resetAdvancedFilters = () => {
    setParams({
      ...clearedAdvancedFilterUrlUpdates(),
      page: 1,
    });
  };

  const removeFilterPill = (pill: FilterPill) => {
    const updates = Object.fromEntries(
      urlKeysForPill(pill.key).map((key) => [key, undefined]),
    );
    setParams({
      ...updates,
      page: 1,
    });
  };

  const variables: SearchApplicationsV2QueryVariables = {
    ...DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
    page: params.page,
    pageSize: params.pageSize,
    searchParam: params.search,
    sortBy,
    sortByDir,
    ...advancedFiltersToGraphqlVariables(advancedFilters),
  };

  return {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    advancedFilters,
    filterPills,
    setPage,
    setPageSize,
    setSearch,
    applyAdvancedFilters,
    resetAdvancedFilters,
    removeFilterPill,
    sorting,
    setSorting,
    variables,
  };
};
