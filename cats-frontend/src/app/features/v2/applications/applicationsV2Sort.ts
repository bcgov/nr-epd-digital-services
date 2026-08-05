import type { SortingState } from '@tanstack/react-table';
import {
  ApplicationSortByDirection,
  ApplicationSortByField,
} from '../../../../generated/types';

/** Column ids that map 1:1 to backend ApplicationSortByField values. */
export const SORTABLE_COLUMN_IDS = [
  'id',
  'siteId',
  'siteAddress',
  'applicationType',
  'lastUpdated',
  'status',
  'priority',
  'dateReceived',
  'dateCompleted',
] as const;

export type SortableColumnId = (typeof SORTABLE_COLUMN_IDS)[number];

const COLUMN_TO_SORT_FIELD: Record<SortableColumnId, ApplicationSortByField> = {
  id: ApplicationSortByField.Id,
  siteId: ApplicationSortByField.SiteId,
  siteAddress: ApplicationSortByField.SiteAddress,
  applicationType: ApplicationSortByField.ApplicationType,
  lastUpdated: ApplicationSortByField.LastUpdated,
  status: ApplicationSortByField.Status,
  priority: ApplicationSortByField.Priority,
  dateReceived: ApplicationSortByField.ReceivedDate,
  dateCompleted: ApplicationSortByField.DateCompleted,
};

const SORT_FIELD_TO_COLUMN = Object.fromEntries(
  Object.entries(COLUMN_TO_SORT_FIELD).map(([columnId, field]) => [
    field,
    columnId,
  ]),
) as Record<ApplicationSortByField, SortableColumnId>;

export const isSortableColumnId = (id: string): id is SortableColumnId =>
  (SORTABLE_COLUMN_IDS as readonly string[]).includes(id);

export const columnIdToSortBy = (
  columnId: string,
): ApplicationSortByField | undefined => {
  if (!isSortableColumnId(columnId)) {
    return undefined;
  }
  return COLUMN_TO_SORT_FIELD[columnId];
};

export const sortByToColumnId = (
  sortBy: ApplicationSortByField,
): SortableColumnId => SORT_FIELD_TO_COLUMN[sortBy];

export const sortParamsToSortingState = (
  sortBy: ApplicationSortByField,
  sortByDir: ApplicationSortByDirection,
): SortingState => [
  {
    id: sortByToColumnId(sortBy),
    desc: sortByDir === ApplicationSortByDirection.Desc,
  },
];

export const sortingStateToSortParams = (
  sorting: SortingState,
): {
  sortBy: ApplicationSortByField;
  sortByDir: ApplicationSortByDirection;
} | null => {
  const active = sorting[0];
  if (!active) {
    return null;
  }
  const sortBy = columnIdToSortBy(active.id);
  if (!sortBy) {
    return null;
  }
  return {
    sortBy,
    sortByDir: active.desc
      ? ApplicationSortByDirection.Desc
      : ApplicationSortByDirection.Asc,
  };
};
