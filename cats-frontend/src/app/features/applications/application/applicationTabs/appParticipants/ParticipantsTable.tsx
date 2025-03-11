import React, { useEffect, useState } from 'react';
import { TableColumn } from '../../../../../components/table/TableColumn';
import { UserType } from '../../../../../helpers/requests/userType';
import { RequestStatus } from '../../../../../helpers/requests/status';
import { UserMode } from '../../../../../helpers/requests/userMode';
import Widget from '../../../../../components/widget/Widget';
import { Button } from '../../../../../components/button/Button';
import { Plus, UserPlus } from '../../../../../components/common/icon';
import { AppParticipantsTableControls } from './AppParticipantsTableControls';
import {
  AppParticipantFilter,
  ViewParticipantsRolesDto,
} from '../../../../../../generated/types';
import {
  GetAppParticipantsByAppIdQuery,
  useGetParticipantRolesQuery,
} from './graphql/Participants.generated';

import ModalDialog from '../../../../../components/modaldialog/ModalDialog';
import Form from '../../../../../components/form/Form';

import './ParticipantsTable.css';
import { updateFields } from '../../../../../helpers/utility';
import { useNavigate } from 'react-router-dom';
import {
  addAppParticipantsForm,
  appParticipantsForm,
} from './ParticipantsConfig';

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
}) => {
  showApproveRejectSection = showApproveRejectSection ?? false;
  hideLabelForWidget = hideLabelForWidget ?? false;

  approveRejectHandler = approveRejectHandler ?? (() => {});

  const [appParticsForm, setAppParticsForm] = useState(addAppParticipantsForm);

  const [filterOption, setFilterOption] = useState<AppParticipantFilter>(
    AppParticipantFilter.All,
  );

  const onFilterChange = (newFilter: AppParticipantFilter) => {
    setFilterOption(newFilter);
    handleFilterChange(newFilter);
  };

  const [roles, setRoles] = useState<
    { key: string; value: string }[] | undefined
  >(undefined);

  const [role, setRole] = useState<string | null>(null);
  const [options, setOptions] = useState<any>([]);

  const { data } = useGetParticipantRolesQuery();
  useEffect(() => {
    if(data) {
      const fetchedRoles = data?.getAllParticipantRoles.data?.map((role) => ({
        key: role.id.toString(),
        value: role.description,
      }));
      setRoles(fetchedRoles);
      appParticipantsForm.role.options = fetchedRoles;
    }
  },[data]);

  const initialAppParticipantDetails = {
    isMainParticipant: false,
    startDate: new Date().toString(),
    endDate: new Date().toString(),
    role: '',
    person: '',
    organization: '',
  };

  const [formData, setFormData] = useState(initialAppParticipantDetails);

  const [appParticipant, setAppParticipant] = useState({
    isAppParticipantModal: false,
    appParticipantDetails: initialAppParticipantDetails,
    appParticipantActionType: AppParticipantsActionTypes.ViewAppParticipants,
  });

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
    if (graphQLPropertyName === 'description') {
      const indexToUpdate = appParticsForm.findIndex((row) =>
        row.some((field) => field.graphQLPropertyName === graphQLPropertyName),
      );
      setAppParticsForm((prev) =>
        updateFields(prev, {
          indexToUpdate,
          updates: {
            isLoading: RequestStatus.success,
            options: roles,
            customInfoMessage: '',
          },
        }),
      );
    }

    setFormData({ ...formData, [graphQLPropertyName]: value });
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
        // primaryKeycolumnName="particRoleId"
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
            saveButtonDisabled={true}
            closeHandler={() => {}}
          >
            <Form
              formRows={addAppParticipantsForm}
              formData={formData}
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
