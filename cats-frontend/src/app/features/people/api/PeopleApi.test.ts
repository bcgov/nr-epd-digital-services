import { print } from 'graphql';
import { getAxiosInstance } from '../../../helpers/utility';
import { graphQlPeopleQuery, updatePerson } from '../graphql/People';
import {
  searchPeople,
  updatePeople,
  PeopleSearchApiError,
  PeopleUpdateApiError,
  PEOPLE_SEARCH_SAFE_ERROR_MESSAGE,
  PEOPLE_UPDATE_SAFE_ERROR_MESSAGE,
} from './PeopleApi';
import { PeopleSearchCriteria } from '../dto/PeopleSearchTypes';
import { PeopleUpdateInput } from '../dto/PeopleUpdateTypes';

vi.mock('../../../helpers/utility', () => ({
  getAxiosInstance: vi.fn(),
}));

const mockedGetAxiosInstance = getAxiosInstance as unknown as ReturnType<
  typeof vi.fn
>;

const criteria: PeopleSearchCriteria = {
  searchParam: 'smith',
  page: 1,
  pageSize: 10,
  searchMode: 'OR',
  activeFilter: 'all',
};

const updateInput: PeopleUpdateInput[] = [
  {
    id: 1,
    firstName: 'Jane',
    lastName: 'Smith',
    isActive: true,
    updatedDatetime: '2026-07-22T12:00:00.000Z',
  },
];

describe('PeopleApi searchPeople', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sends the expected GraphQL request variables', async () => {
    const post = vi.fn().mockResolvedValue({
      data: {
        data: {
          searchPerson: { persons: [], count: 0, page: 1, pageSize: 10 },
        },
      },
    });
    mockedGetAxiosInstance.mockReturnValue({ post });

    await searchPeople(criteria);

    expect(post).toHaveBeenCalledWith('/graphql', {
      query: print(graphQlPeopleQuery()),
      variables: {
        searchParam: criteria.searchParam,
        page: criteria.page,
        pageSize: criteria.pageSize,
        searchMode: criteria.searchMode,
        activeFilter: criteria.activeFilter,
      },
    });
  });

  it('extracts persons and count from a successful response', async () => {
    const persons = [{ id: '1', firstName: 'Jane', lastName: 'Smith' }];
    const post = vi.fn().mockResolvedValue({
      data: {
        data: {
          searchPerson: { persons, count: 1, page: 1, pageSize: 10 },
        },
      },
    });
    mockedGetAxiosInstance.mockReturnValue({ post });

    const result = await searchPeople(criteria);

    expect(result).toEqual({ persons, count: 1, page: 1, pageSize: 10 });
  });

  it('throws a safe error when the GraphQL response contains errors', async () => {
    const post = vi.fn().mockResolvedValue({
      data: { errors: [{ message: 'boom - internal db failure' }] },
    });
    mockedGetAxiosInstance.mockReturnValue({ post });

    await expect(searchPeople(criteria)).rejects.toMatchObject({
      message: PEOPLE_SEARCH_SAFE_ERROR_MESSAGE,
    });
  });

  it('throws a safe error when the response has no searchPerson payload', async () => {
    const post = vi.fn().mockResolvedValue({ data: { data: {} } });
    mockedGetAxiosInstance.mockReturnValue({ post });

    await expect(searchPeople(criteria)).rejects.toBeInstanceOf(
      PeopleSearchApiError,
    );
  });

  it('throws a safe error and hides raw transport errors on network failure', async () => {
    const post = vi.fn().mockRejectedValue(new Error('ECONNRESET'));
    mockedGetAxiosInstance.mockReturnValue({ post });

    await expect(searchPeople(criteria)).rejects.toMatchObject({
      message: PEOPLE_SEARCH_SAFE_ERROR_MESSAGE,
    });
  });

  it('forwards an AbortSignal to Axios so cancelled searches abort HTTP', async () => {
    const post = vi.fn().mockResolvedValue({
      data: {
        data: {
          searchPerson: { persons: [], count: 0, page: 1, pageSize: 10 },
        },
      },
    });
    mockedGetAxiosInstance.mockReturnValue({ post });
    const controller = new AbortController();

    await searchPeople(criteria, { signal: controller.signal });

    expect(post).toHaveBeenCalledWith(
      '/graphql',
      expect.any(Object),
      { signal: controller.signal },
    );
  });

  it('marks network errors as retryable', async () => {
    const post = vi.fn().mockRejectedValue(new Error('Network Error'));
    mockedGetAxiosInstance.mockReturnValue({ post });

    await expect(searchPeople(criteria)).rejects.toMatchObject({
      message: PEOPLE_SEARCH_SAFE_ERROR_MESSAGE,
      retryable: true,
    });
  });

  it.each([408, 429, 500, 502, 503])(
    'marks HTTP %s as a retryable transient failure',
    async (status) => {
      const post = vi.fn().mockRejectedValue({
        response: { status, data: { message: 'raw server detail' } },
        isAxiosError: true,
      });
      mockedGetAxiosInstance.mockReturnValue({ post });

      await expect(searchPeople(criteria)).rejects.toMatchObject({
        message: PEOPLE_SEARCH_SAFE_ERROR_MESSAGE,
        retryable: true,
      });
    },
  );

  it('marks permanent HTTP failures as not retryable', async () => {
    const post = vi.fn().mockRejectedValue({
      response: { status: 400, data: { message: 'bad request detail' } },
      isAxiosError: true,
    });
    mockedGetAxiosInstance.mockReturnValue({ post });

    await expect(searchPeople(criteria)).rejects.toMatchObject({
      message: PEOPLE_SEARCH_SAFE_ERROR_MESSAGE,
      retryable: false,
    });
  });

  it('marks GraphQL validation failures as not retryable', async () => {
    const post = vi.fn().mockResolvedValue({
      data: { errors: [{ message: 'Field X is required' }] },
    });
    mockedGetAxiosInstance.mockReturnValue({ post });

    await expect(searchPeople(criteria)).rejects.toMatchObject({
      message: PEOPLE_SEARCH_SAFE_ERROR_MESSAGE,
      retryable: false,
    });
  });
});

describe('PeopleApi updatePeople', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sends the expected GraphQL mutation with serializable ISO timestamps', async () => {
    const post = vi.fn().mockResolvedValue({
      data: {
        data: {
          updatePerson: {
            success: true,
            httpStatusCode: 200,
            message: 'ok',
            timestamp: '2026-07-22T12:00:00.000Z',
          },
        },
      },
    });
    mockedGetAxiosInstance.mockReturnValue({ post });

    await updatePeople(updateInput);

    expect(post).toHaveBeenCalledWith('/graphql', {
      query: print(updatePerson()),
      variables: { input: updateInput },
    });
    expect(typeof updateInput[0].updatedDatetime).toBe('string');
  });

  it('resolves when mutation-level success is true', async () => {
    const post = vi.fn().mockResolvedValue({
      data: {
        data: {
          updatePerson: { success: true, httpStatusCode: 200 },
        },
      },
    });
    mockedGetAxiosInstance.mockReturnValue({ post });

    await expect(updatePeople(updateInput)).resolves.toBeUndefined();
  });

  it('throws a safe error when GraphQL transport errors are present', async () => {
    const post = vi.fn().mockResolvedValue({
      data: { errors: [{ message: 'raw graphql internal detail' }] },
    });
    mockedGetAxiosInstance.mockReturnValue({ post });

    await expect(updatePeople(updateInput)).rejects.toMatchObject({
      message: PEOPLE_UPDATE_SAFE_ERROR_MESSAGE,
    });
  });

  it('throws a safe error when mutation-level success is false on HTTP 200', async () => {
    const post = vi.fn().mockResolvedValue({
      data: {
        data: {
          updatePerson: {
            success: false,
            httpStatusCode: 200,
            message: 'raw mutation failure detail',
          },
        },
      },
    });
    mockedGetAxiosInstance.mockReturnValue({ post });

    await expect(updatePeople(updateInput)).rejects.toBeInstanceOf(
      PeopleUpdateApiError,
    );
    await expect(updatePeople(updateInput)).rejects.toMatchObject({
      message: PEOPLE_UPDATE_SAFE_ERROR_MESSAGE,
    });
  });

  it('throws a safe error and hides raw transport errors on network failure', async () => {
    const post = vi.fn().mockRejectedValue(new Error('ECONNRESET'));
    mockedGetAxiosInstance.mockReturnValue({ post });

    await expect(updatePeople(updateInput)).rejects.toMatchObject({
      message: PEOPLE_UPDATE_SAFE_ERROR_MESSAGE,
    });
  });
});
