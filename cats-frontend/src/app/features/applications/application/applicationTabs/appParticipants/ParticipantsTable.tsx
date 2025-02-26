import React from 'react';
import { TableColumn } from '../../../../../components/table/TableColumn';
import { UserType } from '../../../../../helpers/requests/userType';
import { RequestStatus } from '../../../../../helpers/requests/status';
import { User } from 'oidc-client-ts';
import { UserMode } from '../../../../../helpers/requests/userMode';
import Widget from '../../../../../components/widget/Widget';
import { Button } from '../../../../../components/button/Button';
import { UserPlus } from '../../../../../components/common/icon';
import App from '../../../../../../App';

interface IParticipantTableProps {
  handleTableChange: (event: any) => void;
  handleWidgetCheckBox: (event: any) => void;
  internalRow: TableColumn[];
  userType: UserType;
  formData: {
    [key: string]: any;
  }[];
  status: RequestStatus;
  viewMode: UserMode;
  handleTableSort: (row: any, ascDir: any) => void;
  handleAddParticipant: () => void;
  selectedRows: {
    participantId: any;
    psnorgId: any;
    prCode: string;
    particRoleId: string;
  }[];
  handleRemoveParticipant: (particIsDelete?: boolean) => void;
  handleItemClick: (value: string) => void;
  approveRejectHandler?: (value: boolean) => void;
  showApproveRejectSection?: boolean;
  hideLabelForWidget?: boolean;
}

const ParticipantTable: React.FC<IParticipantTableProps> = ({
  handleTableChange,
  handleWidgetCheckBox,
  internalRow,
  userType,
  formData,
  status,
  viewMode,
  handleTableSort,
  handleAddParticipant,
  selectedRows,
  handleRemoveParticipant,
  handleItemClick,
  showApproveRejectSection,
  approveRejectHandler,
  hideLabelForWidget,
}) => {
  showApproveRejectSection = showApproveRejectSection ?? false;
  hideLabelForWidget = hideLabelForWidget ?? false;

  approveRejectHandler = approveRejectHandler ?? (() => {});

  const AppParticipantsData = [
    {
      isMainParticipant:  true,
      Name: 'Org1',
      ParticipantRole: 'Client',
      EffectiveStartDatete: '23rd June 2021',
      EffectiveEndDate: '',
      isMinistry: false,
    },
    {
        isMainParticipant:  false,
        Name: 'Org2',
        ParticipantRole: 'Worker',
        EffectiveStartDatete: '23rd June 2021',
        EffectiveEndDate: '',
        isMinistry: false,
    },
    {
        isMainParticipant:  true,
        Name: 'Org3',
        ParticipantRole: 'CSA',
        EffectiveStartDatete: '23rd June 2021',
        EffectiveEndDate: '',
        isMinistry: true,
    },
];

  return (
    <div>
      <Widget
        currentPage={1}
        changeHandler={handleTableChange}
        handleCheckBoxChange={(event) => handleWidgetCheckBox(event)}
        title={'Participants'}
        tableColumns={internalRow}
        tableData={formData}
        tableIsLoading={status ?? RequestStatus.idle}
        // allowRowsSelect={viewMode === UserMode.EditMode}
        aria-label="App Participant Widget"
        customLabelCss="custom-participant-widget-lbl"
        hideTable={false}
        hideTitle={hideLabelForWidget}
        // editMode={
        //   viewMode === UserMode.EditMode &&
        //   userType === UserType.Internal
        // }
        hideWidgetCheckbox={false}
        primaryKeycolumnName="particRoleId"
        sortHandler={(row, ascDir) => {
          handleTableSort(row, ascDir);
        }}
      >
        {
          userType === UserType.Internal && (
            <div className="d-flex gap-2 flex-wrap">
              <Button variant="secondary" onClick={handleAddParticipant}>
                <UserPlus />
                Add Participant
              </Button>
            </div>
          )}
      </Widget>
    </div>
  );
};

export default ParticipantTable;
