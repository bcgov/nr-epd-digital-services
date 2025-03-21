import { PencilIcon, TickIcon } from '../../../../../components/common/icon';
import { FormFieldType } from '../../../../../components/input-controls/IFormField';
import {
  ColumnSize,
  TableColumn,
} from '../../../../../components/table/TableColumn';

export const GetConfig = () => {
  const participantColumnInternal: TableColumn[] = [
    {
      id: 1,
      displayName: 'Main',
      active: true,
      graphQLPropertyName: 'isMainParticipant',
      columnSize: ColumnSize.XtraSmall,
      displayType: {
        type: FormFieldType.Icon,
        label: '',
        isLabel: false,
        graphQLPropertyName: 'isMainParticipant',
        value: '',
        colSize: 'col-lg-6 col-md-6 col-sm-12',
        customLabelCss: 'common-icon-orientation',
        customIcon: <TickIcon />,
        customInputTextCss: 'common-icon-orientation',
        tableMode: true,
      },
    },
    {
      id: 2,
      displayName: 'Name',
      active: true,
      graphQLPropertyName: 'fullName',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.Text,
        label: '',
        isLabel: false,
        graphQLPropertyName: 'fullName',
        value: '',
        colSize: 'col-lg-6 col-md-6 col-sm-12',
        tableMode: true,
      },
      dynamicColumn: true,
    },
    {
      id: 3,
      displayName: 'Organization',
      active: true,
      graphQLPropertyName: 'name',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.Text,
        label: '',
        isLabel: false,
        graphQLPropertyName: 'name',
        value: '',
        colSize: 'col-lg-6 col-md-6 col-sm-12',
        tableMode: true,
      },
      dynamicColumn: true,
    },
    {
      id: 4,
      displayName: 'Role',
      active: true,
      graphQLPropertyName: 'description',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.Text,
        label: '',
        graphQLPropertyName: 'description',
        value: '',
        colSize: 'col-lg-6 col-md-6 col-sm-12',
        tableMode: true,
      },
    },

    {
      id: 5,
      displayName: 'Start Date',
      active: true,
      graphQLPropertyName: 'effectiveStartDate',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.Date,
        graphQLPropertyName: 'effectiveStartDate',
        label: '',
        dateFormat: 'EE, MMM dd, yyyy',
        placeholder: 'EE, MMM dd, yyyy',
        value: '',
        colSize: 'col-lg-6 col-md-6 col-sm-12',
        tableMode: true,
      },
    },
    {
      id: 6,
      displayName: 'End Date',
      active: true,
      graphQLPropertyName: 'effectiveEndDate',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.Date,
        graphQLPropertyName: 'effectiveEndDate',
        label: '',
        dateFormat: 'EE MMM dd yyyy',
        placeholder: 'EE, MMM dd, yyyy',
        value: '',
        colSize: 'col-lg-6 col-md-6 col-sm-12',
        tableMode: true,
      },
    },
    {
      id: 7,
      displayName: 'Ministry Contact',
      active: true,
      graphQLPropertyName: 'isMinistry',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.Icon,
        label: '',
        isLabel: false,
        graphQLPropertyName: 'isMinistry',
        value: '',
        customIcon: <TickIcon />,
        colSize: 'col-lg-6 col-md-6 col-sm-12',
        customLabelCss: ' common-icon-orientation',
        customInputTextCss: 'common-icon-orientation',
        tableMode: true,
      },
      dynamicColumn: true,
    },
    {
      id: 8,
      displayName: 'Actions',
      active: true,
      graphQLPropertyName: 'edit',
      displayType: {
        type: FormFieldType.Link,
        label: 'Edit',
        graphQLPropertyName: 'edit',
        value: '',
        customLinkValue: 'Edit',
        tableMode: true,
        href: '#',
        customIcon: <PencilIcon />,
      },
      columnSize: ColumnSize.XtraSmall,
      dynamicColumn: true,
      customHeaderCss: 'custom-note-tbl-header',
    },
  ];

  return {
    participantColumnInternal,
  };
};

export default GetConfig;
