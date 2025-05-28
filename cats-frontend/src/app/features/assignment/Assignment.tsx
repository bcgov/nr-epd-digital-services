import React, { useEffect, useState } from 'react';
import { Details } from '../applications/application/applicationTabs/appDetails/Details';
import CollapsiblePanel from '../../components/simple/CollapsiblePanel';
import { DropdownInput } from '../../components/input-controls/InputControls';
import { FormFieldType } from '../../components/input-controls/IFormField';
import GetConfig from './StaffTableConfig';
import StaffTable from './StaffTable';
import { RequestStatus } from '../../helpers/requests/status';
import { useGetParticipantRolesQuery } from '../applications/application/applicationTabs/appParticipants/graphql/Participants.generated';

import {
  useGetAllActiveStaffMembersQuery,
  useGetApplicationServiceTypesQuery,
  useGetStaffAssignedByAppIdQuery,
  useUpdateStaffAssignedMutation,
} from './graphql/assignment.generated';
import {
  UpdateDisplayTypeParams,
  updateTableColumn,
} from '../../helpers/utility';
import {
  CancelButton,
  SaveButton,
} from '../../components/simple/CustomButtons';
import './Assignment.css';
import {
  useGetApplicationDetailsByIdQuery,
  useGetSiteDetailsBySiteIdQuery,
} from '../applications/application/applicationTabs/appDetails/Details.generated';

interface AssignmentProps {
  id?: string;
  modalCloseHandler: () => void;
  modalSaveHandler: () => void;
}

const Assignment: React.FC<AssignmentProps> = ({
  id,
  modalCloseHandler,
  modalSaveHandler,
}) => {
  const applicationId = id ? Number(id) : 0;

  const [roleList, setRoleList] = useState<any[]>([]);

  const [serviceTypes, SetServiceTypes] = useState<any[]>([]);

  const [assignmentServiceType, setAssignmentServiceType] =
    useState<string>('');

  const { staffColumnInternal } = GetConfig();

  const [internalRow, setInternalRow] = useState(staffColumnInternal);

  const { data: rolesData } = useGetParticipantRolesQuery();

  const {
    data: staffMemebersList,
    loading: staffMemebersLoading,
    refetch: staffMemebersRefetch,
  } = useGetAllActiveStaffMembersQuery();

  const { data: serviceTypesList } = useGetApplicationServiceTypesQuery();

  const [updateStaffAssigned] = useUpdateStaffAssignedMutation();

  const { data: applicationData, loading: applicationDataLoading } =
    useGetApplicationDetailsByIdQuery({
      variables: {
        applicationId,
      },
      skip: !applicationId,
    });

  const application = applicationData?.getApplicationDetailsById.data;

  const {
    data: siteData,
    loading: siteDataLoading,
    called: siteDataCalled,
  } = useGetSiteDetailsBySiteIdQuery({
    variables: {
      siteId: application?.siteId?.toString() || '',
    },
    skip: !application?.siteId,
  });

  useEffect(() => {
    SetServiceTypes(serviceTypesList?.getApplicationServiceTypes?.data || []);
  }, [serviceTypesList]);

  useEffect(() => {
    setRoleList(rolesData?.getAllParticipantRoles?.data || []);
  }, [rolesData]);

  const [staffRecords, setStaffRecords] = useState<any[]>([]);

  const {
    data: staffData,
    loading: dataLoading,
    refetch: staffRefetch,
  } = useGetStaffAssignedByAppIdQuery({ variables: { applicationId } });

  useEffect(() => {
    setStaffRecords(staffData?.getStaffAssignedByAppId?.data?.staffList || []);
    let tempServiceType =
      staffData?.getStaffAssignedByAppId?.data?.applicationServiceTypeId;

    if (tempServiceType === undefined || tempServiceType === null) {
      setAssignmentServiceType('');
    } else {
      setAssignmentServiceType(tempServiceType.toString());
    }
  }, [staffData]);

  const handleSave = () => {
    let tempStaffRecords = staffRecords.map((item) => {
      if (typeof item.id === 'string' && item.id.includes('new')) {
        return {
          applicationId: parseInt(id || '0'),
          personId: parseInt(item.personId),
          roleId: parseInt(item.roleId),
          startDate: item.startDate,
          endDate: item.endDate,

          id: 0,
          action: item.action === 'remove' ? 'delete' : '',
        };
      } else {
        return {
          applicationId: parseInt(id || '0'),
          personId: parseInt(item.personId),
          roleId: parseInt(item.roleId),
          startDate: item.startDate,
          endDate: item.endDate,

          id: parseInt(item.id),
          action: item.action === 'remove' ? 'delete' : '',
        };
      }
    });
    return updateStaffAssigned({
      variables: {
        staffInput: tempStaffRecords,
        applicationId: parseInt(id || '0'),
        applicationServiceTypeId: parseInt(assignmentServiceType),
      },
      onCompleted: () => {
        modalSaveHandler();
      },
      onError: (err) => {
        console.error('Error adding participant:', err);
      },
    });
  };

  // Handle search action
  const handleSearch = (value: any) => {
    let existingStaffIds = staffRecords.map((item) => item.personId);
    value.trim();

    setInternalRow((prev) =>
      updateTableColumn(prev, {
        indexToUpdate: prev.findIndex(
          (item) => item.displayType?.graphQLPropertyName === 'personId',
        ),
        updates: {
          isLoading: RequestStatus.success,
          filteredOptions: staffMemebersList?.getAllActiveStaffMembers?.data
            ?.filter((item: any) => !existingStaffIds.includes(item.personId))
            ?.filter((item: any) =>
              item.personFullName.toLowerCase().includes(value.toLowerCase()),
            )
            .map((item: any) => ({
              key: item.personId.toString(),
              value: item.personFullName,
            })),
          handleSearch,
          customInfoMessage: <></>,
        },
      }),
    );
  };

  const processStaffMemebersList = (staffMemebersList: any) => {
    let options = staffMemebersList?.getAllActiveStaffMembers?.data?.map(
      (item: any) => ({
        key: item.personId.toString(),
        value: item.personFullName,
      }),
    );

    let params: UpdateDisplayTypeParams = {
      indexToUpdate: staffColumnInternal.findIndex(
        (item) => item.displayType?.graphQLPropertyName === 'personId',
      ),
      updates: {
        isLoading: RequestStatus.success,
        options: options,
        filteredOptions: options,
        handleSearch,
        customInfoMessage: <></>,
      },
    };
    setInternalRow(updateTableColumn(internalRow, params));
  };

  useEffect(() => {
    processStaffMemebersList(staffMemebersList);
  }, [staffMemebersLoading]);

  useEffect(() => {
    staffMemebersRefetch();
    staffRefetch({ applicationId: applicationId });
  }, []);

  useEffect(() => {
    let uniqueRoles = roleList.map((item: any) => ({
      key: item.id,
      value: item.description,
    }));

    uniqueRoles = uniqueRoles.filter(
      (item: any) =>
        item.value === 'Caseworker' ||
        item.value === 'Statutory Decision Maker' ||
        item.value === 'Mentor',
    );

    let params: UpdateDisplayTypeParams = {
      indexToUpdate: staffColumnInternal.findIndex(
        (item) => item.displayType?.graphQLPropertyName === 'roleId',
      ),
      updates: {
        isLoading: RequestStatus.success,
        options: uniqueRoles,
        filteredOptions: uniqueRoles,
        handleSearch,
        customInfoMessage: <></>,
      },
    };
    setInternalRow(updateTableColumn(internalRow, params));
  }, [roleList]);

  return (
    <div role="assign staff" className="assign-section">
      <Details applicationIdParam={applicationId} showSiteDetails={false} />
      <CollapsiblePanel
        showBorder={false}
        showPadding={false}
        smallFont={true}
        defaultOpen={true}
        label="Site Information"
        defaultCloseBtnPosition="left"
        content={
          <div className="site-info-content">
            <div className="site-info-content-div">
              <div className="site-info-label">Site ID</div>
              <div>{siteData?.getSiteDetailsBySiteId?.data?.id}</div>
            </div>
            <div className="site-info-content-div">
              <div className="site-info-label">Site Risk Classification</div>
              <div>{siteData?.getSiteDetailsBySiteId?.data?.siteRiskCode}</div>
            </div>
            <div className="site-info-content-div">
              <div className="site-info-label">Site Address</div>
              <div>
                {siteData?.getSiteDetailsBySiteId?.data?.addrLine_1 ||
                  '' +
                    ' ' +
                    siteData?.getSiteDetailsBySiteId?.data?.addrLine_2 ||
                  '' +
                    ' ' +
                    siteData?.getSiteDetailsBySiteId?.data?.addrLine_3 ||
                  '' +
                    ' ' +
                    siteData?.getSiteDetailsBySiteId?.data?.addrLine_4 ||
                  ''}
              </div>
            </div>
          </div>
        }
      />
      <div>
        <div className="assignment-options">
          <span className="panelLabel">Assignment Options </span>
          <DropdownInput
            label={'Application Service Type'}
            customLabelCss={''}
            placeholder={'Select Service Type'}
            options={serviceTypes.map((item) => ({
              key: item.key,
              value: item.value,
            }))}
            customInputTextCss="panelLabel"
            value={assignmentServiceType}
            onChange={(value) => setAssignmentServiceType(value)}
            type={FormFieldType.DropDown}
            isEditing={true}
          />
        </div>
        <div>
          <StaffTable
            handleTableChange={(event: any) => {
              if (event.property === 'remove') {
                setStaffRecords((staff) =>
                  staff
                    .map((item: any) => {
                      if (item.id === event.row.id) {
                        if (
                          typeof item.id === 'string' &&
                          item.id.startsWith('new')
                        ) {
                          return null;
                        } else {
                          return { ...item, action: 'remove' };
                        }
                      }
                      return item;
                    })
                    .filter(Boolean),
                );
              } else {
                setStaffRecords((staff) =>
                  staff.map((item: any) => {
                    if (item.id === event.row.id) {
                      if (event.property === 'startDate') {
                        return { ...item, startDate: event.value };
                      } else if (event.property === 'endDate') {
                        return { ...item, endDate: event.value };
                      } else if (event.property === 'personId') {
                        let selectedStaff =
                          staffMemebersList?.getAllActiveStaffMembers?.data?.filter(
                            (item: any) =>
                              item.personId.toString() === event.value.key,
                          );

                        return {
                          ...item,
                          personId: event.value.key,
                          currentCapacity: selectedStaff?.[0]?.currentCapacity,
                        };
                      } else if (event.property === 'roleId') {
                        return { ...item, roleId: event.value };
                      } else return item;
                    } else {
                      return item;
                    }
                  }),
                );
              }
            }}
            handleWidgetCheckBox={() => {}}
            tableColumnConfig={internalRow}
            formData={staffRecords.filter((item) => item.action !== 'remove')}
            status={RequestStatus.success}
            handleTableSort={() => {}}
            handleAddParticipant={() => {
              let tempRecords = [
                ...staffRecords,
                {
                  id: 'new_' + new Date().getTime(),
                  personId: '',
                  roleId: '',
                  startDate: null,
                  endDate: null,
                  applicationId: id && parseInt(id),
                },
              ];
              setStaffRecords(tempRecords);
            }}
            selectedRows={[]}
            handleRemoveParticipant={() => {}}
            handleItemClick={() => {}}
          />
          <div className={`custom-modal-actions-footer`}>
            <CancelButton
              variant={'tertiary'}
              clickHandler={modalCloseHandler}
              label={'Cancel'}
              isDisabled={false}
            />
            <SaveButton
              clickHandler={handleSave}
              label={'Confirm'}
              variant={'primary'}
              isDisabled={false}
              showTickIcon={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignment;
