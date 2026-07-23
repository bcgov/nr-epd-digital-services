import { act, waitFor } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { usePeopleSearch } from './usePeopleSearch';
import { renderHookWithQueryRouter } from '../../../../utilities/test/QueryTestUtils';
import * as PeopleApi from '../api/PeopleApi';
import { notifyError } from '../../../components/alert/Alert';

vi.mock('../api/PeopleApi', async () => {
  const actual =
    await vi.importActual<typeof import('../api/PeopleApi')>(
      '../api/PeopleApi',
    );
  return {
    ...actual,
    searchPeople: vi.fn(),
  };
});

vi.mock('../../../components/alert/Alert', () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
  notifyAlert: vi.fn(),
}));

const searchPeopleMock = vi.mocked(PeopleApi.searchPeople);

describe('usePeopleSearch', () => {
  beforeEach(() => {
    searchPeopleMock.mockReset();
    vi.mocked(notifyError).mockReset();
  });

  it('does not search when the term is empty', async () => {
    const { result } = renderHookWithQueryRouter(() => usePeopleSearch(), {
      initialEntries: ['/people'],
    });

    expect(result.current.enabled).toBe(false);
    expect(searchPeopleMock).not.toHaveBeenCalled();
  });

  it('searches and returns data when a term is present', async () => {
    const searchResult = {
      persons: [{ id: 1, firstName: 'Ada', lastName: 'Lovelace' }],
      count: 1,
      page: 1,
      pageSize: 5,
    };
    searchPeopleMock.mockResolvedValue(searchResult as any);

    const { result } = renderHookWithQueryRouter(() => usePeopleSearch(), {
      initialEntries: ['/people?search=ada&page=1&pageSize=5'],
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(searchPeopleMock).toHaveBeenCalledWith(
      {
        searchParam: 'ada',
        page: 1,
        pageSize: 5,
        searchMode: 'OR',
        activeFilter: 'all',
      },
      expect.any(AbortSignal),
    );
    expect(result.current.data).toEqual(searchResult);
  });

  it('cancels the superseded in-flight request when criteria change', async () => {
    const signals: AbortSignal[] = [];
    searchPeopleMock.mockImplementation(
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

    const { result } = renderHookWithQueryRouter(
      () => {
        const [, setUrlParams] = useSearchParams();
        const search = usePeopleSearch();
        return { search, setUrlParams };
      },
      {
        initialEntries: ['/people?search=ada'],
      },
    );

    await waitFor(() => expect(searchPeopleMock).toHaveBeenCalledTimes(1));

    act(() => {
      result.current.setUrlParams({ search: 'bob' });
    });

    await waitFor(() => expect(searchPeopleMock).toHaveBeenCalledTimes(2));
    expect(signals[0].aborted).toBe(true);
  });
});
