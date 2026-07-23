import { print } from 'graphql';
import { GRAPHQL } from '../../../helpers/endpoints';
import { getAxiosInstance } from '../../../helpers/utility';
import {
  SearchPersonDocument,
  SearchPersonQuery,
  SearchPersonQueryVariables,
} from '../hooks/SearchPerson.generated';

export const PEOPLE_SEARCH_ERROR_MESSAGE =
  'Unable to search people. Please try again.';

export class PeopleApiError extends Error {
  constructor(message: string = PEOPLE_SEARCH_ERROR_MESSAGE) {
    super(message);
    this.name = 'PeopleApiError';
  }
}

export type PeopleSearchResult = SearchPersonQuery['searchPerson'];

export const searchPeople = async (
  variables: SearchPersonQueryVariables,
  signal?: AbortSignal,
): Promise<PeopleSearchResult> => {
  try {
    const response = await getAxiosInstance().post(
      GRAPHQL,
      {
        query: print(SearchPersonDocument),
        variables,
      },
      { signal },
    );

    if (response.data?.errors?.length > 0) {
      throw new PeopleApiError();
    }

    const result = response.data?.data?.searchPerson;
    if (!result) {
      throw new PeopleApiError();
    }

    return result;
  } catch (error) {
    if (error instanceof PeopleApiError) {
      throw error;
    }
    if (
      (error as { name?: string })?.name === 'CanceledError' ||
      signal?.aborted
    ) {
      throw error;
    }
    throw new PeopleApiError();
  }
};
