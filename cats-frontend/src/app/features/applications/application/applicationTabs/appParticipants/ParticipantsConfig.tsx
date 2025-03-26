import { PencilIcon, TickIcon } from '../../../../../components/common/icon';
import {
  FormFieldType,
  IFormField,
} from '../../../../../components/input-controls/IFormField';
import {
  ColumnSize,
  TableColumn,
} from '../../../../../components/table/TableColumn';
import { RequestStatus } from '../../../../../helpers/requests/status';

import {
  GetParticipantRolesQuery,
  GetParticipantNamesQuery,
  GetOrganizationsQuery,
} from './graphql/Participants.generated';

const participantRoleField = (
  options: GetParticipantRolesQuery['getAllParticipantRoles']['data'],
): IFormField => ({
  type: FormFieldType.DropDown,
  label: 'Role',
  options:
    options?.map((role) => ({
      key: role.id.toString(),
      value: role.description,
    })) ?? [],
  graphQLPropertyName: 'description',
  value: '',
  colSize: 'col-lg-12 col-md-12 col-sm-12',
  validation: {
    required: true,
    customMessage: 'Role is required.',
  },
});

const participantNameField = ({
  setSearchParam,
  options,
}: {
  setSearchParam: (searchParam: string) => void;
  options: GetParticipantNamesQuery['getParticipantNames']['data'];
}): IFormField => ({
  label: 'Person',
  graphQLPropertyName: 'fullName',
  placeholder: 'Search by name',
  isLoading: RequestStatus.idle,
  type: FormFieldType.DropDownWithSearch,
  isLabel: false,
  value: '',
  filteredOptions: options ?? [],
  options: options ?? [],
  handleSearch: setSearchParam,
  colSize: 'col-lg-12 col-md-12 col-sm-12',
  customMenuMessage: <span>Please select participant name:</span>,
  tableMode: true,
  validation: {
    required: true,
    customMessage: 'Participant Name is required.',
  },
});

const participantOrganizationField = ({
  setSearchParam,
  options,
}: {
  setSearchParam: (searchParam: string) => void;
  options: GetOrganizationsQuery['getOrganizations']['data'];
}): IFormField => ({
  type: FormFieldType.DropDownWithSearch,
  label: 'Organization',
  graphQLPropertyName: 'name',
  value: '',
  isLoading: RequestStatus.idle,
  placeholder: 'Search by organization',
  filteredOptions: options ?? [],
  options: options ?? [],
  handleSearch: setSearchParam,
  tableMode: true,
  customMenuMessage: <span>Please select organization name:</span>,
  colSize: 'col-lg-12 col-md-12 col-sm-12',
});

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
    validation: {
      required: true,
      customMessage: 'Start Date is required.',
    },
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
    options: [],
    graphQLPropertyName: 'description',
    value: '',
    colSize: 'col-lg-12 col-md-12 col-sm-12',
    validation: {
      required: true,
      customMessage: 'Role is required.',
    },
  },
};

export const getAppParticipantsFormFields = ({
  roles,
  participant,
  organization,
}: {
  roles: {
    options: GetParticipantRolesQuery['getAllParticipantRoles']['data'];
  };
  participant: {
    setSearchParam: (searchParam: string) => void;
    options: GetParticipantNamesQuery['getParticipantNames']['data'];
  };
  organization: {
    setSearchParam: (searchParam: string) => void;
    options: GetOrganizationsQuery['getOrganizations']['data'];
  };
}): IFormField[][] => [
  [appParticipantsForm.isMainParticipant],
  [appParticipantsForm.startDate, appParticipantsForm.endDate],
  [participantRoleField(roles.options)],
  [participantNameField(participant)],
  [participantOrganizationField(organization)],
];

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
      dynamicColumn: true,
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
        validation: {
          required: true,
          customMessage: 'Participant Name is required.',
        },
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
        validation: {
          required: true,
          customMessage: 'Role is required.',
        },
      },
      dynamicColumn: true,
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
        validation: {
          required: true,
          customMessage: 'Participant Name is required.',
        },
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
    participantColumnInternal,
  };
};

export default GetConfig;
