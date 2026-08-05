import {
  ApplicationSortByDirection,
  ApplicationSortByField,
} from '../../../../generated/types';
import { applicationsV2Columns } from './applicationsV2Columns';
import {
  SORTABLE_COLUMN_IDS,
  columnIdToSortBy,
  sortByToColumnId,
  sortingStateToSortParams,
  sortParamsToSortingState,
} from './applicationsV2Sort';

describe('applicationsV2Sort', () => {
  it('maps each of the nine sortable columns 1:1 to ApplicationSortByField', () => {
    const expected: Record<
      (typeof SORTABLE_COLUMN_IDS)[number],
      ApplicationSortByField
    > = {
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

    expect(SORTABLE_COLUMN_IDS).toHaveLength(9);

    for (const columnId of SORTABLE_COLUMN_IDS) {
      const field = columnIdToSortBy(columnId);
      expect(field).toBe(expected[columnId]);
      expect(sortByToColumnId(field!)).toBe(columnId);
    }
  });

  it('keeps sorting enabled on the nine backend-supported columns by default', () => {
    const sortableIds = applicationsV2Columns
      .filter((column) => column.enableSorting !== false)
      .map((column) => column.id);

    expect(sortableIds).toEqual([...SORTABLE_COLUMN_IDS]);
  });

  it('does not map unknown columns (no fall-through to ID)', () => {
    expect(columnIdToSortBy('staffAssigned')).toBeUndefined();
    expect(columnIdToSortBy('view')).toBeUndefined();
    expect(sortingStateToSortParams([{ id: 'staffAssigned', desc: false }])).toBeNull();
  });

  it('round-trips sort params through SortingState', () => {
    const sorting = sortParamsToSortingState(
      ApplicationSortByField.SiteAddress,
      ApplicationSortByDirection.Asc,
    );
    expect(sorting).toEqual([{ id: 'siteAddress', desc: false }]);
    expect(sortingStateToSortParams(sorting)).toEqual({
      sortBy: ApplicationSortByField.SiteAddress,
      sortByDir: ApplicationSortByDirection.Asc,
    });
  });
});
