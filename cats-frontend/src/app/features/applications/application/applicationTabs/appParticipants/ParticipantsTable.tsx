import React, { act, useCallback, useEffect, useState } from 'react';
import { TableColumn } from '../../../../../components/table/TableColumn';
import { UserType } from '../../../../../helpers/requests/userType';
import { RequestStatus } from '../../../../../helpers/requests/status';
import { UserMode } from '../../../../../helpers/requests/userMode';
import Widget from '../../../../../components/widget/Widget';
import { Button } from '../../../../../components/button/Button';
import { Plus } from '../../../../../components/common/icon';
import { AppParticipantsTableControls } from './AppParticipantsTableControls';
import GetConfig, {
  getAppParticipantsFormFields,
  getEditAppParticipantsFormFields,
} from './ParticipantsConfig';
import {
  AppParticipantFilter,
  CreateAppParticipantDto,
  UpdateAppParticipantDto,
} from '../../../../../../generated/types';
import {
  GetAppParticipantsByAppIdQuery,
  useCreateAppParticipantMutation,
  useGetOrganizationsQuery,
  useGetParticipantNamesQuery,
  useGetParticipantRolesQuery,
  useUpdateAppParticipantMutation,
} from './graphql/Participants.generated';

import ModalDialog from '../../../../../components/modaldialog/ModalDialog';
import Form from '../../../../../components/form/Form';

import './ParticipantsTable.css';

import { useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { notifyAlert, notifyError } from '@cats/components/alert/Alert';

export const AppParticipantsActionTypes = {
  AddParticipant: 'Add Participant',
  EditParticipant: 'Edit Participant',
  ViewAppParticipants: 'View AppParticipants',
};

interface IParticipantTableProps {
  internalRow: TableColumn[];
  userType: UserType;
  appParticsData: GetAppParticipantsByAppIdQuery['getAppParticipantsByAppId']['data'];
  loading: boolean;
  viewMode: UserMode;
  handleTableSort: (row: any, ascDir: any) => void;
  handleAddParticipant: () => void;
  handleRemoveParticipant: (particIsDelete?: boolean) => void;
  handleItemClick: (value: string) => void;
  approveRejectHandler?: (value: boolean) => void;
  showApproveRejectSection?: boolean;
  hideLabelForWidget?: boolean;
  handleFilterChange: (filter: AppParticipantFilter) => void;
  filter: AppParticipantFilter;
  handleRefreshParticipants: () => void;
}

const ParticipantTable: React.FC<IParticipantTableProps> = ({
  internalRow,
  userType,
  appParticsData,
  loading,
  viewMode,
  handleTableSort,
  handleAddParticipant,
  handleRemoveParticipant,
  handleItemClick,
  showApproveRejectSection,
  approveRejectHandler,
  hideLabelForWidget,
  handleFilterChange,
  filter,
  handleRefreshParticipants,
}) => {
  const id = useParams().id;
  const [editName, setEditName] = useState<AppParticipantName>({
    id: 0,
    fullName: '',
  } as AppParticipantName);
  const [editOrg, setEditOrg] = useState<AppParticipantOrganization>({
    id: 0,
    name: '',
  } as AppParticipantOrganization);

  const [filterOption, setFilterOption] = useState<AppParticipantFilter>(
    AppParticipantFilter.All,
  );

  const onFilterChange = (newFilter: AppParticipantFilter) => {
    setFilterOption(newFilter);
    handleFilterChange(newFilter);
  };

  const [searchParam, setSearchParam] = useState<string>('');
  const [searchParamForOrg, setSearchParamForOrg] = useState<string>('');

  const { data: rolesData } = useGetParticipantRolesQuery();

  const { data: participantNamesData } = useGetParticipantNamesQuery({
    variables: { searchParam },
    skip: !searchParam.trim(),
  });

  const { data: orgNamesData } = useGetOrganizationsQuery({
    variables: { searchParamForOrg },
    skip: !searchParamForOrg.trim(),
  });

  const [actionType, setActionType] = useState(
    AppParticipantsActionTypes.ViewAppParticipants,
  );

  const addAppParticipantsForm = getAppParticipantsFormFields({
    roles: {
      options: rolesData?.getAllParticipantRoles.data ?? [],
    },
    participant: {
      setSearchParam,
      options: participantNamesData?.getParticipantNames.data,
    },
    organization: {
      setSearchParam: setSearchParamForOrg,
      options: orgNamesData?.getOrganizations.data,
    },
  });

  const editAppParticipantsForm = getEditAppParticipantsFormFields({
    roles: {
      options: rolesData?.getAllParticipantRoles.data ?? [],
    },
    participant: {
      options: [{ key: editName?.id?.toString(), value: editName?.fullName }],
    },
    organization: {
      options: [{ key: editOrg?.id?.toString(), value: editOrg?.name }] as {
        key: string;
        value: string;
      }[],
    },
  });

  type appParticipantDetailsType = {
    id: string;
    isMainParticipant: boolean;
    effectiveStartDate: Date | string | null;
    effectiveEndDate: Date | string | null;
    participantRole: string;
    person: string;
    organization: string; // Assign an empty string as the initial value
  };
  const initialAppParticipantDetails: appParticipantDetailsType = {
    id: '',
    isMainParticipant: false,
    effectiveStartDate: null,
    effectiveEndDate: null,
    participantRole: '',
    person: '',
    organization: '', // Assign an empty string as the initial value
  };

  const [appParticipant, setAppParticipant] = useState({
    isAppParticipantModal: false,
    appParticipantDetails: initialAppParticipantDetails,
    appParticipantActionType: actionType,
  });

  type AppParticipantData = NonNullable<
    GetAppParticipantsByAppIdQuery['getAppParticipantsByAppId']['data']
  >;
  type AppParticipantName = AppParticipantData[number]['person'];
  type AppParticipantOrganization = AppParticipantData[number]['organization'];
  type AppParticipantRole = AppParticipantData[number]['participantRole'];

  handleAddParticipant = () => {
    setActionType(AppParticipantsActionTypes.AddParticipant);
    setAppParticipant({
      isAppParticipantModal: true,
      appParticipantDetails: initialAppParticipantDetails,
      appParticipantActionType: actionType,
    });
  };

  const [formErrors, setFormErrors] = useState<string | null>(null);

  const getComparableEndDate = (
    value: String | [Date, Date] | null,
  ): Date | null => {
    if (!value) return null;

    if (Array.isArray(value)) {
      return value[1] || ''; // pick the end date of a range
    }

    return value instanceof Date && !isNaN(value.getTime()) ? value : null;
  };

  const handleFormChange = (
    graphQLPropertyName: any,
    value: String | [Date, Date] | null,
  ) => {
    const result = false;
    if (appParticipant.appParticipantDetails.effectiveStartDate && value) {
      const endDate = getComparableEndDate(value);
      const result =
        endDate &&
        endDate <
          new Date(appParticipant.appParticipantDetails.effectiveStartDate);
      if (graphQLPropertyName === 'effectiveEndDate') {
        if (result) {
          // If the end date is before the start date, reset it to null and alert user
          value = null;
          notifyAlert('End Date cannot be before Start Date');
        }
      }
    }

    if (value && typeof value === 'object' && 'key' in value) {
      value = (value as { key: string }).key;
    }

    setAppParticipant({
      ...appParticipant,
      appParticipantDetails: {
        ...appParticipant.appParticipantDetails,
        [graphQLPropertyName]: value,
      },
    });
  };

  const [createAppParticiant] = useCreateAppParticipantMutation();

  const handleAddAppParticipant = async (
    newParticipant: CreateAppParticipantDto,
  ) => {
    return createAppParticiant({
      variables: {
        newAppParticipant: newParticipant,
      },
      onCompleted: () => {
        handleRefreshParticipants();
      },
      onError: (err) => {
        console.error('Error adding participant:', err);
      },
    });
  };

  const [updateAppParticiant] = useUpdateAppParticipantMutation();
  const handleUpdateAppParticipant = async (
    updateParticipant: UpdateAppParticipantDto,
  ) => {
    return updateAppParticiant({
      variables: {
        updateAppParticipant: updateParticipant,
      },
      onCompleted: () => {
        handleRefreshParticipants();
      },
      onError: (err) => {
        console.error('Error updating participant:', err);
      },
    });
  };

  const handleTableChange = (event: any) => {
    setActionType(AppParticipantsActionTypes.EditParticipant);
    const appParticipantEditDetails = event.row;
    const appParticipantName = event.row.person as AppParticipantName;
    const appParticipantOrganization = event.row
      .organization as AppParticipantOrganization;
    const appParticipantRole = event.row.participantRole as AppParticipantRole;

    if (event.property.includes('edit')) {
      setEditName(appParticipantName);
      setEditOrg(appParticipantOrganization);

      setAppParticipant({
        isAppParticipantModal: true,
        appParticipantDetails: {
          id: appParticipantEditDetails.id,
          isMainParticipant: appParticipantEditDetails.isMainParticipant,
          effectiveStartDate: appParticipantEditDetails.effectiveStartDate,
          effectiveEndDate: appParticipantEditDetails.effectiveEndDate || null,
          participantRole: appParticipantRole.id.toString(),
          person: appParticipantName.id.toString(),
          organization: appParticipantOrganization?.id?.toString() ?? '',
        },
        appParticipantActionType: actionType,
      });
    }
  };

  const saveApplicationParticipantHandler = () => {
    const input = {
      applicationId: id ? Number(id) : 0,
      effectiveStartDate:
        appParticipant.appParticipantDetails.effectiveStartDate,
      effectiveEndDate:
        appParticipant.appParticipantDetails.effectiveEndDate || null,
    };

    const newAppParticipant = {
      isMainParticipant: appParticipant.appParticipantDetails.isMainParticipant,
      personId: parseFloat(appParticipant.appParticipantDetails.person),
      organizationId: parseFloat(
        appParticipant.appParticipantDetails.organization,
      ),
      participantRoleId: parseFloat(
        appParticipant.appParticipantDetails.participantRole,
      ),
      ...input,
    };

    const updateAppParticipant = {
      id: Number(appParticipant.appParticipantDetails.id),
      ...input,
    };
    if (actionType === AppParticipantsActionTypes.AddParticipant && id) {
      handleAddAppParticipant(newAppParticipant);
    } else {
      handleUpdateAppParticipant(updateAppParticipant);
    }
  };

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h4 className="participants-title">Participants</h4>

        {userType === UserType.Internal && (
          <div className="d-flex gap-2 flex-wrap">
            <AppParticipantsTableControls
              handleFilterChange={onFilterChange}
              filter={filterOption}
            />
          </div>
        )}
      </div>
      <Widget
        currentPage={1}
        changeHandler={handleTableChange}
        title={''}
        tableColumns={internalRow}
        tableData={appParticsData ?? []}
        tableIsLoading={loading ? RequestStatus.loading : RequestStatus.idle}
        aria-label="App Participant Widget"
        hideTable={false}
        hideTitle={hideLabelForWidget}
        sortHandler={(row, ascDir) => {
          handleTableSort(row, ascDir);
        }}
      >
        {userType === UserType.Internal && (
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="secondary" onClick={handleAddParticipant}>
              <Plus />
              Add Participant
            </Button>
          </div>
        )}
        {appParticipant.isAppParticipantModal && (
          <ModalDialog
            headerLabel={actionType}
            saveButtonDisabled={
              appParticipant.appParticipantDetails.person === '' ||
              appParticipant.appParticipantDetails.participantRole === '' ||
              appParticipant.appParticipantDetails.effectiveStartDate === ''
            }
            closeHandler={(response) => {
              if (response) {
                saveApplicationParticipantHandler();
              }
              setActionType(AppParticipantsActionTypes.ViewAppParticipants);
              setAppParticipant({
                isAppParticipantModal: false,
                appParticipantDetails: initialAppParticipantDetails,
                appParticipantActionType: actionType,
              });
            }}
          >
            <Form
              formRows={
                actionType === AppParticipantsActionTypes.EditParticipant
                  ? editAppParticipantsForm
                  : addAppParticipantsForm
              }
              formData={appParticipant?.appParticipantDetails ?? {}}
              handleInputChange={(graphQLPropertyName, value) =>
                handleFormChange(graphQLPropertyName, value)
              }
            />
          </ModalDialog>
        )}
      </Widget>
    </div>
  );
};

export default ParticipantTable;
