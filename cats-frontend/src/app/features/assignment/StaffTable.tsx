import React from 'react';

import { TableColumn } from '../../components/table/TableColumn';
import { RequestStatus } from '../../helpers/requests/status';
import { Button } from '../../components/button/Button';
import { UserPlus } from '../../components/common/icon';
import Widget from '../../components/widget/Widget';

interface IParticipantTableProps {
  handleTableChange: (event: any) => void;
  handleWidgetCheckBox: (event: any) => void;
  tableColumnConfig: TableColumn[];
  formData: {
    [key: string]: any;
  }[];
  status: RequestStatus;
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

const StaffTable: React.FC<IParticipantTableProps> = ({
  handleTableChange,
  tableColumnConfig,
  formData,
  status,
  handleAddParticipant,
  showApproveRejectSection,
  approveRejectHandler,
  hideLabelForWidget,
}) => {
  showApproveRejectSection = showApproveRejectSection ?? false;
  hideLabelForWidget = hideLabelForWidget ?? false;

  approveRejectHandler = approveRejectHandler ?? (() => {});

  return (
    <div>
      <Widget
        currentPage={1}
        changeHandler={handleTableChange}
        handleCheckBoxChange={(event: any) => {}}
        title={'Assign Staff'}
        tableColumns={tableColumnConfig}
        tableData={formData}
        tableIsLoading={status ?? RequestStatus.idle}
        allowRowsSelect={false}
        aria-label="Staff Assignment Table"
        customLabelCss="panelLabel"
        hideTable={false}
        hideTitle={hideLabelForWidget}
        editMode={true}
        srMode={false}
        hideWidgetCheckbox={true}
        primaryKeycolumnName="particRoleId"
        sortHandler={(row: any, ascDir: any) => {}}
      >
        <div className="d-flex gap-2 flex-wrap">
          <Button variant="secondary" onClick={handleAddParticipant}>
            <UserPlus />
            Add Staff
          </Button>
        </div>
      </Widget>
    </div>
  );
};

export default StaffTable;
