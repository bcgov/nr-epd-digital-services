import { print } from 'graphql';
import { getAxiosInstance } from '../../../helpers/utility';
import { graphQlPeopleQuery } from '../graphql/People';
import {
  searchPeople,
  PeopleSearchApiError,
  PEOPLE_SEARCH_SAFE_ERROR_MESSAGE,
} from './PeopleApi';
import { PeopleSearchCriteria } from '../dto/PeopleSearchTypes';

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
});
