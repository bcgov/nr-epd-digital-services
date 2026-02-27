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
  useGetAllActiveStaffMembersForApplicationServiceTypeQuery,
  useGetAllActiveStaffMembersQuery,
  useGetApplicationServiceTypesQuery,
  useGetStaffAssignedByAppIdQuery,
  useUpdateStaffAssignedMutation,
  useGetStaffGroupedByRoleForServiceTypeQuery,
} from './graphql/assignment.generated';
import {
  CancelButton,
  SaveButton,
} from '../../components/simple/CustomButtons';
import './Assignment.css';
import {
  useGetApplicationDetailsByIdQuery,
  useGetSiteDetailsBySiteIdQuery,
} from '../applications/application/applicationTabs/appDetails/Details.generated';
import ModalDialog from '../../components/modaldialog/ModalDialog';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, PlusCircle } from '@cats/components/common/icon';

interface AssignmentProps {}

const Assignment: React.FC<AssignmentProps> = () => {
  const { id } = useParams(); // or useSearchParams()
  const navigate = useNavigate();

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [assignmentServiceType, setAssignmentServiceType] =
    useState<string>('');
  const [staffRecords, setStaffRecords] = useState<any[]>([]);

  const cleanStaffName = (fullName: string): string => {
    return fullName
      .replace(/\s*-\s*\(Caseworker\)\s*$/i, '')
      .replace(/\s*-\s*\(Statutory Decision Maker\)\s*$/i, '')
      .replace(/\s*-\s*\(Mentor\)\s*$/i, '')
      .trim();
  };

  const applicationId = id ? Number(id) : 0;
  const { data: rolesData } = useGetParticipantRolesQuery();
  const { data: staffMemebersList, refetch: staffMemebersRefetch } =
    useGetAllActiveStaffMembersQuery();

  const { data: applicationData, loading: applicationDataLoading } =
    useGetApplicationDetailsByIdQuery({
      variables: {
        applicationId,
      },
      skip: !applicationId,
    });

  const application = applicationData?.getApplicationDetailsById.data;

  console.log('Application data loaded:', {
    application,
    siteId: application?.siteId,
  });

  const {
    data: staffMemebersListForServiceType,
    refetch: staffMemebersRefetchForServiceType,
  } = useGetAllActiveStaffMembersForApplicationServiceTypeQuery({
    variables: {
      applicationServiceTypeId: assignmentServiceType
        ? Number(assignmentServiceType)
        : 0,
    },
  });

  console.log('Before useGetStaffGroupedByRoleForServiceTypeQuery:', {
    applicationServiceTypeId: assignmentServiceType
      ? Number(assignmentServiceType)
      : 0,
    siteId: application?.siteId ?? undefined,
  });

  const { data: staffGroupedByRole, refetch: staffGroupedByRoleRefetch } =
    useGetStaffGroupedByRoleForServiceTypeQuery({
      variables: {
        applicationServiceTypeId: assignmentServiceType
          ? Number(assignmentServiceType)
          : 0,
        siteId: application?.siteId ?? undefined,
      },
      skip: !application?.siteId && application?.siteId !== 0,
    });

  const { data: serviceTypesList } = useGetApplicationServiceTypesQuery();
  const [updateStaffAssigned] = useUpdateStaffAssignedMutation();

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

  const {
    data: staffData,
    loading: dataLoading,
    refetch: staffRefetch,
  } = useGetStaffAssignedByAppIdQuery({ variables: { applicationId } });

  const [searchParam, setSearchParam] = useState('');
  const { staffColumnInternal } = GetConfig({
    setSearchParam,
    options: staffMemebersList?.getAllActiveStaffMembers?.data?.map(
      (item: any) => ({
        key: item.personId.toString(),
        value: item.personFullName,
      }),
    ) as [{ key: string; value: string }],
    filteredOptions:
      staffMemebersListForServiceType?.getAllActiveStaffMembersForApplicationServiceType?.data
        ?.filter(
          (item: any) =>
            !staffRecords
              ?.map((item) => item.personId)
              ?.includes(item.personId),
        )
        ?.filter((item: any) =>
          item.personFullName
            .toLowerCase()
            .includes(searchParam?.trim()?.toLowerCase()),
        )
        .map((item: any) => ({
          key: item.personId.toString(),
          value:
            item.personFullName +
            ' - (' +
            ((item.currentCapacity / 160) * 100).toFixed(2) +
            '%)',
        })) as [{ key: string; value: string }],
    rolesOptions: rolesData?.getAllParticipantRoles?.data
      ?.filter(
        (item: any) =>
          item.description === 'Caseworker' ||
          item.description === 'Statutory Decision Maker' ||
          item.description === 'Mentor',
      )
      ?.map((item: any) => ({
        key: item.id,
        value: item.description,
      })) as [{ key: string; value: string }],
  });

  useEffect(() => {
    if (assignmentServiceType && application?.siteId) {
      staffMemebersRefetchForServiceType({
        applicationServiceTypeId: Number(assignmentServiceType),
      });
      staffGroupedByRoleRefetch({
        applicationServiceTypeId: Number(assignmentServiceType),
        siteId: application?.siteId || undefined,
      });
    }
  }, [assignmentServiceType, application?.siteId]);

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
    if (
      assignmentServiceType === undefined ||
      assignmentServiceType === null ||
      assignmentServiceType === ''
    ) {
      setMessageContent('Please select an Application Service Type.');
      setIsMessageModalOpen(true);
      return;
    }

    const inCompleteRecords = staffRecords.filter(
      (item) =>
        item.personId === undefined ||
        item.personId === null ||
        item.personId === '' ||
        item.roleId === undefined ||
        item.roleId === null ||
        item.roleId === '' ||
        item.startDate === undefined ||
        item.startDate === null ||
        item.startDate === '',
    );
    if (inCompleteRecords.length > 0) {
      setMessageContent('Please fill all the required fields.');
      setIsMessageModalOpen(true);
    }
    if (id === undefined || id === null || id === '') {
      setMessageContent('Application Id not found, Please refresh the page.');
      setIsMessageModalOpen(true);
    }
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
        navigate(-1);
      },
      onError: (err) => {
        console.error('Error adding participant:', err);
      },
    });
  };

  useEffect(() => {
    staffMemebersRefetch();
    staffRefetch({ applicationId: applicationId });
  }, []);

  return (
    <div role="assign staff" className="assign-section page-continer">
      <div className="parent-box">
        <Details
          applicationIdParam={applicationId}
          showSiteDetails={false}
          defaultOpen={false}
        />
      </div>
      <div className="parent-box">
        <CollapsiblePanel
          showBorder={false}
          showPadding={false}
          smallFont={true}
          defaultOpen={false}
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
                <div>
                  {siteData?.getSiteDetailsBySiteId?.data?.siteRiskCode}
                </div>
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
      </div>
      <div className="parent-box">
        <div className="assignment-options">
          <span className="panelLabel">Manage Staff</span>
          <DropdownInput
            label={'Application Service Type'}
            customLabelCss={''}
            placeholder={'Select Service Type'}
            options={serviceTypesList?.getApplicationServiceTypes?.data?.map(
              (item) => ({
                key: item.key,
                value: item.value,
              }),
            )}
            customInputTextCss="panelLabel"
            value={assignmentServiceType}
            onChange={(value) => {
              setAssignmentServiceType(value);
            }}
            type={FormFieldType.DropDown}
            isEditing={true}
          />
        </div>
        <div>
          {staffGroupedByRole?.getStaffGroupedByRoleForServiceType?.data && (
            <div className="staff-by-role-section">
              {staffGroupedByRole.getStaffGroupedByRoleForServiceType.data.map(
                (roleGroup) => {
                  const availableStaff = roleGroup.staff
                    .filter(
                      (staff) =>
                        !staffRecords.some(
                          (record) =>
                            record.personId.toString() ===
                              staff.personId.toString() &&
                            record.roleId.toString() ===
                              roleGroup.roleId.toString() &&
                            record.action !== 'remove',
                        ),
                    )
                    .sort(
                      (a, b) =>
                        (a.currentCapacity || 0) - (b.currentCapacity || 0),
                    );
                  return (
                    <div key={roleGroup.roleId} className="role-group">
                      <h3 className="role-heading">
                        Previously Assinged {roleGroup.roleName}
                      </h3>
                      <div className="staff-pills-container">
                        {availableStaff.length > 0 ? (
                          availableStaff.map((staff) => (
                            <button
                              key={`${staff.personId}-${staff.applicationId}`}
                              className="staff-pill"
                              onClick={() => {
                                if (staff.hasPermission) {
                                  const newRecord = {
                                    id: 'new_' + new Date().getTime(),
                                    personId: staff.personId.toString(),
                                    roleId: roleGroup.roleId.toString(),
                                    startDate: null,
                                    endDate: null,
                                    applicationId: id && parseInt(id),
                                  };
                                  setStaffRecords([...staffRecords, newRecord]);
                                } else {
                                  setMessageContent(
                                    'No permission for the selected service type',
                                  );
                                  setIsMessageModalOpen(true);
                                }
                              }}
                              title={`App Type: ${staff.appType || 'N/A'} | End Date: ${staff.endDate ? new Date(staff.endDate).toLocaleDateString() : 'N/A'} | App ID: ${staff.applicationId || 'N/A'}`}
                            >
                              {cleanStaffName(staff.personFullName)}
                              {staff.appType && (
                                <span className="staff-pill-info">
                                  {' '}
                                  - {staff.appType}
                                </span>
                              )}
                              {staff.endDate && (
                                <span className="staff-pill-info">
                                  {' '}
                                  (Ended:{' '}
                                  {new Date(staff.endDate).toLocaleDateString()}
                                  )
                                </span>
                              )}
                              <PlusCircle className="fa-regular fa-circle-plus"></PlusCircle>
                            </button>
                          ))
                        ) : (
                          <span className="no-staff-message">
                            No eligible staff available for this role
                          </span>
                        )}
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}
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
            tableColumnConfig={staffColumnInternal}
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
        </div>
      </div>
      <div className={`custom-modal-actions-footer`}>
        <CancelButton
          variant={'tertiary'}
          clickHandler={() => {
            navigate(-1);
          }}
          label={'Cancel'}
          isDisabled={false}
        />
        <SaveButton
          clickHandler={() => {
            handleSave();
          }}
          label={'Confirm'}
          variant={'primary'}
          isDisabled={false}
          showTickIcon={true}
        />
      </div>
      {isMessageModalOpen && (
        <ModalDialog
          headerLabel="Validation Errors"
          closeHandler={() => {
            setIsMessageModalOpen(false);
          }}
          noFooterOptions={true}
        >
          <div>{messageContent}</div>
        </ModalDialog>
      )}
    </div>
  );
};

export default Assignment;
