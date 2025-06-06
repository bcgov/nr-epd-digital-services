import { TableColumn } from '@cats/components/table/TableColumn';
import { FormFieldType } from '@cats/components/input-controls/IFormField';
import { formatDateUTC } from '@cats/helpers/utility';
import { FileLinesIcon } from '@cats/components/common/icon';
import { StatusType } from './statusType';
import StatusPill from './statusPill';

export const indexTableColumns: TableColumn[] = [
  {
    id: 1,
    displayName: 'Invoice ID',
    active: true,
    graphQLPropertyName: 'id',
    isDefault: true,
    sortOrder: 1,
    isChecked: true,
    displayType: { type: FormFieldType.Label, label: 'Invoice ID' },
  },
  {
    id: 2,
    displayName: 'Subject',
    active: true,
    graphQLPropertyName: 'subject',
    isDefault: true,
    sortOrder: 2,
    isChecked: true,
    displayType: { type: FormFieldType.Label, label: 'Subject' },
  },
  {
    id: 3,
    displayName: 'Issued',
    active: true,
    graphQLPropertyName: 'issuedDate',
    isDefault: true,
    sortOrder: 3,
    isChecked: true,
    displayType: { type: FormFieldType.Label, label: 'Issued' },
    renderCell: (value: any) => formatDateUTC(value),
  },
  {
    id: 4,
    displayName: 'Due',
    active: true,
    graphQLPropertyName: 'dueDate',
    isDefault: true,
    sortOrder: 4,
    isChecked: true,
    displayType: { type: FormFieldType.Label, label: 'Due' },
    renderCell: (value: any) => formatDateUTC(value),
  },
  {
    id: 5,
    displayName: 'Status',
    active: true,
    graphQLPropertyName: 'status',
    isDefault: true,
    sortOrder: 5,
    isChecked: true,
    displayType: { type: FormFieldType.Label, label: 'Status' },
    renderCell: (value: StatusType) => {
      return <StatusPill status={value} />;
    },
  },
  {
    id: 6,
    displayName: 'Amount',
    active: true,
    graphQLPropertyName: 'totalInCents',
    isDefault: true,
    sortOrder: 6,
    isChecked: true,
    displayType: { type: FormFieldType.Label, label: 'Amount' },
    renderCell: (value: any) => `$${(value / 100).toFixed(2)}`,
  },
  {
    id: 7,
    displayName: 'View',
    active: true,
    graphQLPropertyName: 'id',
    isDefault: true,
    sortOrder: 7,
    isChecked: true,
    displayType: {
      type: FormFieldType.Link,
      label: 'View',
      href: '/invoices/',
      customLinkValue: 'View',
      customIcon: <FileLinesIcon />,
    },
  },
];
