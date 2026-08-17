import { print } from 'graphql';
import {
  ApplicationSortByDirection,
  ApplicationSortByField,
  Filter,
} from '../../../../../generated/types';
import { GRAPHQL } from '../../../../helpers/endpoints';
import { getAxiosInstance } from '../../../../helpers/utility';
import {
  SearchApplicationsV2Document,
  SearchApplicationsV2Query,
  SearchApplicationsV2QueryVariables,
} from './SearchApplicationsV2.generated';

export const APPLICATIONS_SEARCH_ERROR_MESSAGE =
  'Unable to search applications. Please try again.';

export class ApplicationsApiError extends Error {
  constructor(message: string = APPLICATIONS_SEARCH_ERROR_MESSAGE) {
    super(message);
    this.name = 'ApplicationsApiError';
  }
}

export type ApplicationsSearchResult =
  SearchApplicationsV2Query['searchApplications'];

export type { SearchApplicationsV2QueryVariables };

export const DEFAULT_APPLICATIONS_SEARCH_VARIABLES: SearchApplicationsV2QueryVariables =
  {
    searchParam: '',
    page: 1,
    pageSize: 10,
    filter: Filter.All,
    sortBy: ApplicationSortByField.ReceivedDate,
    sortByDir: ApplicationSortByDirection.Desc,
  };

export const searchApplications = async (
  variables: SearchApplicationsV2QueryVariables = DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
  signal?: AbortSignal,
): Promise<ApplicationsSearchResult> => {
  try {
    const response = await getAxiosInstance().post(
      GRAPHQL,
      {
        query: print(SearchApplicationsV2Document),
        variables,
      },
      { signal },
    );

    if (response.data?.errors?.length > 0) {
      throw new ApplicationsApiError();
    }

    const result = response.data?.data?.searchApplications;
    if (!result) {
      throw new ApplicationsApiError();
    }

    return result;
  } catch (error) {
    if (error instanceof ApplicationsApiError) {
      throw error;
    }
    if (
      (error as { name?: string })?.name === 'CanceledError' ||
      signal?.aborted
    ) {
      throw error;
    }
    throw new ApplicationsApiError();
  }
};
