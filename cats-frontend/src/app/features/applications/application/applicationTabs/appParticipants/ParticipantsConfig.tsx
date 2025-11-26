import { is } from 'date-fns/locale';
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
  GetOrganizationsQuery,
  GetParticipantNamesQuery,
  GetParticipantRolesQuery,
} from './graphql/Participants.generated';

const participantRoleField = (
  options: GetParticipantRolesQuery['getAllParticipantRoles']['data'],
): IFormField => ({
  type: FormFieldType.DropDown,
  label: 'Role',
  isDisabled: false,
  options:
    options?.map((role) => ({
      key: role.id.toString(),
      value: role.description,
    })) ?? [],
  graphQLPropertyName: 'participantRole',
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
  isDisabled: false,
  graphQLPropertyName: 'person',
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
  isDisabled: false,
  graphQLPropertyName: 'organization',
  value: '',
  isLoading: RequestStatus.idle,
  placeholder: 'Search by organization',
  filteredOptions: options ?? [],
  options: options ?? [],
  handleSearch: setSearchParam,
  customMenuMessage: <span>Please select organization name:</span>,
  colSize: 'col-lg-12 col-md-12 col-sm-12',
});

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
  [appParticipantsForm.startDate, appParticipantsForm.endDate],
  [participantRoleField(roles.options)],
  [participantNameField(participant)],
  [participantOrganizationField(organization)],
];

const appParticipantsForm: { [key: string]: IFormField } = {
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
};

const editParticipantRoleField = (
  options: GetParticipantRolesQuery['getAllParticipantRoles']['data'],
): IFormField => ({
  type: FormFieldType.DropDown,
  label: 'Role',
  isDisabled: true,
  options:
    options?.map((role) => ({
      key: role.id.toString(),
      value: role.description,
    })) ?? [],
  graphQLPropertyName: 'participantRole',
  value: '',
  colSize: 'col-lg-12 col-md-12 col-sm-12',
});

const editParticipantNameField = ({
  options,
}: {
  options: GetParticipantNamesQuery['getParticipantNames']['data'];
}): IFormField => ({
  label: 'Person',
  isDisabled: true,
  graphQLPropertyName: 'person',
  isLoading: RequestStatus.idle,
  type: FormFieldType.DropDownWithSearch,
  isLabel: false,
  value: '',
  filteredOptions: options ?? [],
  options: options ?? [],
  colSize: 'col-lg-12 col-md-12 col-sm-12',
});

const editParticipantOrganizationField = ({
  options,
}: {
  options: GetOrganizationsQuery['getOrganizations']['data'];
}): IFormField => ({
  type: FormFieldType.DropDownWithSearch,
  label: 'Organization',
  isDisabled: true,
  graphQLPropertyName: 'organization',
  value: '',
  isLoading: RequestStatus.idle,
  filteredOptions: options ?? [],
  options: options ?? [],
  colSize: 'col-lg-12 col-md-12 col-sm-12',
});

export const getEditAppParticipantsFormFields = ({
  roles,
  participant,
  organization,
}: {
  roles: {
    options: GetParticipantRolesQuery['getAllParticipantRoles']['data'];
  };
  participant: {
    options: GetParticipantNamesQuery['getParticipantNames']['data'];
  };
  organization: {
    options: GetOrganizationsQuery['getOrganizations']['data'];
  };
}): IFormField[][] => [
  [appParticipantsForm.startDate, appParticipantsForm.endDate],
  [editParticipantRoleField(roles.options)],
  [editParticipantNameField(participant)],
  [editParticipantOrganizationField(organization)],
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
      graphQLPropertyName: 'person.fullName',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.Text,
        label: '',
        isLabel: false,
        graphQLPropertyName: 'person.fullName',
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
      graphQLPropertyName: 'organization.name',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.Text,
        label: '',
        isLabel: false,
        graphQLPropertyName: 'organization.name',
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
      graphQLPropertyName: 'participantRole.description',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.Text,
        label: '',
        graphQLPropertyName: 'participantRole.description',
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
