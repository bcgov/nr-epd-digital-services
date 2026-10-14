import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { FileLinesIcon } from '@cats/components/common/icon';
import { formatDateUTC } from '@cats/helpers/utility';
import type { ApplicationLinkRow } from './LinkedApplications.generated';

const formatOptionalUtcDate = (value: string | null | undefined) =>
  value ? formatDateUTC(value) : '';

export const linkedApplicationColumns: ColumnDef<
  ApplicationLinkRow,
  unknown
>[] = [
  {
    id: 'submittedDate',
    accessorKey: 'submittedDate',
    header: 'Date Submitted',
    cell: ({ getValue }) =>
      formatOptionalUtcDate(getValue<string | null | undefined>()),
  },
  {
    id: 'fileName',
    accessorKey: 'fileName',
    header: 'File Name',
    cell: ({ getValue }) => getValue<string | null | undefined>() ?? '',
  },
  {
    id: 'applicationId',
    accessorKey: 'applicationId',
    header: 'Application ID',
    cell: ({ getValue }) => {
      const applicationId = getValue<number | null | undefined>();
      if (applicationId == null) {
        return '';
      }
      return <Link to={`/applications/${applicationId}`}>{applicationId}</Link>;
    },
  },
  {
    id: 'view',
    header: 'Actions',
    enableSorting: false,
    cell: ({ row }) => {
      const applicationId = row.original.applicationId;
      if (applicationId == null) {
        return null;
      }
      return (
        <Link
          to={`/applications/${applicationId}`}
          className="data-table__action-link"
          aria-label={`View application ${applicationId}`}
        >
          <FileLinesIcon aria-hidden />
          View
        </Link>
      );
    },
  },
];
