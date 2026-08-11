import { print } from 'graphql';
import {
  APPLICATIONS_SEARCH_ERROR_MESSAGE,
  ApplicationsApiError,
  DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
  searchApplications,
} from './ApplicationsApi';
import { SearchApplicationsV2Document } from './SearchApplicationsV2.generated';
import { GRAPHQL } from '../../../../helpers/endpoints';

const mockPost = vi.fn();

vi.mock('../../../../helpers/utility', () => ({
  getAxiosInstance: () => ({
    post: mockPost,
  }),
}));

describe('ApplicationsApi.searchApplications', () => {
  const searchResult = {
    applications: [
      {
        id: '1',
        siteId: 'SITE-1',
        applicationType: 'Type A',
        status: 'Open',
      },
    ],
    count: 1,
    page: 1,
    pageSize: 10,
  };

  beforeEach(() => {
    mockPost.mockReset();
  });

  it('posts typed search variables and extracts the result', async () => {
    mockPost.mockResolvedValue({
      data: { data: { searchApplications: searchResult } },
    });

    const result = await searchApplications(
      DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
    );

    expect(mockPost).toHaveBeenCalledWith(
      GRAPHQL,
      {
        query: print(SearchApplicationsV2Document),
        variables: DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
      },
      { signal: undefined },
    );
    expect(result).toEqual(searchResult);
  });

  it('forwards an abort signal to axios', async () => {
    const controller = new AbortController();
    mockPost.mockResolvedValue({
      data: { data: { searchApplications: searchResult } },
    });

    await searchApplications(
      DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
      controller.signal,
    );

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

    await expect(
      searchApplications(DEFAULT_APPLICATIONS_SEARCH_VARIABLES),
    ).rejects.toEqual(
      new ApplicationsApiError(APPLICATIONS_SEARCH_ERROR_MESSAGE),
    );
  });

  it('throws a safe domain error when the result is missing', async () => {
    mockPost.mockResolvedValue({
      data: { data: {} },
    });

    await expect(
      searchApplications(DEFAULT_APPLICATIONS_SEARCH_VARIABLES),
    ).rejects.toBeInstanceOf(ApplicationsApiError);
  });

  it('throws a safe domain error on network failure', async () => {
    mockPost.mockRejectedValue(new Error('ECONNREFUSED secret host'));

    await expect(
      searchApplications(DEFAULT_APPLICATIONS_SEARCH_VARIABLES),
    ).rejects.toEqual(
      new ApplicationsApiError(APPLICATIONS_SEARCH_ERROR_MESSAGE),
    );
  });

  it('re-throws cancellation errors unchanged', async () => {
    const canceledError = Object.assign(new Error('Aborted'), {
      name: 'CanceledError',
    });
    mockPost.mockRejectedValue(canceledError);

    const controller = new AbortController();
    controller.abort();

    await expect(
      searchApplications(
        DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
        controller.signal,
      ),
    ).rejects.toBe(canceledError);
  });
});
