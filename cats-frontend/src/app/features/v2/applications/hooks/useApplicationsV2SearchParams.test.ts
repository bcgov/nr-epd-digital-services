import { act, waitFor } from '@testing-library/react';
import {
  ApplicationSortByDirection,
  ApplicationSortByField,
} from '../../../../../generated/types';
import { useApplicationsV2SearchParams } from './useApplicationsV2SearchParams';
import { renderHookWithQueryRouter } from '../../../../../utilities/test/QueryTestUtils';
import { DEFAULT_APPLICATIONS_SEARCH_VARIABLES } from '../api/ApplicationsApi';

describe('useApplicationsV2SearchParams', () => {
  it('defaults page, pageSize, and sort when params are absent', () => {
    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2SearchParams(),
      { initialEntries: ['/applications-v2'] },
    );

    expect(result.current.page).toBe(
      DEFAULT_APPLICATIONS_SEARCH_VARIABLES.page,
    );
    expect(result.current.pageSize).toBe(
      DEFAULT_APPLICATIONS_SEARCH_VARIABLES.pageSize,
    );
    expect(result.current.variables).toEqual(
      DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
    );
    expect(result.current.sorting).toEqual([
      { id: 'dateReceived', desc: true },
    ]);
  });

  it('reads page and pageSize from the URL', () => {
    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2SearchParams(),
      { initialEntries: ['/applications-v2?page=3&pageSize=25'] },
    );

    expect(result.current.page).toBe(3);
    expect(result.current.pageSize).toBe(25);
    expect(result.current.variables.page).toBe(3);
    expect(result.current.variables.pageSize).toBe(25);
  });

  it('reads sortBy and sortByDir from the URL into variables and sorting', () => {
    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2SearchParams(),
      {
        initialEntries: [
          `/applications-v2?sortBy=${ApplicationSortByField.Status}&sortByDir=${ApplicationSortByDirection.Asc}`,
        ],
      },
    );

    expect(result.current.variables.sortBy).toBe(ApplicationSortByField.Status);
    expect(result.current.variables.sortByDir).toBe(
      ApplicationSortByDirection.Asc,
    );
    expect(result.current.sorting).toEqual([{ id: 'status', desc: false }]);
  });

  it('maps Date Received and Date Completed sort fields without falling through to ID', () => {
    const { result: received } = renderHookWithQueryRouter(
      () => useApplicationsV2SearchParams(),
      {
        initialEntries: [
          `/applications-v2?sortBy=${ApplicationSortByField.ReceivedDate}&sortByDir=${ApplicationSortByDirection.Asc}`,
        ],
      },
    );
    expect(received.current.variables.sortBy).toBe(
      ApplicationSortByField.ReceivedDate,
    );
    expect(received.current.sorting).toEqual([
      { id: 'dateReceived', desc: false },
    ]);

    const { result: completed } = renderHookWithQueryRouter(
      () => useApplicationsV2SearchParams(),
      {
        initialEntries: [
          `/applications-v2?sortBy=${ApplicationSortByField.DateCompleted}&sortByDir=${ApplicationSortByDirection.Desc}`,
        ],
      },
    );
    expect(completed.current.variables.sortBy).toBe(
      ApplicationSortByField.DateCompleted,
    );
    expect(completed.current.sorting).toEqual([
      { id: 'dateCompleted', desc: true },
    ]);
  });

  it('updates the page in the URL', async () => {
    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2SearchParams(),
      { initialEntries: ['/applications-v2'] },
    );

    act(() => {
      result.current.setPage(4);
    });

    await waitFor(() => expect(result.current.page).toBe(4));
    expect(result.current.variables.page).toBe(4);
  });

  it('resets to page 1 when page size changes', async () => {
    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2SearchParams(),
      { initialEntries: ['/applications-v2?page=3&pageSize=10'] },
    );

    act(() => {
      result.current.setPageSize(50);
    });

    await waitFor(() => {
      expect(result.current.pageSize).toBe(50);
      expect(result.current.page).toBe(1);
    });
  });

  it('updates sort in the URL and resets to page 1', async () => {
    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2SearchParams(),
      {
        initialEntries: [
          `/applications-v2?page=3&sortBy=${ApplicationSortByField.Status}&sortByDir=${ApplicationSortByDirection.Asc}`,
        ],
      },
    );

    act(() => {
      result.current.setSorting([{ id: 'priority', desc: true }]);
    });

    await waitFor(() => {
      expect(result.current.variables.sortBy).toBe(
        ApplicationSortByField.Priority,
      );
      expect(result.current.variables.sortByDir).toBe(
        ApplicationSortByDirection.Desc,
      );
      expect(result.current.sorting).toEqual([{ id: 'priority', desc: true }]);
      expect(result.current.page).toBe(1);
    });
  });
});
