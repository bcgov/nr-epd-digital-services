import { print } from 'graphql';
import {
  PEOPLE_SEARCH_ERROR_MESSAGE,
  PEOPLE_UPDATE_ERROR_MESSAGE,
  PeopleApiError,
  searchPeople,
  updatePeople,
} from './PeopleApi';
import { SearchPersonDocument } from '../hooks/SearchPerson.generated';
import { UpdatePersonDocument } from '../hooks/UpdatePerson.generated';
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

describe('PeopleApi.updatePeople', () => {
  const input = [
    {
      id: 1,
      firstName: 'Ada',
      lastName: 'Lovelace',
      isTaxExempt: false,
      isActive: true,
      updatedBy: '',
      updatedDatetime: '2026-07-22T12:00:00.000Z',
    },
  ];

  const updateResult = {
    message: 'Updated',
    httpStatusCode: 200,
    success: true,
    timestamp: '2026-07-22T12:00:00.000Z',
  };

  beforeEach(() => {
    mockPost.mockReset();
  });

  it('posts typed update variables and extracts the result', async () => {
    mockPost.mockResolvedValue({
      data: { data: { updatePerson: updateResult } },
    });

    const result = await updatePeople(input);

    expect(mockPost).toHaveBeenCalledWith(
      GRAPHQL,
      {
        query: print(UpdatePersonDocument),
        variables: { input },
      },
      { signal: undefined },
    );
    expect(result).toEqual(updateResult);
  });

  it('forwards an abort signal to axios', async () => {
    const controller = new AbortController();
    mockPost.mockResolvedValue({
      data: { data: { updatePerson: updateResult } },
    });

    await updatePeople(input, controller.signal);

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

    await expect(updatePeople(input)).rejects.toEqual(
      new PeopleApiError(PEOPLE_UPDATE_ERROR_MESSAGE),
    );
  });

  it('throws a safe domain error when mutation success is false', async () => {
    mockPost.mockResolvedValue({
      data: {
        data: {
          updatePerson: {
            message: 'Validation failed with internal details',
            httpStatusCode: 400,
            success: false,
            timestamp: '2026-07-22T12:00:00.000Z',
          },
        },
      },
    });

    await expect(updatePeople(input)).rejects.toEqual(
      new PeopleApiError(PEOPLE_UPDATE_ERROR_MESSAGE),
    );
  });
});
