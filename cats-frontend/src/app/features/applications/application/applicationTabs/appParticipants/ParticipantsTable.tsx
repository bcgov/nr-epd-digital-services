import React, { useState } from 'react';
import { TableColumn } from '../../../../../components/table/TableColumn';
import { UserType } from '../../../../../helpers/requests/userType';
import { RequestStatus } from '../../../../../helpers/requests/status';
import { UserMode } from '../../../../../helpers/requests/userMode';
import Widget from '../../../../../components/widget/Widget';
import { Button } from '../../../../../components/button/Button';
import { Plus, UserPlus } from '../../../../../components/common/icon';
import { GetAppParticipantsByAppIdQuery } from './hooks/Participants.generated';
import { AppParticipantsTableControls } from './AppParticipantsTableControls';
import { AppParticipantFilter } from '../../../../../../generated/types';
import './ParticipantsTable.css';
import { set } from 'date-fns';
interface IParticipantTableProps {
  handleTableChange: (event: any) => void;
  handleWidgetCheckBox: (event: any) => void;
  internalRow: TableColumn[];
  userType: UserType;
  formData: GetAppParticipantsByAppIdQuery['getAppParticipantsByAppId']['data'];
  loading: boolean;
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
  handleFilterChange: (filter: AppParticipantFilter) => void;
  filter: AppParticipantFilter;
}

const ParticipantTable: React.FC<IParticipantTableProps> = ({
  handleTableChange,
  handleWidgetCheckBox,
  internalRow,
  userType,
  formData,
  loading,
  viewMode,
  handleTableSort,
  handleAddParticipant,
  selectedRows,
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

  const [filterOption, setFilterOption] = useState<AppParticipantFilter>(AppParticipantFilter.All);
  
  const onFilterChange = (newFilter: AppParticipantFilter) => {
    setFilterOption(newFilter);
    handleFilterChange(newFilter);
  };

  return (
    <div className="widget-container">
      <div className="widget-header">

          <h4 className="participants-title">Participants</h4>
        
          {userType === UserType.Internal && (
            <div className="d-flex gap-2 flex-wrap">
              <AppParticipantsTableControls handleFilterChange={onFilterChange} filter={filterOption}/>
            </div>
          )}
  
        </div>
      <Widget
        currentPage={1}
        changeHandler={handleTableChange}
        handleCheckBoxChange={(event) => handleWidgetCheckBox(event)}
        title={''}
        tableColumns={internalRow}
        tableData={formData ?? []}
        tableIsLoading={loading ? RequestStatus.loading : RequestStatus.idle}
        aria-label="App Participant Widget"
        customLabelCss="custom-participant-widget-lbl"
        hideTable={false}
        hideTitle={hideLabelForWidget}
        hideWidgetCheckbox={false}
        primaryKeycolumnName="particRoleId"
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
      </Widget>
      </div>
  );
};

export default ParticipantTable;
