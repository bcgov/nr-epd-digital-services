import { print } from 'graphql';
import { getAxiosInstance } from '../../../helpers/utility';
import { GRAPHQL } from '../../../helpers/endpoints';
import { graphQlPeopleQuery } from '../graphql/People';
import {
  PeopleSearchCriteria,
  PeopleSearchResult,
} from '../dto/PeopleSearchTypes';

/**
 * Safe, user-facing message for People search failures. Raw Axios/GraphQL
 * error details must never reach Redux state or the UI.
 */
export const PEOPLE_SEARCH_SAFE_ERROR_MESSAGE =
  'We were unable to search People right now. Please try again.';

export class PeopleSearchApiError extends Error {
  constructor(message: string = PEOPLE_SEARCH_SAFE_ERROR_MESSAGE) {
    super(message);
    this.name = 'PeopleSearchApiError';
  }
}

interface SearchPersonGraphQlResponse {
  data?: {
    data?: {
      searchPerson?: {
        persons?: PeopleSearchResult['persons'];
        count?: number;
        page?: number;
        pageSize?: number;
      };
    };
    errors?: Array<{ message?: string }>;
  };
}

/**
 * Typed People search API boundary. Encapsulates GraphQL transport and
 * response validation so Saga workers stay focused on orchestration and
 * never see raw Axios/GraphQL shapes.
 */
export const searchPeople = async (
  criteria: PeopleSearchCriteria,
): Promise<PeopleSearchResult> => {
  let response: SearchPersonGraphQlResponse;

  try {
    response = await getAxiosInstance().post(GRAPHQL, {
      query: print(graphQlPeopleQuery()),
      variables: {
        searchParam: criteria.searchParam,
        page: criteria.page,
        pageSize: criteria.pageSize,
        searchMode: criteria.searchMode,
        activeFilter: criteria.activeFilter,
      },
    });
  } catch (transportError) {
    throw new PeopleSearchApiError();
  }

  const graphQlErrors = response.data?.errors;
  if (graphQlErrors && graphQlErrors.length > 0) {
    throw new PeopleSearchApiError();
  }

  const result = response.data?.data?.searchPerson;
  if (!result) {
    throw new PeopleSearchApiError();
  }

  return {
    persons: result.persons ?? [],
    count: result.count ?? 0,
    page: result.page ?? criteria.page,
    pageSize: result.pageSize ?? criteria.pageSize,
  };
};
