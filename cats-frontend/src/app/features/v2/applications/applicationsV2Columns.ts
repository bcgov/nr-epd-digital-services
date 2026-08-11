import type { ColumnDef } from '@tanstack/react-table';
import type { ApplicationsSearchResult } from './api/ApplicationsApi';

export type ApplicationV2Row = ApplicationsSearchResult['applications'][number];

/**
 * Starter column set for Applications V2: the nine backend-sortable fields
 * (sort UI), with text cells for fields the current search query returns.
 * Remaining display columns, links, avatars, and row actions arrive later.
 *
 * Sorting is on by default; set `enableSorting: false` to opt out.
 */
export const applicationsV2Columns: ColumnDef<ApplicationV2Row, unknown>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'Application ID',
  },
  {
    id: 'siteId',
    accessorKey: 'siteId',
    header: 'Site ID',
  },
  {
    id: 'siteAddress',
    header: 'Site Address',
  },
  {
    id: 'applicationType',
    accessorKey: 'applicationType',
    header: 'Application Type',
  },
  {
    id: 'lastUpdated',
    header: 'Last Updated',
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
  },
  {
    id: 'priority',
    header: 'Priority',
  },
  {
    id: 'dateReceived',
    header: 'Date Received',
  },
  {
    id: 'dateCompleted',
    header: 'Date Completed',
  },
];
