import type { ColumnDef, VisibilityState } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { ExternalLink, FileLinesIcon } from '../../../components/common/icon';
import { formatDateUTC } from '../../../helpers/utility';
import StaffAssigned from './StaffAssigned';
import type { ApplicationsSearchResult } from './api/ApplicationsApi';
import { isSortableColumnId } from './applicationsV2Sort';

export type ApplicationV2Row = ApplicationsSearchResult['applications'][number];

/** Columns hidden by default (v1 parity). Omitted ids are visible. */
export const DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY: VisibilityState = {
  dateReceived: false,
  dateCompleted: false,
  siteRiskClassification: false,
  csapReference: false,
  serviceType: false,
  commonName: false,
};

const siteRegistryBaseUrl = () =>
  import.meta.env.VITE_SITE_REGISTRY_URL ||
  window?._env_?.VITE_SITE_REGISTRY_URL;

const formatOptionalUtcDate = (value: string | null | undefined): string =>
  value ? formatDateUTC(value) : '';

const withSortFlag = <TValue,>(
  column: ColumnDef<ApplicationV2Row, TValue>,
): ColumnDef<ApplicationV2Row, TValue> => {
  const id = column.id;
  if (!id || isSortableColumnId(id)) {
    return column;
  }
  return { ...column, enableSorting: false };
};

export const applicationsV2Columns: ColumnDef<ApplicationV2Row, unknown>[] = [
  withSortFlag({
    id: 'id',
    accessorKey: 'id',
    header: 'Application ID',
    cell: ({ row }) => (
      <Link to={`/applications/${row.original.id}`}>{row.original.id}</Link>
    ),
  }),
  withSortFlag({
    id: 'siteId',
    accessorKey: 'siteId',
    header: 'Site ID',
    cell: ({ row }) => {
      const siteId = row.original.siteId;
      return (
        <a
          href={`${siteRegistryBaseUrl()}/site/details/${siteId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="data-table__external-link"
        >
          {siteId}
          <ExternalLink aria-hidden />
        </a>
      );
    },
  }),
  withSortFlag({
    id: 'siteAddress',
    accessorKey: 'siteAddress',
    header: 'Site Address',
  }),
  withSortFlag({
    id: 'applicationType',
    accessorKey: 'applicationType',
    header: 'Application Type',
  }),
  withSortFlag({
    id: 'lastUpdated',
    accessorKey: 'lastUpdated',
    header: 'Last Updated',
    cell: ({ getValue }) => formatDateUTC(getValue<string>()),
  }),
  withSortFlag({
    id: 'dateReceived',
    accessorKey: 'receivedDate',
    header: 'Date Received',
    cell: ({ getValue }) =>
      formatOptionalUtcDate(getValue<string | null | undefined>()),
  }),
  withSortFlag({
    id: 'dateCompleted',
    accessorKey: 'dateCompleted',
    header: 'Date Completed',
    cell: ({ getValue }) =>
      formatOptionalUtcDate(getValue<string | null | undefined>()),
  }),
  withSortFlag({
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
  }),
  withSortFlag({
    id: 'staffAssigned',
    accessorKey: 'staffAssigned',
    header: 'Staff Assigned',
    cell: ({ row }) => <StaffAssigned staff={row.original.staffAssigned} />,
  }),
  withSortFlag({
    id: 'priority',
    accessorKey: 'priority',
    header: 'Priority',
  }),
  withSortFlag({
    id: 'siteRiskClassification',
    accessorKey: 'siteRiskClassification',
    header: 'Site Risk Classification',
  }),
  withSortFlag({
    id: 'csapReference',
    accessorKey: 'csapReference',
    header: 'CSAP Reference',
  }),
  withSortFlag({
    id: 'serviceType',
    accessorKey: 'serviceType',
    header: 'Service Type',
  }),
  withSortFlag({
    id: 'commonName',
    accessorKey: 'commonName',
    header: 'Common Name',
  }),
  withSortFlag({
    id: 'view',
    accessorKey: 'id',
    header: 'View',
    enableHiding: false,
    cell: ({ row }) => (
      <Link
        to={`/applications/${row.original.id}`}
        className="data-table__action-link"
        aria-label={`View application ${row.original.id}`}
      >
        <FileLinesIcon aria-hidden />
        View
      </Link>
    ),
  }),
  withSortFlag({
    id: 'actions',
    accessorKey: 'id',
    header: 'Actions',
    meta: { sticky: 'right' },
    cell: ({ row }) => (
      <Link
        to={`/assignment/${row.original.id}`}
        className="data-table__action-link"
        aria-label={`Manage staff for application ${row.original.id}`}
      >
        <FileLinesIcon aria-hidden />
        Manage Staff
      </Link>
    ),
  }),
];
