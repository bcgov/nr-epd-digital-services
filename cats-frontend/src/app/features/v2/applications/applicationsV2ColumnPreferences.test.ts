import type { VisibilityState } from '@tanstack/react-table';
import { DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY } from './applicationsV2Columns';
import {
  APPLICATIONS_COLUMN_PREFERENCES_PAGE,
  mergeApplicationsV2ColumnVisibility,
  visibilityToColumnPreferences,
} from './applicationsV2ColumnPreferences';

describe('applicationsV2ColumnPreferences', () => {
  it('merges saved preferences over default visibility by stable column id', () => {
    const merged = mergeApplicationsV2ColumnVisibility(
      DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY,
      [
        { id: 14, displayName: 'Common Name', active: true },
        { id: 6, displayName: 'Status', active: false },
        { id: 999, displayName: 'Unknown', active: false },
      ],
    );

    expect(merged).toMatchObject({
      ...DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY,
      commonName: true,
      status: false,
    });
    expect(merged).not.toHaveProperty('999');
  });

  it('keeps defaults when saved preferences are missing', () => {
    expect(
      mergeApplicationsV2ColumnVisibility(
        DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY,
        null,
      ),
    ).toEqual(DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY);

    expect(
      mergeApplicationsV2ColumnVisibility(
        DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY,
        undefined,
      ),
    ).toEqual(DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY);

    expect(
      mergeApplicationsV2ColumnVisibility(
        DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY,
        [],
      ),
    ).toEqual(DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY);
  });

  it('always keeps View visible even if saved as inactive', () => {
    const merged = mergeApplicationsV2ColumnVisibility(
      DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY,
      [{ id: 9, displayName: 'View', active: false }],
    );

    expect(merged.view).not.toBe(false);
  });

  it('serializes visibility into a Save Default payload for the applications page', () => {
    const visibility: VisibilityState = {
      ...DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY,
      commonName: true,
      status: false,
    };

    const columns = visibilityToColumnPreferences(visibility);

    expect(APPLICATIONS_COLUMN_PREFERENCES_PAGE).toBe('applications');
    expect(columns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 14,
          displayName: 'Common Name',
          active: true,
        }),
        expect.objectContaining({
          id: 6,
          displayName: 'Status',
          active: false,
        }),
        expect.objectContaining({
          id: 15,
          displayName: 'Date Received',
          active: false,
        }),
        expect.objectContaining({
          id: 1,
          displayName: 'Application ID',
          active: true,
        }),
        expect.objectContaining({
          id: 9,
          displayName: 'View',
          active: true,
        }),
      ]),
    );
    expect(columns).toHaveLength(16);
  });
});
