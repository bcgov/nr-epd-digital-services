import React, { useCallback, useEffect, useState } from 'react';
import { TableColumn } from '../../../../../components/table/TableColumn';
import { UserType } from '../../../../../helpers/requests/userType';
import { RequestStatus } from '../../../../../helpers/requests/status';
import { UserMode } from '../../../../../helpers/requests/userMode';
import Widget from '../../../../../components/widget/Widget';
import { Button } from '../../../../../components/button/Button';
import { Plus } from '../../../../../components/common/icon';
import { AppParticipantsTableControls } from './AppParticipantsTableControls';
import GetConfig, { getAppParticipantsFormFields } from './ParticipantsConfig';
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
import { updateFields } from '../../../../../helpers/utility';
import { g } from 'vitest/dist/chunks/suite.d.FvehnV49';
import { is } from 'date-fns/locale';
import { Update } from 'vite';

export const AppParticipantsActionTypes = {
  AddParticipant: 'Add Participant',
  EditParticipant: 'Edit Participant',
  ViewAppParticipants: 'View AppParticipants',
};
interface IParticipantTableProps {
  //handleTableChange: (event: any) => void;
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
  //handleTableChange,
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
  const [editName, setEditName] = useState<AppParticipantName>({id: 0, fullName: ''} as AppParticipantName);
  const [editOrg, setEditOrg] = useState<AppParticipantOrganization>({id: 0, name: ''} as AppParticipantOrganization);

  const [filterOption, setFilterOption] = useState<AppParticipantFilter>(
    AppParticipantFilter.All,
  );

  const onFilterChange = (newFilter: AppParticipantFilter) => {
    setFilterOption(newFilter);
    handleFilterChange(newFilter);
  };

  const [searchParam, setSearchParam] = useState<string>('');
  const [searchParamForOrg, setSearchParamForOrg] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState(false);

  const { data: rolesData } = useGetParticipantRolesQuery();

  const { data: participantNamesData } = useGetParticipantNamesQuery({
    variables: { searchParam },
    skip: !searchParam.trim(),
  });

  const { data: orgNamesData } = useGetOrganizationsQuery({
    variables: { searchParamForOrg },
    skip: !searchParamForOrg.trim(),
  });

  const addAppParticipantsForm = getAppParticipantsFormFields({
    roles: {
      options: rolesData?.getAllParticipantRoles.data ?? [],
      //isDisabled: AppParticipantsActionTypes.EditParticipant ? true : false,
      
    },
    participant: {
      setSearchParam,
      options: participantNamesData?.getParticipantNames.data ?? [{key: editName?.id?.toString(), value: editName?.fullName}],
      //setIsDisabled: isDisabled,
      //isDisabled: AppParticipantsActionTypes.EditParticipant ? true : false,
    },
    organization: {
      setSearchParam: setSearchParamForOrg,
      options: orgNamesData?.getOrganizations.data as { key: string; value: string; }[] ?? [{key: editOrg?.id?.toString(), value: editOrg?.name}],
      //isDisabled: AppParticipantsActionTypes.EditParticipant ? true : false,
    },
  });

  const initialAppParticipantDetails = {
    id: '',
    isMainParticipant: false,
    effectiveStartDate: '',
    effectiveEndDate: '',
    participantRole: '',
    person: '',
    organization: '', // Assign an empty string as the initial value
  };

  const [appParticipant, setAppParticipant] = useState({
    isAppParticipantModal: false,
    appParticipantDetails: initialAppParticipantDetails,
    appParticipantActionType: AppParticipantsActionTypes.ViewAppParticipants,
  });
 
  type AppParticipantData = NonNullable<GetAppParticipantsByAppIdQuery['getAppParticipantsByAppId']['data']>;
  type AppParticipantName = AppParticipantData[number]['person'];
  type AppParticipantOrganization = AppParticipantData[number]['organization'];
  type AppParticipantRole = AppParticipantData[number]['participantRole'];

  handleAddParticipant = () => {
    setAppParticipant({
      isAppParticipantModal: true,
      appParticipantDetails: initialAppParticipantDetails,
      appParticipantActionType: AppParticipantsActionTypes.AddParticipant,
    });
  };

  const handleFormChange = (
    graphQLPropertyName: any,
    value: String | [Date, Date],
  ) => {
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
    updatedParticipant: UpdateAppParticipantDto,
  ) => {
    return updateAppParticiant({
      variables: {
        updateAppParticipant: updatedParticipant,
      },
      onCompleted: () => {
        handleRefreshParticipants();
      },
      onError: (err) => {
        console.error('Error updating participant:', err);
      },
    });
  }

  const handleTableChange = (event: any) => {
    const appParticipantEditDetails = event.row;
    const appParticipantName = event.row.person as AppParticipantName;
    const appParticipantOrganization = event.row.organization as AppParticipantOrganization;
    const appParticipantRole = event.row.participantRole as AppParticipantRole;
    
    if (event.property.includes('edit')) {
      //setIsDisabled(true);
      handleChangesForEdit('participantRole', {isDisabled: true});
      handleChangesForEdit('person', {isDisabled: true});
      handleChangesForEdit('organization', {isDisabled: true});
      setEditName(appParticipantName);
      setEditOrg(appParticipantOrganization);
      setAppParticipant({
        isAppParticipantModal: true,
        appParticipantDetails: {
          id: appParticipantEditDetails.id,
          isMainParticipant: appParticipantEditDetails.isMainParticipant,
          effectiveStartDate: appParticipantEditDetails.effectiveStartDate,
          effectiveEndDate: appParticipantEditDetails.effectiveEndDate,
          participantRole: appParticipantRole.id.toString(),
          person: appParticipantName.id.toString(),
          organization: appParticipantOrganization?.id?.toString() ?? '',
        },
        appParticipantActionType: AppParticipantsActionTypes.EditParticipant,
      });
      console.log('nupur - updated appParticipant details', appParticipant);
    }
  };

  const saveApplicationParticipantHandler = () => {
    const newAppParticipant = {
      applicationId: id ? Number(id) : 0,
      isMainParticipant:
        appParticipant.appParticipantDetails.isMainParticipant,
      personId: parseFloat(
        appParticipant.appParticipantDetails.person,
      ),
      organizationId: parseFloat(
        appParticipant.appParticipantDetails.organization,
      ),
      participantRoleId: parseFloat(
        appParticipant.appParticipantDetails.participantRole,
      ),
      effectiveStartDate:
        appParticipant.appParticipantDetails.effectiveStartDate,
      effectiveEndDate:
        appParticipant.appParticipantDetails.effectiveEndDate ||
        null,
    }

    const updatedAppParticipant = {
      id: Number(appParticipant.appParticipantDetails.id),
      applicationId: id ? Number(id) : 0,
      effectiveStartDate:
        appParticipant.appParticipantDetails.effectiveStartDate,
      effectiveEndDate:
        appParticipant.appParticipantDetails.effectiveEndDate
    }
    if (appParticipant.appParticipantActionType === AppParticipantsActionTypes.AddParticipant && id) {
      handleAddAppParticipant(newAppParticipant);
    } else {
      handleUpdateAppParticipant(updatedAppParticipant);
    }
  };

  const handleChangesForEdit = (
    graphQLPropertyName: any,
    value: {},
  ) => {
    
    console.log('nupur - handleChangesForEdit', graphQLPropertyName, value);
      const indexToUpdate = addAppParticipantsForm.findIndex((row) =>
        row.some((field) => field.graphQLPropertyName === graphQLPropertyName),
      );
      
      console.log('nupur - indexToUpdate', indexToUpdate);
      updateFields(addAppParticipantsForm, {
        indexToUpdate,
        updates: {
          isDisabled: true
        },
      }),
         
      console.log('nupur - addAppParticipantsForm after update', addAppParticipantsForm);
      setAppParticipant({
        ...appParticipant,
        appParticipantDetails: {
          ...appParticipant.appParticipantDetails,
          [graphQLPropertyName]: value,
        },
      });

      console.log('nupur - appParticipant', appParticipant);
      console.log('nupur - addAppParticipantsForm', addAppParticipantsForm);
    //setFormData({ ...formData, [graphQLPropertyName]: value });
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
            headerLabel={appParticipant.appParticipantActionType}
            saveButtonDisabled={
              appParticipant.appParticipantDetails.person === '' ||
              appParticipant.appParticipantDetails.participantRole === '' ||
              appParticipant.appParticipantDetails.effectiveStartDate === ''
            }
            closeHandler={(response) => {
              if (!response) {
                setAppParticipant({
                  isAppParticipantModal: false,
                  appParticipantDetails: initialAppParticipantDetails,
                  appParticipantActionType:
                    AppParticipantsActionTypes.ViewAppParticipants,
                });
              } 
              saveApplicationParticipantHandler();
            }}
          >
            <Form
              formRows={addAppParticipantsForm}
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
