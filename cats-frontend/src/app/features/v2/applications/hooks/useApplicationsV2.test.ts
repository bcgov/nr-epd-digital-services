import { waitFor } from '@testing-library/react';
import { useApplicationsV2 } from './useApplicationsV2';
import { renderHookWithQueryRouter } from '../../../../../utilities/test/QueryTestUtils';
import * as ApplicationsApi from '../api/ApplicationsApi';
import { notifyError } from '../../../../components/alert/Alert';
import {
  DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
  type SearchApplicationsV2QueryVariables,
} from '../api/ApplicationsApi';

vi.mock('../api/ApplicationsApi', async () => {
  const actual = await vi.importActual<typeof import('../api/ApplicationsApi')>(
    '../api/ApplicationsApi',
  );
  return {
    ...actual,
    searchApplications: vi.fn(),
  };
});

vi.mock('../../../../components/alert/Alert', () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
  notifyAlert: vi.fn(),
}));

const searchApplicationsMock = vi.mocked(ApplicationsApi.searchApplications);

describe('useApplicationsV2', () => {
  beforeEach(() => {
    searchApplicationsMock.mockReset();
    vi.mocked(notifyError).mockReset();
  });

  it('searches with default variables on mount', async () => {
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
    searchApplicationsMock.mockResolvedValue(searchResult as any);

    const { result } = renderHookWithQueryRouter(() => useApplicationsV2(), {
      initialEntries: ['/applications-v2'],
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(searchApplicationsMock).toHaveBeenCalledWith(
      DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
      expect.any(AbortSignal),
    );
    expect(result.current.data).toEqual(searchResult);
  });

  it('searches with the provided page and pageSize variables', async () => {
    searchApplicationsMock.mockResolvedValue({
      applications: [],
      count: 0,
      page: 2,
      pageSize: 25,
    } as any);

    const variables = {
      ...DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
      page: 2,
      pageSize: 25,
    };

    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2(variables),
      { initialEntries: ['/applications-v2?page=2&pageSize=25'] },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(searchApplicationsMock).toHaveBeenCalledWith(
      variables,
      expect.any(AbortSignal),
    );
  });

  it('keeps the previous page visible while the next page loads', async () => {
    const pageOne = {
      applications: [
        {
          id: '1',
          siteId: 'SITE-1',
          applicationType: 'Type A',
          status: 'Open',
        },
      ],
      count: 2,
      page: 1,
      pageSize: 10,
    };
    const pageTwo = {
      applications: [
        {
          id: '2',
          siteId: 'SITE-2',
          applicationType: 'Type B',
          status: 'Closed',
        },
      ],
      count: 2,
      page: 2,
      pageSize: 10,
    };

    let resolvePageTwo: ((value: typeof pageTwo) => void) | undefined;
    searchApplicationsMock.mockImplementation((variables) => {
      if (variables?.page === 1) {
        return Promise.resolve(pageOne as any);
      }
      return new Promise((resolve) => {
        resolvePageTwo = resolve;
      });
    });

    const { result, rerender } = renderHookWithQueryRouter(
      ({
        variables,
      }: {
        variables: SearchApplicationsV2QueryVariables;
      }) => useApplicationsV2(variables),
      {
        initialEntries: ['/applications-v2'],
        initialProps: {
          variables: DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
        },
      },
    );

    await waitFor(() => expect(result.current.data).toEqual(pageOne));

    const nextVariables = {
      ...DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
      page: 2,
    };
    rerender({ variables: nextVariables });

    await waitFor(() => expect(result.current.isFetching).toBe(true));
    expect(result.current.data).toEqual(pageOne);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isPlaceholderData).toBe(true);

    resolvePageTwo?.(pageTwo as any);
    await waitFor(() => expect(result.current.data).toEqual(pageTwo));
    expect(result.current.isPlaceholderData).toBe(false);
  });

  it('notifies when the search fails', async () => {
    searchApplicationsMock.mockRejectedValue(
      new ApplicationsApi.ApplicationsApiError(),
    );

    const { result } = renderHookWithQueryRouter(() => useApplicationsV2(), {
      initialEntries: ['/applications-v2'],
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(notifyError).toHaveBeenCalledWith(
      ApplicationsApi.APPLICATIONS_SEARCH_ERROR_MESSAGE,
      'Search could not be completed',
      'Please try again or contact support.',
    );
  });

  it('cancels the in-flight request when the hook unmounts', async () => {
    const signals: AbortSignal[] = [];
    searchApplicationsMock.mockImplementation(
      (_variables, signal) =>
        new Promise((resolve, reject) => {
          if (!signal) {
            return;
          }
          signals.push(signal);
          signal.addEventListener('abort', () => {
            reject(
              Object.assign(new Error('Aborted'), { name: 'CanceledError' }),
            );
          });
        }),
    );

    const { unmount } = renderHookWithQueryRouter(() => useApplicationsV2(), {
      initialEntries: ['/applications-v2'],
    });

    await waitFor(() =>
      expect(searchApplicationsMock).toHaveBeenCalledTimes(1),
    );
    expect(signals).toHaveLength(1);

    unmount();

    await waitFor(() => expect(signals[0].aborted).toBe(true));
  });
});
