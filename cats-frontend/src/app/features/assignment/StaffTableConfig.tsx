import { ProgressBar } from 'react-bootstrap';
import {
  CircleExclamation,
  ExclamationTriangleIcon,
  XmarkIcon,
} from '../../components/common/icon';
import { FormFieldType } from '../../components/input-controls/IFormField';
import { ColumnSize, TableColumn } from '../../components/table/TableColumn';
import { RequestStatus } from '../../helpers/requests/status';
import CustomProgressBar from '@cats/components/progress-bar/progressBar';

export const GetConfig = () => {
  const staffColumnInternal: TableColumn[] = [
    {
      id: 1,
      displayName: 'Staff Member',
      active: true,
      graphQLPropertyName: 'personId',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.DropDownWithSearch,
        label: '',
        isLabel: false,
        graphQLPropertyName: 'personId',
        placeholder: 'Search Staff',
        isLoading: RequestStatus.idle,
        value: '',
        options: [],
        filteredOptions: [],
        colSize: 'col-lg-6 col-md-6 col-sm-12',
        customLabelCss: 'custom-participant-lbl-text',
        customInputTextCss: 'custom-participant-input-text',
        customEditLabelCss: 'custom-participant-edit-label',
        customEditInputTextCss: 'custom-participant-edit-input',
        customPlaceholderCss: 'custom-participant-search-placeholder',
        customMenuMessage: <span>Please select site participant name:</span>,
        tableMode: true,
        handleSearch: () => {},
        validation: {
          required: true,
          customMessage: 'Staff Member is required.',
        },
      },
    },
    {
      id: 7,
      displayName: 'Current Assignments',
      active: true,
      graphQLPropertyName: 'currentCapacity',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.Label,
        label: '',
        graphQLPropertyName: 'currentCapacity',
        value: '',
        colSize: 'col-lg-12 col-md-12 col-sm-12',
        customInputTextCss: 'custom-staff-edit-lbl',
        tableMode: true,
      },
      renderCell: (value: any, row: any) => {
        return <CustomProgressBar inputValue={value} />;
      },
    },
    {
      id: 2,
      displayName: 'Role',
      active: true,
      graphQLPropertyName: 'roleId',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.DropDown,
        label: '',
        graphQLPropertyName: 'roleId',
        placeholder: 'Select Role',
        value: '',
        options: [],
        colSize: 'col-lg-6 col-md-6 col-sm-12',
        customLabelCss: 'custom-participant-lbl-text',
        customInputTextCss: 'custom-participant-input-text',
        customEditLabelCss: 'custom-participant-edit-label',
        customEditInputTextCss: 'custom-participant-edit-input',
        tableMode: true,
        customInfoMessage: null,
        validation: {
          required: true,
          customMessage: 'Role(s) is required.',
        },
      },
    },
    {
      id: 3,
      displayName: 'Start Date',
      active: true,
      graphQLPropertyName: 'startDate',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.Date,
        graphQLPropertyName: 'startDate',
        label: '',
        placeholder: 'MM/DD/YY',
        value: '',
        colSize: 'col-lg-6 col-md-6 col-sm-12',
        customLabelCss: 'custom-participant-lbl-text',
        customInputTextCss: 'custom-participant-input-text',
        customEditLabelCss: 'custom-participant-edit-label',
        customEditInputTextCss:
          'custom-participant-edit-input .rs.input .rs-input-group-addon',
        tableMode: true,
        validation: {
          required: true,
          customMessage: 'Start Date is required.',
        },
      },
    },
    {
      id: 4,
      displayName: 'End Date',
      active: true,
      graphQLPropertyName: 'endDate',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.Date,
        graphQLPropertyName: 'endDate',
        label: '',
        placeholder: 'MM/DD/YY',
        value: '',
        colSize: 'col-lg-6 col-md-6 col-sm-12',
        customLabelCss: 'custom-participant-lbl-text',
        customInputTextCss: 'custom-participant-input-text',
        customEditLabelCss: 'custom-participant-edit-label',
        customEditInputTextCss:
          'custom-participant-edit-input .rs.input .rs-input-group-addon',
        tableMode: true,
      },
    },
    {
      id: 6,
      displayName: 'Actions',
      active: true,
      graphQLPropertyName: 'remove',
      displayType: {
        type: FormFieldType.IconButton,
        label: 'Remove',
        placeholder: '',
        graphQLPropertyName: 'remove',
        tableMode: true,
        stickyCol: true,
        customIcon: <XmarkIcon />,
        customLinkValue: 'Remove',
        customLabelCss: '',
        customInputTextCss: 'primary-icon-button',
        value: 'Remove',
      },
      columnSize: ColumnSize.XtraSmall,

      stickyCol: true,
    },
  ];

  return {
    staffColumnInternal,
  };
};

export default GetConfig;
