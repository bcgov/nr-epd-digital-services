import { get } from 'http';
import { PencilIcon, TickIcon } from '../../../../../components/common/icon';
import { FormFieldType, IFormField } from '../../../../../components/input-controls/IFormField';
import {
  ColumnSize,
  TableColumn,
} from '../../../../../components/table/TableColumn';
import { RequestStatus } from '../../../../../helpers/requests/status';
import { useGetParticipantRolesQuery } from './graphql/Participants.generated';


export const getRolesConfig = () => {
  const { data } = useGetParticipantRolesQuery();
  //console.log("roles data" , data);
  const fetchedRoles = data?.getAllParticipantRoles.data?.map((role) => ({
    key: role.id.toString(),
    value: role.description,
  }));
  return fetchedRoles;
};

export const GetConfig = () => {
  const getRoles = getRolesConfig();
  const appParticipantsForm: { [key: string]: IFormField } = {
    isMainParticipant: {
      type: FormFieldType.Switch,
      label: 'Main Participant',
      graphQLPropertyName: 'isMainParticipant',
      value: false,
      colSize: 'col-lg-12 col-md-12 col-sm-12', 
    },
    startDate: {
      type: FormFieldType.Date,
      label: 'Start Date',
      graphQLPropertyName: 'effectiveStartDate',
      value: '',
      colSize: 'col-lg-6 col-md-6 col-sm-12',
      placeholder: 'EE, MMM dd, yyyy',
      dateFormat: 'EE, MMM dd, yyyy',
      isDisabled: false,
    },
    endDate: {  
      type: FormFieldType.Date,
      label: 'End Date',
      graphQLPropertyName: 'effectiveEndDate',
      value: '',
      placeholder: 'EE, MMM dd, yyyy',
      dateFormat: 'EE, MMM dd, yyyy',
      colSize: 'col-lg-6 col-md-6 col-sm-12',
      isDisabled: false,
    },
    role: {
      type: FormFieldType.DropDown,
      label: 'Role',
      options: getRoles,
      graphQLPropertyName: 'description',
      value: '',
      colSize: 'col-lg-12 col-md-12 col-sm-12',
    },
    participantName: {
      label: 'Person',
      graphQLPropertyName: 'fullName',
      value: '',
      placeholder: 'Search by name',
      isLoading: RequestStatus.idle,
      type: FormFieldType.DropDownWithSearch,
      isLabel: false,
      options: [],
      filteredOptions: [],
      colSize: 'col-lg-6 col-md-6 col-sm-12',
      customMenuMessage: <span>Please select participant name:</span>,
      tableMode: true,
      handleSearch: () => {},
      
    },
    organization: {
      type: FormFieldType.DropDownWithSearch,
      label: 'Organization',
      graphQLPropertyName: 'name',
      value: '',
      placeholder: 'Search by organization',
      options: [],
      filteredOptions: [],
      handleSearch: () => {},
      colSize: 'col-lg-12 col-md-12 col-sm-12',
    },
  };
   
  const addAppParticipantsForm: IFormField[][] = [
    [appParticipantsForm.isMainParticipant], [appParticipantsForm.startDate,
    appParticipantsForm.endDate], [appParticipantsForm.role],
    [appParticipantsForm.participantName], [appParticipantsForm.organization],
  ];
  //console.log("nupur - addAppParticipantsForm", addAppParticipantsForm);
  
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
        dateFormat: 'EE MMM dd yyyy',
        placeholder: 'EE MMM dd yyyy',
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
        placeholder: 'EE MMM dd yyyy',
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
    addAppParticipantsForm,
    participantColumnInternal,
  };
};

export default GetConfig;
