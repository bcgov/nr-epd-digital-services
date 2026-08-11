import { NumberParam, useQueryParams, withDefault } from 'use-query-params';
import {
  DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
  type SearchApplicationsV2QueryVariables,
} from '../api/ApplicationsApi';

export const useApplicationsV2SearchParams = () => {
  const [params, setParams] = useQueryParams({
    page: withDefault(NumberParam, DEFAULT_APPLICATIONS_SEARCH_VARIABLES.page),
    pageSize: withDefault(
      NumberParam,
      DEFAULT_APPLICATIONS_SEARCH_VARIABLES.pageSize,
    ),
  });

  const setPage = (page: number) => {
    setParams({ page });
  };

  const setPageSize = (pageSize: number) => {
    setParams({ pageSize, page: 1 });
  };

  const variables: SearchApplicationsV2QueryVariables = {
    ...DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
    page: params.page,
    pageSize: params.pageSize,
  };

  return {
    page: params.page,
    pageSize: params.pageSize,
    setPage,
    setPageSize,
    variables,
  };
};
