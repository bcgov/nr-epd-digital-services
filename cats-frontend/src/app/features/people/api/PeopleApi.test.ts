import { print } from 'graphql';
import {
  PEOPLE_SEARCH_ERROR_MESSAGE,
  PeopleApiError,
  searchPeople,
} from './PeopleApi';
import { SearchPersonDocument } from '../hooks/SearchPerson.generated';
import { GRAPHQL } from '../../../helpers/endpoints';

const mockPost = vi.fn();

vi.mock('../../../helpers/utility', () => ({
  getAxiosInstance: () => ({
    post: mockPost,
  }),
}));

describe('PeopleApi.searchPeople', () => {
  const variables = {
    searchParam: 'ada',
    page: 1,
    pageSize: 5,
    searchMode: 'OR',
    activeFilter: 'all',
  };

  const searchResult = {
    persons: [{ id: 1, firstName: 'Ada', lastName: 'Lovelace' }],
    count: 1,
    page: 1,
    pageSize: 5,
  };

  beforeEach(() => {
    mockPost.mockReset();
  });

  it('posts typed search variables and extracts the result', async () => {
    mockPost.mockResolvedValue({
      data: { data: { searchPerson: searchResult } },
    });

    const result = await searchPeople(variables);

    expect(mockPost).toHaveBeenCalledWith(
      GRAPHQL,
      {
        query: print(SearchPersonDocument),
        variables,
      },
      { signal: undefined },
    );
    expect(result).toEqual(searchResult);
  });

  it('forwards an abort signal to axios', async () => {
    const controller = new AbortController();
    mockPost.mockResolvedValue({
      data: { data: { searchPerson: searchResult } },
    });

    await searchPeople(variables, controller.signal);

    expect(mockPost).toHaveBeenCalledWith(GRAPHQL, expect.any(Object), {
      signal: controller.signal,
    });
  });

  it('throws a safe domain error on GraphQL transport errors', async () => {
    mockPost.mockResolvedValue({
      data: {
        errors: [{ message: 'Internal boom with stack details' }],
      },
    });

    await expect(searchPeople(variables)).rejects.toEqual(
      new PeopleApiError(PEOPLE_SEARCH_ERROR_MESSAGE),
    );
  });

  it('throws a safe domain error when the result is missing', async () => {
    mockPost.mockResolvedValue({
      data: { data: {} },
    });

    await expect(searchPeople(variables)).rejects.toBeInstanceOf(
      PeopleApiError,
    );
  });

  it('throws a safe domain error on network failure', async () => {
    mockPost.mockRejectedValue(new Error('ECONNREFUSED secret host'));

    await expect(searchPeople(variables)).rejects.toEqual(
      new PeopleApiError(PEOPLE_SEARCH_ERROR_MESSAGE),
    );
  });
});
