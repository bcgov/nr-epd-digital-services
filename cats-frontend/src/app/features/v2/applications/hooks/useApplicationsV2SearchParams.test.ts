import { act, waitFor } from '@testing-library/react';
import { useApplicationsV2SearchParams } from './useApplicationsV2SearchParams';
import { renderHookWithQueryRouter } from '../../../../../utilities/test/QueryTestUtils';
import { DEFAULT_APPLICATIONS_SEARCH_VARIABLES } from '../api/ApplicationsApi';

describe('useApplicationsV2SearchParams', () => {
  it('defaults page and pageSize when params are absent', () => {
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
});
