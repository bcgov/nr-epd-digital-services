import { waitFor } from '@testing-library/react';
import { renderHookWithQueryRouter } from '../../../../../utilities/test/QueryTestUtils';
import * as ApplicationsLookupsApi from '../api/ApplicationsLookupsApi';
import { useApplicationsV2FilterLookups } from './useApplicationsV2FilterLookups';

vi.mock('../api/ApplicationsLookupsApi', async () => {
  const actual = await vi.importActual<
    typeof import('../api/ApplicationsLookupsApi')
  >('../api/ApplicationsLookupsApi');
  return {
    ...actual,
    getApplicationsV2FilterLookupOptions: vi.fn(),
  };
});

const getApplicationsV2FilterLookupOptionsMock = vi.mocked(
  ApplicationsLookupsApi.getApplicationsV2FilterLookupOptions,
);

describe('useApplicationsV2FilterLookups', () => {
  beforeEach(() => {
    getApplicationsV2FilterLookupOptionsMock.mockReset();
  });

  it('loads all four lookup option sets from a single request', async () => {
    const options = {
      serviceType: [{ value: 'a', label: 'Alpha' }],
      applicationType: [{ value: '9', label: 'Type A' }],
      status: [{ value: 'Open', label: 'Open' }],
      staffAssigned: [{ value: '1', label: 'Ann Baker' }],
    };
    getApplicationsV2FilterLookupOptionsMock.mockResolvedValue(options);

    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2FilterLookups(),
      { initialEntries: ['/applications-v2'] },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getApplicationsV2FilterLookupOptionsMock).toHaveBeenCalledTimes(1);
    expect(getApplicationsV2FilterLookupOptionsMock).toHaveBeenCalledWith(
      expect.any(AbortSignal),
    );
    expect(result.current.options).toEqual(options);
    expect(result.current.isError).toBe(false);
  });

  it('surfaces an error state when the combined lookup fails', async () => {
    getApplicationsV2FilterLookupOptionsMock.mockRejectedValue(
      new ApplicationsLookupsApi.ApplicationsLookupsApiError(),
    );

    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2FilterLookups(),
      { initialEntries: ['/applications-v2'] },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.isLoading).toBe(false);
  });
});
