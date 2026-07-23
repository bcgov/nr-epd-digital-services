import { print } from 'graphql';
import { GRAPHQL } from '../../../helpers/endpoints';
import { getAxiosInstance } from '../../../helpers/utility';
import {
  SearchPersonDocument,
  SearchPersonQuery,
  SearchPersonQueryVariables,
} from '../hooks/SearchPerson.generated';
import {
  UpdatePersonDocument,
  UpdatePersonMutation,
  UpdatePersonMutationVariables,
} from '../hooks/UpdatePerson.generated';

export const PEOPLE_SEARCH_ERROR_MESSAGE =
  'Unable to search people. Please try again.';

export const PEOPLE_UPDATE_ERROR_MESSAGE =
  'Unable to update people. Please try again.';

export class PeopleApiError extends Error {
  constructor(message: string = PEOPLE_SEARCH_ERROR_MESSAGE) {
    super(message);
    this.name = 'PeopleApiError';
  }
}

export type PeopleSearchResult = SearchPersonQuery['searchPerson'];
export type PeopleUpdateResult = UpdatePersonMutation['updatePerson'];
export type PeopleUpdateInput = UpdatePersonMutationVariables['input'];

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

export const updatePeople = async (
  input: PeopleUpdateInput,
  signal?: AbortSignal,
): Promise<PeopleUpdateResult> => {
  try {
    const response = await getAxiosInstance().post(
      GRAPHQL,
      {
        query: print(UpdatePersonDocument),
        variables: { input },
      },
      { signal },
    );

    if (response.data?.errors?.length > 0) {
      throw new PeopleApiError(PEOPLE_UPDATE_ERROR_MESSAGE);
    }

    const result = response.data?.data?.updatePerson;
    if (!result || result.success !== true) {
      throw new PeopleApiError(PEOPLE_UPDATE_ERROR_MESSAGE);
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
    throw new PeopleApiError(PEOPLE_UPDATE_ERROR_MESSAGE);
  }
};
