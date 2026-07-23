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
  readonly retryable: boolean;

  constructor(
    message: string = PEOPLE_SEARCH_SAFE_ERROR_MESSAGE,
    retryable: boolean = false,
  ) {
    super(message);
    this.name = 'PeopleSearchApiError';
    this.retryable = retryable;
  }
}

export interface SearchPeopleOptions {
  signal?: AbortSignal;
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

const TRANSIENT_HTTP_STATUSES = new Set([408, 429]);

/**
 * Network errors and HTTP 408/429/5xx are transient; other HTTP failures are not.
 */
const isTransientTransportError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return true;
  }

  const status = (error as { response?: { status?: number } }).response?.status;
  if (status === undefined) {
    // No HTTP response — treat as a network / connectivity failure.
    return true;
  }

  return TRANSIENT_HTTP_STATUSES.has(status) || status >= 500;
};

/**
 * Typed People search API boundary. Encapsulates GraphQL transport and
 * response validation so Saga workers stay focused on orchestration and
 * never see raw Axios/GraphQL shapes.
 */
export const searchPeople = async (
  criteria: PeopleSearchCriteria,
  options: SearchPeopleOptions = {},
): Promise<PeopleSearchResult> => {
  let response: SearchPersonGraphQlResponse;

  try {
    const requestBody = {
      query: print(graphQlPeopleQuery()),
      variables: {
        searchParam: criteria.searchParam,
        page: criteria.page,
        pageSize: criteria.pageSize,
        searchMode: criteria.searchMode,
        activeFilter: criteria.activeFilter,
      },
    };

    response = options.signal
      ? await getAxiosInstance().post(GRAPHQL, requestBody, {
          signal: options.signal,
        })
      : await getAxiosInstance().post(GRAPHQL, requestBody);
  } catch (transportError) {
    throw new PeopleSearchApiError(
      PEOPLE_SEARCH_SAFE_ERROR_MESSAGE,
      isTransientTransportError(transportError),
    );
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
