import type { VisibilityState } from '@tanstack/react-table';
import type { ColumnConfigInput } from '../../../../generated/types';

export const APPLICATIONS_COLUMN_PREFERENCES_PAGE = 'applications';

export type SavedColumnPreference = {
  id: number;
  active: boolean;
  displayName?: string | null;
  sortOrder?: number | null;
  selectionOrder?: number | null;
};

/** Stable numeric ids shared with the v1 preferences API. */
const COLUMN_PREFERENCE_DEFS = [
  { preferenceId: 1, columnId: 'id', displayName: 'Application ID' },
  { preferenceId: 2, columnId: 'siteId', displayName: 'Site ID' },
  { preferenceId: 3, columnId: 'siteAddress', displayName: 'Site Address' },
  {
    preferenceId: 4,
    columnId: 'applicationType',
    displayName: 'Application Type',
  },
  { preferenceId: 5, columnId: 'lastUpdated', displayName: 'Last Updated' },
  { preferenceId: 15, columnId: 'dateReceived', displayName: 'Date Received' },
  {
    preferenceId: 16,
    columnId: 'dateCompleted',
    displayName: 'Date Completed',
  },
  { preferenceId: 6, columnId: 'status', displayName: 'Status' },
  {
    preferenceId: 7,
    columnId: 'staffAssigned',
    displayName: 'Staff Assigned',
  },
  { preferenceId: 8, columnId: 'priority', displayName: 'Priority' },
  {
    preferenceId: 11,
    columnId: 'siteRiskClassification',
    displayName: 'Site Risk Classification',
  },
  { preferenceId: 12, columnId: 'csapReference', displayName: 'CSAP Reference' },
  { preferenceId: 13, columnId: 'serviceType', displayName: 'Service Type' },
  { preferenceId: 14, columnId: 'commonName', displayName: 'Common Name' },
  { preferenceId: 9, columnId: 'view', displayName: 'View' },
  { preferenceId: 10, columnId: 'actions', displayName: 'Actions' },
] as const;

type PreferenceColumnId = (typeof COLUMN_PREFERENCE_DEFS)[number]['columnId'];

const PREFERENCE_ID_TO_COLUMN_ID = Object.fromEntries(
  COLUMN_PREFERENCE_DEFS.map((column) => [
    column.preferenceId,
    column.columnId,
  ]),
) as Record<number, PreferenceColumnId>;

const isColumnVisible = (
  visibility: VisibilityState,
  columnId: string,
): boolean => visibility[columnId] !== false;

export const mergeApplicationsV2ColumnVisibility = (
  defaults: VisibilityState,
  savedColumns: SavedColumnPreference[] | null | undefined,
): VisibilityState => {
  if (!savedColumns?.length) {
    return { ...defaults };
  }

  const merged: VisibilityState = { ...defaults };

  for (const saved of savedColumns) {
    const columnId = PREFERENCE_ID_TO_COLUMN_ID[saved.id];
    if (!columnId || columnId === 'view') {
      continue;
    }
    merged[columnId] = saved.active;
  }

  return merged;
};

export const visibilityToColumnPreferences = (
  visibility: VisibilityState,
): ColumnConfigInput[] =>
  COLUMN_PREFERENCE_DEFS.map((column, index) => ({
    id: column.preferenceId,
    displayName: column.displayName,
    active:
      column.columnId === 'view'
        ? true
        : isColumnVisible(visibility, column.columnId),
    sortOrder: index + 1,
    selectionOrder: index + 1,
  }));
