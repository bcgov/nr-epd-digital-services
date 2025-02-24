import { FormFieldType } from "../../../../../components/input-controls/IFormField";
import { ColumnSize, TableColumn } from "../../../../../components/table/TableColumn";
import { RequestStatus } from "../../../../../helpers/requests/status";

export const GetConfig = () => {
  const participantColumnInternal: TableColumn[] = [
    {
      id: 1,
      displayName: 'Participant Name',
      active: true,
      graphQLPropertyName: 'psnorgId',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.DropDownWithSearch,
        label: '',
        isLabel: false,
        graphQLPropertyName: 'psnorgId',
        placeholder: 'Please enter participant name.',
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
          customMessage: 'Participant Name is required.',
        },
      },
    },
    {
      id: 2,
      displayName: 'Role(s)',
      active: true,
      graphQLPropertyName: 'prCode',
      columnSize: ColumnSize.Double,
      displayType: {
        type: FormFieldType.DropDown,
        label: '',
        graphQLPropertyName: 'prCode',
        placeholder: 'Please select the role',
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
      graphQLPropertyName: 'effectiveDate',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.Date,
        graphQLPropertyName: 'effectiveDate',
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
      id: 5,
      displayName: 'Note',
      active: true,
      graphQLPropertyName: 'note',
      columnSize: ColumnSize.Triple,
      displayType: {
        type: FormFieldType.Text,
        label: '',
        placeholder: 'Note',
        graphQLPropertyName: 'note',
        value: '',
        colSize: 'col-lg-12 col-md-12 col-sm-12',
        customLabelCss: 'custom-participant-lbl-text',
        customInputTextCss: 'custom-participant-input-text',
        customEditLabelCss: 'custom-participant-edit-label',
        customEditInputTextCss: 'custom-participant-edit-input',
        tableMode: true,
      },
    },
  ];

  return {
    participantColumnInternal,
  };
};

export default GetConfig;
