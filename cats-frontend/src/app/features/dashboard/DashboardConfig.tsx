import { ExternalLink, FileLinesIcon } from '../../components/common/icon';
import { FormFieldType } from '../../components/input-controls/IFormField';
import { ColumnSize, TableColumn } from '../../components/table/TableColumn';

export const actionRequiredColumns: TableColumn[] = [
  {
    id: 1,
    displayName: 'Application ID',
    active: true,
    graphQLPropertyName: 'applicationId',
    displayType: {
      type: FormFieldType.Link,
      label: 'Application ID',
      graphQLPropertyName: 'applicationId',
      value: '',
      customInputTextCss: 'custom-dashboard-input-txt',
      tableMode: true,
      href: '/applications/',
    },
    columnSize: ColumnSize.Default,
    dynamicColumn: true,
  },
  {
    id: 2,
    displayName: 'Site ID',
    active: true,
    graphQLPropertyName: 'siteId',
    displayType: {type: FormFieldType.Label},
    renderCell: (value: any) => {
      return (
        <div className="custom-dashboard-link-wrapper">
          <a
            href={`${import.meta.env.VITE_SITE_REGISTRY_URL}/site/details/${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className={'custom-dashboard-input-txt'}
          >
            {value}
            <span className="ps-2 custom-dashboard-external-link">
              <ExternalLink/>
            </span>
          </a>
        </div>
      );
    },
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
    graphQLPropertyName: 'receivedDate',
    displayType: {
      type: FormFieldType.Date,
      graphQLPropertyName: 'receivedDate',
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
    graphQLPropertyName: 'applicationStatus',
    displayType: {
      type: FormFieldType.Label,
      label: 'Status',
      graphQLPropertyName: 'applicationStatus',
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
    columnSize: ColumnSize.XtraSmall,
    dynamicColumn: true,
  },
  {
    id: 8,
    displayName: 'Details',
    active: true,
    graphQLPropertyName: 'applicationId',
    displayType: {
      type: FormFieldType.Link,
      label: 'View',
      graphQLPropertyName: 'applicationId',
      value: '',
      customLinkValue: 'View',
      customInputTextCss: 'custom-dashboard-link',
      tableMode: true,
      href: '/applications/',
      customIcon: <FileLinesIcon />,
      stickyCol: true,
    },
    columnSize: ColumnSize.Small,
    dynamicColumn: true,
    customHeaderCss: 'custom-dashboard-tbl-header custom-dashboard-tbl-header-sticky',
  },
];
