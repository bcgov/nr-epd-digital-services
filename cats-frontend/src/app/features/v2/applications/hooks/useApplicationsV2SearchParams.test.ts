import { act, waitFor } from '@testing-library/react';
import {
  ApplicationSortByDirection,
  ApplicationSortByField,
  Filter,
} from '../../../../../generated/types';
import { useApplicationsV2SearchParams } from './useApplicationsV2SearchParams';
import { renderHookWithQueryRouter } from '../../../../../utilities/test/QueryTestUtils';
import { DEFAULT_APPLICATIONS_SEARCH_VARIABLES } from '../api/ApplicationsApi';
import { EMPTY_ADVANCED_FILTERS } from '../filters/applicationsV2Filters';

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

  it('reads search from the URL into variables.searchParam', () => {
    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2SearchParams(),
      { initialEntries: ['/applications-v2?search=site-42'] },
    );

    expect(result.current.search).toBe('site-42');
    expect(result.current.variables.searchParam).toBe('site-42');
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

  it('updates search in the URL and resets to page 1', async () => {
    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2SearchParams(),
      { initialEntries: ['/applications-v2?page=3'] },
    );

    act(() => {
      result.current.setSearch('acme');
    });

    await waitFor(() => {
      expect(result.current.search).toBe('acme');
      expect(result.current.variables.searchParam).toBe('acme');
      expect(result.current.page).toBe(1);
    });
  });

  it('clears search in the URL and resets to page 1', async () => {
    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2SearchParams(),
      { initialEntries: ['/applications-v2?page=2&search=acme'] },
    );

    act(() => {
      result.current.setSearch('');
    });

    await waitFor(() => {
      expect(result.current.search).toBe('');
      expect(result.current.variables.searchParam).toBe('');
      expect(result.current.page).toBe(1);
    });
  });

  it('keeps GraphQL filter as All and maps advanced filters from the URL', () => {
    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2SearchParams(),
      {
        initialEntries: [
          '/applications-v2?id=7&priority=High&dateReceivedFrom=2024-01-01&dateReceivedTo=2024-01-31',
        ],
      },
    );

    expect(result.current.variables.filter).toBe(Filter.All);
    expect(result.current.variables.filterId).toBe('7');
    expect(result.current.variables.filterPriority).toBe('High');
    expect(result.current.variables.filterDateReceivedFrom).toBe('2024-01-01');
    expect(result.current.variables.filterDateReceivedTo).toBe('2024-01-31');
    expect(result.current.advancedFilters).toEqual({
      ...EMPTY_ADVANCED_FILTERS,
      id: '7',
      priority: 'High',
      dateReceivedFrom: '2024-01-01',
      dateReceivedTo: '2024-01-31',
    });
    expect(result.current.filterPills).toEqual([
      { key: 'id', label: 'Application ID', value: '7' },
      {
        key: 'dateReceived',
        label: 'Date Received',
        value: '2024-01-01 - 2024-01-31',
      },
      { key: 'priority', label: 'Priority', value: 'High' },
    ]);
  });

  it('applies advanced filters to the URL and resets to page 1', async () => {
    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2SearchParams(),
      { initialEntries: ['/applications-v2?page=4'] },
    );

    act(() => {
      result.current.applyAdvancedFilters({
        ...EMPTY_ADVANCED_FILTERS,
        siteId: '99',
        invoiceStatus: 'paid',
      });
    });

    await waitFor(() => {
      expect(result.current.variables.filterSiteId).toBe('99');
      expect(result.current.variables.filterInvoiceStatus).toBe('paid');
      expect(result.current.page).toBe(1);
      expect(result.current.filterPills).toEqual([
        { key: 'siteId', label: 'Site ID', value: '99' },
        { key: 'invoiceStatus', label: 'Invoice Status', value: 'Paid' },
      ]);
    });
  });

  it('resets advanced filters in the URL and resets to page 1', async () => {
    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2SearchParams(),
      {
        initialEntries: ['/applications-v2?page=2&id=1&priority=Low'],
      },
    );

    act(() => {
      result.current.resetAdvancedFilters();
    });

    await waitFor(() => {
      expect(result.current.advancedFilters).toEqual(EMPTY_ADVANCED_FILTERS);
      expect(result.current.variables.filterId).toBeUndefined();
      expect(result.current.variables.filterPriority).toBeUndefined();
      expect(result.current.variables.filter).toBe(Filter.All);
      expect(result.current.filterPills).toEqual([]);
      expect(result.current.page).toBe(1);
    });
  });

  it('removes a filter pill URL keys and resets to page 1', async () => {
    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2SearchParams(),
      {
        initialEntries: [
          '/applications-v2?page=2&priority=High&dateReceivedFrom=2024-01-01&dateReceivedTo=2024-01-31',
        ],
      },
    );

    act(() => {
      result.current.removeFilterPill({
        key: 'dateReceived',
        label: 'Date Received',
        value: '2024-01-01 - 2024-01-31',
      });
    });

    await waitFor(() => {
      expect(result.current.variables.filterDateReceivedFrom).toBeUndefined();
      expect(result.current.variables.filterDateReceivedTo).toBeUndefined();
      expect(result.current.variables.filterPriority).toBe('High');
      expect(result.current.page).toBe(1);
      expect(result.current.filterPills).toEqual([
        { key: 'priority', label: 'Priority', value: 'High' },
      ]);
    });
  });
});
