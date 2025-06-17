import { FileLinesIcon } from '../../components/common/icon';
import { FormFieldType } from '../../components/input-controls/IFormField';
import { ColumnSize, TableColumn } from '../../components/table/TableColumn';

export const actionRequiredColumns: TableColumn[] = [
  {
    id: 1,
    displayName: 'Application ID',
    active: true,
    graphQLPropertyName: 'siteId',
    displayType: {
      type: FormFieldType.Link,
      label: 'Application ID',
      graphQLPropertyName: 'id',
      value: '',


      customInputTextCss: 'custom-dashboard-input-txt',


      tableMode: true,
      href: 'applications/',
    },
    linkRedirectionURL: 'applications/',
    columnSize: ColumnSize.Small,
    dynamicColumn: true,
  },
  {
    id: 2,
    displayName: 'Site ID',
    active: true,
    graphQLPropertyName: 'siteId',
    displayType: {
      type: FormFieldType.Link,
      label: 'Site ID',
      graphQLPropertyName: 'siteId',
      value: '',

      customInputTextCss: 'custom-dashboard-input-txt',


      tableMode: true,
      href: 'site/details/',
    },
    linkRedirectionURL: 'site/details/',
    columnSize: ColumnSize.Small,
    dynamicColumn: true,
  },
  {
    id: 3,
    displayName: 'Site Address',
    active: true,
    graphQLPropertyName: 'address',
    displayType: {
      type: FormFieldType.Label,
      label: 'Site Address',
      graphQLPropertyName: 'address',
      value: '',
      tableMode: true,

      customInputTextCss: 'custom-dashboard-input-txt',
    },
    columnSize: ColumnSize.Default,
    dynamicColumn: true,
  },
  {
    id: 4,
    displayName: 'Application Type',
    active: true,
    graphQLPropertyName: 'applicationType',
    displayType: {
      type: FormFieldType.Label,
      label: 'Application Type',
      graphQLPropertyName: 'applicationType',
      value: '',
      tableMode: true,

      customInputTextCss: 'custom-dashboard-input-txt',
    },
    columnSize: ColumnSize.Default,
    dynamicColumn: true,
  },
  {
    id: 5,
    displayName: 'Start Date',
    active: true,
    graphQLPropertyName: 'whenUpdated',
    displayType: {
      type: FormFieldType.Date,
      graphQLPropertyName: 'whenUpdated',
      label: '',
      placeholder: 'MM/DD/YY',
      value: '',
      colSize: 'col-lg-6 col-md-6 col-sm-12',
      tableMode: true,

      customInputTextCss: 'custom-dashboard-input-txt',
    },
    columnSize: ColumnSize.Small,
    dynamicColumn: true,
  },
  {
    id: 6,
    displayName: 'Status',
    active: true,
    graphQLPropertyName: 'status',
    displayType: {
      type: FormFieldType.Label,
      label: 'Status',
      graphQLPropertyName: 'status',
      value: '',
      tableMode: true,

      customInputTextCss: 'custom-dashboard-input-txt',
    },
    columnSize: ColumnSize.Default,
    dynamicColumn: true,
  },
  {
    id: 7,
    displayName: 'Priority',
    active: true,
    graphQLPropertyName: 'priority',
    displayType: {
      type: FormFieldType.Label,
      label: 'Priority',
      graphQLPropertyName: 'priority',
      value: '',
      tableMode: true,

      customInputTextCss: 'custom-dashboard-input-txt',
    },
    columnSize: ColumnSize.Small,
    dynamicColumn: true,
  },
  {
    id: 8,
    displayName: 'Details',
    active: true,
    graphQLPropertyName: 'id',
    displayType: {
      type: FormFieldType.Link,
      label: 'Details',
      graphQLPropertyName: 'id',
      value: '',
      customLinkValue: 'Details',
      customInputTextCss: 'custom-dashboard-link',
      tableMode: true,
      href: 'applications/',
      customIcon: <FileLinesIcon />,
    },
    linkRedirectionURL: 'applications/',
    columnSize: ColumnSize.XtraSmall,
    dynamicColumn: true,
    stickyCol: true,
  },
];
