import type { ColumnDef } from '@tanstack/react-table';
import type { ApplicationsSearchResult } from './api/ApplicationsApi';

export type ApplicationV2Row = ApplicationsSearchResult['applications'][number];

/**
 * Starter column set for Applications V2: v1 default-visible data fields that
 * the current search query returns, as text-only cells.
 * Links, avatars, and row actions arrive in a later issue.
 */
export const applicationsV2Columns: ColumnDef<ApplicationV2Row, unknown>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'Application ID',
    enableSorting: false,
  },
  {
    id: 'siteId',
    accessorKey: 'siteId',
    header: 'Site ID',
    enableSorting: false,
  },
  {
    id: 'applicationType',
    accessorKey: 'applicationType',
    header: 'Application Type',
    enableSorting: false,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
  },
];
