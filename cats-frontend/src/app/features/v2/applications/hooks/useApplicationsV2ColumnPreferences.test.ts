import { act, waitFor } from '@testing-library/react';
import { renderHookWithQueryRouter } from '../../../../../utilities/test/QueryTestUtils';
import * as ColumnPreferencesApi from '../api/ColumnPreferencesApi';
import { DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY } from '../applicationsV2Columns';
import { useApplicationsV2ColumnPreferences } from './useApplicationsV2ColumnPreferences';

vi.mock('../api/ColumnPreferencesApi', async () => {
  const actual = await vi.importActual<
    typeof import('../api/ColumnPreferencesApi')
  >('../api/ColumnPreferencesApi');
  return {
    ...actual,
    getApplicationsColumnPreferences: vi.fn(),
    saveApplicationsColumnPreferences: vi.fn(),
  };
});

const getPreferencesMock = vi.mocked(
  ColumnPreferencesApi.getApplicationsColumnPreferences,
);
const savePreferencesMock = vi.mocked(
  ColumnPreferencesApi.saveApplicationsColumnPreferences,
);

describe('useApplicationsV2ColumnPreferences', () => {
  beforeEach(() => {
    getPreferencesMock.mockReset();
    savePreferencesMock.mockReset();
  });

  it('initializes visibility by merging saved preferences over defaults', async () => {
    getPreferencesMock.mockResolvedValue([
      { id: 14, displayName: 'Common Name', active: true },
      { id: 6, displayName: 'Status', active: false },
    ]);

    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2ColumnPreferences(),
      { initialEntries: ['/applications'] },
    );

    await waitFor(() =>
      expect(result.current.isLoadingPreferences).toBe(false),
    );

    expect(result.current.columnVisibility).toMatchObject({
      ...DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY,
      commonName: true,
      status: false,
    });
  });

  it('degrades to default visibility when preferences fail to load', async () => {
    getPreferencesMock.mockRejectedValue(
      new ColumnPreferencesApi.ColumnPreferencesApiError(),
    );

    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2ColumnPreferences(),
      { initialEntries: ['/applications'] },
    );

    await waitFor(() =>
      expect(result.current.isLoadingPreferences).toBe(false),
    );

    expect(result.current.columnVisibility).toEqual(
      DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY,
    );
  });

  it('resets session visibility to defaults without saving', async () => {
    getPreferencesMock.mockResolvedValue([
      { id: 14, displayName: 'Common Name', active: true },
    ]);
    savePreferencesMock.mockResolvedValue(undefined);

    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2ColumnPreferences(),
      { initialEntries: ['/applications'] },
    );

    await waitFor(() =>
      expect(result.current.columnVisibility.commonName).toBe(true),
    );

    act(() => {
      result.current.setColumnVisibility({
        ...DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY,
        commonName: true,
        status: false,
      });
    });

    act(() => {
      result.current.resetColumnVisibility();
    });

    expect(result.current.columnVisibility).toEqual(
      DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY,
    );
    expect(savePreferencesMock).not.toHaveBeenCalled();
  });

  it('preserves session toggles made before saved preferences finish loading', async () => {
    let resolvePreferences!: (
      value: Awaited<
        ReturnType<typeof ColumnPreferencesApi.getApplicationsColumnPreferences>
      >,
    ) => void;
    getPreferencesMock.mockReturnValue(
      new Promise((resolve) => {
        resolvePreferences = resolve;
      }),
    );

    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2ColumnPreferences(),
      { initialEntries: ['/applications'] },
    );

    expect(result.current.isLoadingPreferences).toBe(true);

    act(() => {
      result.current.setColumnVisibility({
        ...DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY,
        status: false,
      });
    });

    expect(result.current.isLoadingPreferences).toBe(false);
    expect(result.current.columnVisibility.status).toBe(false);

    await act(async () => {
      resolvePreferences([{ id: 6, displayName: 'Status', active: true }]);
    });

    await waitFor(() => expect(getPreferencesMock).toHaveBeenCalled());

    expect(result.current.columnVisibility.status).toBe(false);
  });

  it('saves the current visibility layout under the applications page', async () => {
    getPreferencesMock.mockResolvedValue(null);
    savePreferencesMock.mockResolvedValue(undefined);

    const { result } = renderHookWithQueryRouter(
      () => useApplicationsV2ColumnPreferences(),
      { initialEntries: ['/applications'] },
    );

    await waitFor(() =>
      expect(result.current.isLoadingPreferences).toBe(false),
    );

    act(() => {
      result.current.setColumnVisibility({
        ...DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY,
        commonName: true,
      });
    });

    await act(async () => {
      await result.current.saveColumnDefaults();
    });

    expect(savePreferencesMock).toHaveBeenCalledTimes(1);
    expect(savePreferencesMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 14,
          displayName: 'Common Name',
          active: true,
        }),
      ]),
    );
  });
});
