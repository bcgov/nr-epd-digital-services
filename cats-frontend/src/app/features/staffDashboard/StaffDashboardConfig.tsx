import { ProgressBar } from 'react-bootstrap';
import {
  CircleExclamation,
  ExclamationTriangleIcon,
  FillEye,
} from '../../components/common/icon';
import { FormFieldType } from '../../components/input-controls/IFormField';
import { ColumnSize, TableColumn } from '../../components/table/TableColumn';
import './StaffDashboard.css';

export const StaffDashboardColumns: TableColumn[] = [
  {
    id: 1,
    displayName: 'Name',
    active: true,
    graphQLPropertyName: 'name',
    columnSize: ColumnSize.Small,
    displayType: {
      type: FormFieldType.Text,
      label: '',
      graphQLPropertyName: 'name',
      value: '',
      colSize: 'col-lg-6 col-md-6 col-sm-12',
      customInputTextCss: 'custom-staff-edit-lbl',
      tableMode: true,
    },
  },
  {
    id: 3,
    displayName: 'Assignments',
    active: true,
    graphQLPropertyName: 'assignments',
    columnSize: ColumnSize.Triple,
    displayType: {
      type: FormFieldType.Label,
      label: '',
      graphQLPropertyName: 'assignments',
      value: '',
      colSize: 'col-lg-12 col-md-12 col-sm-12',
      customInputTextCss: 'custom-staff-edit-lbl',
      tableMode: true,
    },
    renderCell: (value: any, row: any) => {
      let variant = 'success';
      let Icon;

      if (value >= row.capacity) {
        variant = 'danger';
        Icon = CircleExclamation;
      } else if (value > row.capacity / 2) {
        variant = 'warning';
        Icon = ExclamationTriangleIcon;
      }
      return (
        <div className="d-flex align-items-center justify-content-start gap-3 w-100">
          <span className="text-nowrap " style={{ width: '20px' }}>
            {value}
          </span>
          <ProgressBar
            className={`flex-grow-1`}
            variant={variant}
            now={value}
            max={row.capacity}
            label={
              Icon && (
                <div className="d-flex align-items-center justify-content-end">
                  <Icon className="me-2" />
                </div>
              )
            }
          />
        </div>
      );
    },
  },
  {
    id: 3,
    displayName: 'Capacity',
    active: true,
    graphQLPropertyName: 'capacity',
    columnSize: ColumnSize.XtraSmall,
    displayType: {
      type: FormFieldType.Text,
      label: '',
      graphQLPropertyName: 'capacity',
      value: '',
      colSize: 'col-lg-12 col-md-12 col-sm-12',
      customInputTextCss: 'custom-staff-edit-lbl',
      tableMode: true,
    },
    dynamicColumn: true,
  },
  {
    id: 4,
    displayName: 'Actions',
    active: true,
    graphQLPropertyName: 'view',
    displayType: {
      type: FormFieldType.Link,
      label: 'View',
      graphQLPropertyName: 'view',
      value: '',
      customLinkValue: 'View',
      customInputTextCss: 'custom-staff-edit-lbl',
      tableMode: true,
      href: '#',
      customIcon: <FillEye />,
      componentName: 'Manage Staff',
    },
    columnSize: ColumnSize.XtraSmall,
    dynamicColumn: true,
    customHeaderCss: 'custom-tbl-header',
  },
];

export const staffApplicationsColumns: TableColumn[] = [
  {
    id: 1,
    displayName: 'Application ID',
    active: true,
    graphQLPropertyName: 'applicationId',
    columnSize: ColumnSize.Small,
    displayType: {
      type: FormFieldType.Link,
      label: '',
      graphQLPropertyName: 'applicationId',
      value: '',
      colSize: 'col-lg-6 col-md-6 col-sm-12',
      customInputTextCss: 'custom-staff-edit-lbl',
      tableMode: true,
      href: '/applications/',
      componentName: 'Staff',
    },
  },
  {
    id: 2,
    displayName: 'Site Address',
    active: true,
    graphQLPropertyName: 'siteAddress',
    columnSize: ColumnSize.Triple,
    displayType: {
      type: FormFieldType.Text,
      label: '',
      graphQLPropertyName: 'siteAddress',
      value: '',
      colSize: 'col-lg-6 col-md-6 col-sm-12',
      customInputTextCss: 'custom-staff-edit-lbl',
      tableMode: true,
    },
  },
  {
    id: 3,
    displayName: 'Role',
    active: true,
    graphQLPropertyName: 'roleDescription',
    columnSize: ColumnSize.Double,
    displayType: {
      type: FormFieldType.Text,
      label: '',
      graphQLPropertyName: 'roleDescription',
      value: '',
      colSize: 'col-lg-6 col-md-6 col-sm-12',
      customInputTextCss: 'custom-staff-edit-lbl',
      tableMode: true,
    },
  },
  {
    id: 4,
    displayName: 'Start Date',
    active: true,
    graphQLPropertyName: 'effectiveStartDate',
    columnSize: ColumnSize.Double,
    displayType: {
      type: FormFieldType.Text,
      label: '',
      graphQLPropertyName: 'effectiveStartDate',
      value: '',
      colSize: 'col-lg-6 col-md-6 col-sm-12',
      customInputTextCss: 'custom-staff-edit-lbl',
      tableMode: true,
    },
  },
  {
    id: 5,
    displayName: 'End Date',
    active: true,
    graphQLPropertyName: 'effectiveEndDate',
    columnSize: ColumnSize.Double,
    displayType: {
      type: FormFieldType.Text,
      label: '',
      graphQLPropertyName: 'effectiveEndDate',
      value: '',
      colSize: 'col-lg-6 col-md-6 col-sm-12',
      customInputTextCss: 'custom-staff-edit-lbl',
      tableMode: true,
    },
  },
];