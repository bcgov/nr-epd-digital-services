import React, { useCallback, useEffect, useState } from 'react';
import { TableColumn } from '../../../../../components/table/TableColumn';
import { UserType } from '../../../../../helpers/requests/userType';
import { RequestStatus } from '../../../../../helpers/requests/status';
import { UserMode } from '../../../../../helpers/requests/userMode';
import Widget from '../../../../../components/widget/Widget';
import { Button } from '../../../../../components/button/Button';
import { Plus, UserPlus } from '../../../../../components/common/icon';
import { AppParticipantsTableControls } from './AppParticipantsTableControls';
import GetConfig, { getRolesConfig } from './ParticipantsConfig';
import { AppParticipantFilter, CreateAppParticipantDto } from '../../../../../../generated/types';
import {
  GetAppParticipantsByAppIdQuery,
  GetOrganizationsDocument,
  GetParticipantNamesDocument,
  useCreateAppParticipantMutation,
  useGetOrganizationsQuery,
  useGetParticipantNamesQuery,
  useGetParticipantRolesQuery,
} from './graphql/Participants.generated';

import ModalDialog from '../../../../../components/modaldialog/ModalDialog';
import Form from '../../../../../components/form/Form';

import './ParticipantsTable.css';
import {
  getAxiosInstance,
  resultCache,
  sortArray,
  updateFields,
} from '../../../../../helpers/utility';

import { print } from 'graphql';
import { GRAPHQL } from '../../../../../helpers/endpoints';
import { useParams } from 'react-router-dom';
import { set } from 'date-fns';

export const AppParticipantsActionTypes = {
  AddParticipant: 'Add Participant',
  EditParticipant: 'Edit Participant',
  ViewAppParticipants: 'View AppParticipants',
};
interface IParticipantTableProps {
  handleTableChange: (event: any) => void;
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
  handleTableChange,
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
  showApproveRejectSection = showApproveRejectSection ?? false;
  hideLabelForWidget = hideLabelForWidget ?? false;

  approveRejectHandler = approveRejectHandler ?? (() => {});

  const { addAppParticipantsForm, participantColumnInternal } = GetConfig();
  const id = useParams().id;

  const [appParticsForm, setAppParticsForm] = useState(addAppParticipantsForm);

  const [filterOption, setFilterOption] = useState<AppParticipantFilter>(
    AppParticipantFilter.All,
  );

  const onFilterChange = (newFilter: AppParticipantFilter) => {
    setFilterOption(newFilter);
    handleFilterChange(newFilter);
  };

  const [searchParam, setSearchParam] = useState<string>('');
  const [searchParamForOrg, setSearchParamForOrg] = useState<string>('');

  const initialAppParticipantDetails = {
    isMainParticipant: false,
    effectiveStartDate: '',
    effectiveEndDate: '',
    description: '',
    fullName: '',
    name: '',
  };

  const [appParticipant, setAppParticipant] = useState({
    isAppParticipantModal: false,
    appParticipantDetails: initialAppParticipantDetails,
    appParticipantActionType: AppParticipantsActionTypes.ViewAppParticipants,
  });

  const { data } = useGetParticipantRolesQuery();
  const fetchedRoles = data?.getAllParticipantRoles.data?.map((role) => ({
    key: role.id.toString(),
    value: role.description,
  }));

  const [options, setOptions] = useState(fetchedRoles);

  const handleSearchForOrg = useCallback(
    (value: any, graphQLPropertyName?: string) => {
      console.log("nupur - inside handleSearchForOrg value is: ", value);
      setSearchParamForOrg(value.trim());

      const indexToUpdate = appParticsForm.findIndex((row) =>
        row.some((field) => field.graphQLPropertyName === 'name'),
      );

      setAppParticsForm((prev) =>
        updateFields(prev, {
          indexToUpdate,
          updates: {
            isLoading: RequestStatus.success,
            filteredOptions: [],
            handleSearch: handleSearchForOrg,
            customInfoMessage: <></>,
          },
        }),
      );
    },

    [options],
  );

  const handleSearchForParticipant = useCallback(
    (value: any, graphQLPropertyName?: string) => {
      console.log("nupur - inside handleSearchForParticipant value is: ", value);
      setSearchParam(value.trim());
      const indexToUpdate = appParticsForm.findIndex((row) =>
        row.some((field) => field.graphQLPropertyName === 'fullName'),
      );

      setAppParticsForm((prev) =>
        updateFields(prev, {
          indexToUpdate,
          updates: {
            isLoading: RequestStatus.success,
            filteredOptions: [],
            handleSearch: handleSearchForParticipant,
            customInfoMessage: <></>,
          },
        }),
      );
    },

    [options],
  );

  const {data: participantNamesData, refetch: refetchParticipants} = useGetParticipantNamesQuery({
    variables: { searchParam },
    skip: !appParticipant.isAppParticipantModal,
    fetchPolicy: 'cache-and-network'
  })

  const {data: orgNamesData, refetch: refetchOrg} = useGetOrganizationsQuery({
    variables: { searchParamForOrg },
    skip: !appParticipant.isAppParticipantModal,
    fetchPolicy: 'cache-and-network'
  })

  const [participantsNames, setParticipantsNames] = useState<{ __typename?: "DropdownDto" | undefined; key: string; value: string; }[] | null | undefined>();
  const [orgNames, setOrgNames] = useState<{ __typename?: "DropdownDto" | undefined; key: string; value: string; }[] | null | undefined>();

  useEffect(() => {
    console.log("nupur - searchParam is: ", searchParam);
    if (searchParam || searchParamForOrg) {
      const timeoutId = setTimeout(async () => {
        if (searchParam) {
          console.log("nupur - inside searchParam is: ", searchParam);
          setParticipantsNames(participantNamesData?.getParticipantNames?.data);
          setOptions(participantNamesData?.getParticipantNames?.data || []);
          console.log("nupur - participant name: ", participantNamesData?.getParticipantNames?.data);
          const indexToUpdate = appParticsForm.findIndex((row) =>
            row.some((field) => field.graphQLPropertyName === 'fullName'),
          );

          setAppParticsForm((prev) =>
            updateFields(prev, {
              indexToUpdate,
              updates: {
                isLoading: RequestStatus.success,
                options,
                filteredOptions: participantNamesData?.getParticipantNames?.data ?? [],
                customInfoMessage: <></>,
                handleSearch: handleSearchForParticipant,
              },
            }),
          );
        } else if (searchParamForOrg) {
          setOrgNames(orgNamesData?.getOrganizations?.data);
          setOptions(orgNamesData?.getOrganizations?.data || []);
          console.log("nupur - org names are: ", orgNamesData?.getOrganizations?.data);
          const indexToUpdate = appParticsForm.findIndex((row) =>
            row.some((field) => field.graphQLPropertyName === 'name'),
          );

          setAppParticsForm((prev) =>
            updateFields(prev, {
              indexToUpdate,
              updates: {
                isLoading: RequestStatus.success,
                options,
                filteredOptions: orgNamesData?.getOrganizations.data ?? [],
                customInfoMessage: <></>,
                handleSearch: handleSearchForOrg,
              },
            }),
          );
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [searchParam, searchParamForOrg, options, orgNamesData, participantNamesData]);

  handleAddParticipant = () => {
    setAppParticipant({
      isAppParticipantModal: true,
      appParticipantDetails: initialAppParticipantDetails,
      appParticipantActionType: AppParticipantsActionTypes.AddParticipant,
    });
  };

  useEffect(() => {
    const indexToUpdate = appParticsForm.findIndex((row) =>
      row.some((field) => field.graphQLPropertyName === 'description'),
    );

    setAppParticsForm((prev) =>
      updateFields(prev, {
        indexToUpdate,
        updates: {
          isLoading: RequestStatus.success,
          options: fetchedRoles,
          filteredOptions: [],
          //handleSearch,
          customInfoMessage: <></>,
        },
      }),
    );
  }, [appParticipant.isAppParticipantModal]);

  useEffect(() => {
    const indexToUpdate = appParticsForm.findIndex((row) =>
      row.some((field) => field.graphQLPropertyName === 'fullName'),
    );

    setAppParticsForm((prev) =>
      updateFields(prev, {
        indexToUpdate,
        updates: {
          isLoading: RequestStatus.success,
          options,
          filteredOptions: [],
          handleSearch: handleSearchForParticipant,
          customInfoMessage: <></>,
        },
      }),
    );
  }, [appParticipant.isAppParticipantModal]);

  useEffect(() => {
    const indexToUpdate = appParticsForm.findIndex((row) =>
      row.some((field) => field.graphQLPropertyName === 'name'),
    );

    setAppParticsForm((prev) =>
      updateFields(prev, {
        indexToUpdate,
        updates: {
          isLoading: RequestStatus.success,
          options,
          filteredOptions: [],
          handleSearch: handleSearchForOrg,
          customInfoMessage: <></>,
        },
      }),
    );
  }, [appParticipant.isAppParticipantModal]);

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

  const handleAddAppParticipant = async (newParticipant: CreateAppParticipantDto) => {
    try {
      const response = await createAppParticiant({
        variables: {
          newAppParticipant: newParticipant,
        },
      });
      return response;
    } catch (err) {
      console.error('Error adding participant:', err);
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
            headerLabel={appParticipant.appParticipantActionType}
            saveButtonDisabled={
              appParticipant.appParticipantDetails.fullName === '' ||
              appParticipant.appParticipantDetails.description === '' ||
              appParticipant.appParticipantDetails.effectiveStartDate === ''
            }
            closeHandler={(response) => {
              if (response) {
                if (
                  appParticipant.appParticipantActionType ===
                  AppParticipantsActionTypes.AddParticipant
                ) {
                  const newAppParticipant = {
                    applicationId: id ? Number(id) : 0,
                    isMainParticipant:
                      appParticipant.appParticipantDetails.isMainParticipant,
                    personId: parseFloat(
                      appParticipant.appParticipantDetails.fullName,
                    ),
                    organizationId: parseFloat(
                      appParticipant.appParticipantDetails.name,
                    ),
                    participantRoleId: parseFloat(
                      appParticipant.appParticipantDetails.description,
                    ),
                    effectiveStartDate:
                      appParticipant.appParticipantDetails.effectiveStartDate,
                    effectiveEndDate:
                      appParticipant.appParticipantDetails.effectiveEndDate ||
                      null,
                  };
                  handleAddAppParticipant(newAppParticipant)
                    .then((response) => {
                      if (response?.data?.createAppParticipant.success) {
                        handleRefreshParticipants();
                      }
                    })
                    .catch((err) => {
                      console.error('Error create note:', err);
                    });
                }
              }
              setAppParticipant({
                isAppParticipantModal: false,
                appParticipantDetails: initialAppParticipantDetails,
                appParticipantActionType:
                  AppParticipantsActionTypes.ViewAppParticipants,
              });
            }}
          >
            <Form
              formRows={appParticsForm}
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
