import { useState } from 'react';
import { Button } from '../../components/button/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { staffApplicationsColumns, StaffColumns } from './StaffConfig';
import {
  useGetApplicationsByStaffQuery,
  useGetRolesQuery,
  useGetStaffsQuery,
} from './graphql/Staff.generated';
import {
  ApplicationSortByDirection,
  Filter,
  StaffSortByField,
} from '../../../generated/types';
import { AngleLeft, FilterIcon, Plus } from '../../components/common/icon';
import PageContainer from '../../components/simple/PageContainer';
import Widget from '../../components/widget/Widget';
import FilterControls from '../../components/filter/FilterControls';
import './Staff.css';
import { RequestStatus } from '@cats/helpers/requests/status';
import { TableColumn } from '@cats/components/table/TableColumn';
import ModalDialog from '@cats/components/modaldialog/ModalDialog';
import { DropdownInput } from '@cats/components/input-controls/InputControls';
import { FormFieldType } from '@cats/components/input-controls/IFormField';
import { IFilterOption } from '@cats/components/filter/IFilterControls';

interface IStaff {
  page: number;
  pageSize: number;
  sortBy: StaffSortByField;
  sortByDir: ApplicationSortByDirection;
  filter?: Filter;
}

interface IModalState extends IStaff {
  isModalOpen: boolean;
  personId: number;
  personName: string;
  roleId?: number | null;
}

const Staff = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromScreen = location.state?.from || '';
  const [showFilterSelect, setShowFilterSelect] = useState(false);
  const [queryModalState, setQueryModalState] = useState<IModalState>({
    page: 1,
    pageSize: 5,
    sortBy: StaffSortByField.Id,
    sortByDir: ApplicationSortByDirection.Asc,
    isModalOpen: false,
    personId: 0,
    personName: '',
  });

  const [queryState, setQueryState] = useState<IStaff>({
    page: 1,
    pageSize: 5,
    filter: Filter.All,
    sortBy: StaffSortByField.Id,
    sortByDir: ApplicationSortByDirection.Asc,
  });

  const { data, loading } = useGetStaffsQuery({
    variables: {
      page: queryState.page,
      pageSize: queryState.pageSize,
      filter: queryState.filter,
      sortBy: queryState.sortBy,
      sortByDir: queryState.sortByDir,
    },
  });

  const { data: applications, loading: applicationsLoading } =
    useGetApplicationsByStaffQuery({
      variables: {
        page: queryModalState.page,
        pageSize: queryModalState.pageSize,
        sortBy: queryModalState.sortBy,
        sortByDir: queryModalState.sortByDir,
        personId: queryModalState.personId,
        roleId: queryModalState?.roleId ?? null,
      },
      skip: !queryModalState.isModalOpen || !queryModalState.personId,
    });

  const { data: roles, loading: rolesLoading } = useGetRolesQuery({
    variables: {
      roleType: 'STAFF',
    },
    skip: !queryModalState.isModalOpen || !queryModalState.personId,
  });

  const handleSort = (
    row: TableColumn,
    ascending: boolean,
    isModal: boolean = false,
  ) => {
    const newSortByDir = ascending
      ? ApplicationSortByDirection.Asc
      : ApplicationSortByDirection.Desc;

    // Define the mapping for sort fields based on whether it's the modal or main table
    const sortFields: any = isModal
      ? {
          roleDescription: StaffSortByField.Role,
          siteAddress: StaffSortByField.SiteAddress,
          effectiveStartDate: StaffSortByField.StartDate,
          effectiveEndDate: StaffSortByField.EndDate,
        }
      : {
          name: StaffSortByField.Name,
          assignments: StaffSortByField.Assignment,
        };

    // Default to 'Id' if the property name is not in the map
    const sortField =
      sortFields[row.graphQLPropertyName] || StaffSortByField.Id;

    // Update the state based on whether it's for the modal or the main table
    if (isModal) {
      setQueryModalState((prev: IModalState) => ({
        ...prev,
        sortBy: sortField,
        sortByDir: newSortByDir,
      }));
    } else {
      setQueryState((prev: IStaff) => ({
        ...prev,
        sortBy: sortField,
        sortByDir: newSortByDir,
      }));
    }
  };

  // Usage for the main table
  const handleTableSort = (
    row: TableColumn,
    ascending: boolean,
    isModal: boolean,
  ) => {
    handleSort(row, ascending, isModal); // isModal: false for the main table
  };

  const handleTableChange = (event: any) => {
    if (event?.property?.includes('view')) {
      setQueryModalState((prev: IStaff) => ({
        ...prev,
        page: 1,
        pageSize: 5,
        sortBy: StaffSortByField.Id,
        sortByDir: ApplicationSortByDirection.Asc,
        isModalOpen: true,
        personId: Number(event?.row?.id),
        personName: event?.row?.name,
      }));
    }
  };

  const handleFilterChange = (filter: Filter) => {
    setQueryState((prev: IStaff) => ({
      ...prev,
      filter,
      page: 1,
    }));
  };

  const options: IFilterOption[] = [
    {
      label: 'All',
      value: Filter.All,
      onClick: () => handleFilterChange(Filter.All),
      isSelected: queryState.filter === Filter.All,
    },
    {
      label: 'Unassigned',
      value: Filter.Unassigned,
      onClick: () => handleFilterChange(Filter.Unassigned),
      isSelected: queryState.filter === Filter.Unassigned,
    },
    {
      label: 'Overcapacity',
      value: Filter.Overcapacity,
      onClick: () => handleFilterChange(Filter.Overcapacity),
      isSelected: queryState.filter === Filter.Overcapacity,
    },
    // {
    //   label: 'Filter',
    //   value: 'filter',
    //   onClick: () => setShowFilterSelect((prev) => !prev),
    //   icon: <FilterIcon />,
    // },
  ];

  return (
    <PageContainer role="staff">
      <div>
        <Button
          onClick={() => {
            navigate(-1);
          }}
          variant="secondary"
        >
          <AngleLeft />
          {`Back ${fromScreen ? `to ${fromScreen}` : ''}`}
        </Button>
      </div>
      <Widget
        tableIsLoading={loading ? RequestStatus.loading : RequestStatus.success}
        customWidgetCss={'custom-widget-container'}
        allowRowsSelect={false}
        changeHandler={handleTableChange}
        sortHandler={(row, ascDir) => {
          handleTableSort(row, ascDir, false);
        }}
        title={'Staff'}
        aria-label="Staff Dashboard Widget"
        primaryKeycolumnName="id"
        showPageOptions={true}
        selectPage={(page) => {
          setQueryState((prev: IStaff) => ({ ...prev, page }));
        }}
        changeResultsPerPage={(pageSize) => {
          setQueryState((prev: IStaff) => ({
            ...prev,
            pageSize,
            page: 1,
          }));
        }}
        tableColumns={StaffColumns}
        currentPage={queryState?.page}
        resultsPerPage={queryState?.pageSize}
        tableData={data?.getStaffs?.data ?? []}
        totalResults={data?.getStaffs?.count ?? 0}
        filter={<FilterControls options={options} />}
      >
        <div className="d-flex gap-2 flex-wrap">
          <Button
            variant="secondary"
            onClick={() => {
              navigate('/person', { state: { from: 'Staff' } });
            }}
          >
            <Plus />
            Add Person
          </Button>
        </div>
      </Widget>
      {queryModalState.isModalOpen && (
        <ModalDialog
          headerLabel={`Viewing: ${queryModalState?.personName ?? ''}`}
          noFooterOptions={true}
          customContentCss='custom-staff-modal-content'
          closeHandler={() =>
            setQueryModalState((prev: IModalState) => ({
              ...prev,
              page: 1,
              pageSize: 5,
              sortBy: StaffSortByField.Id,
              sortByDir: ApplicationSortByDirection.Asc,
              personId: 0,
              roleId: null,
              isModalOpen: !prev.isModalOpen,
            }))
          }
        >
          <div>
            <div className="custom-modal-lbl mb-2"> Staff Options </div>
            <DropdownInput
              type={FormFieldType.DropDown}
              options={
                rolesLoading
                  ? []
                  : (roles?.getAllParticipantRoles?.data?.map((role) => ({
                      key: role.id.toString(),
                      value: role.description,
                    })) ?? [])
              }
              onChange={(value) => {
                setQueryModalState((prev: IModalState) => ({
                  ...prev,
                  roleId: value === '' ? null : Number(value),
                }));
              }}
              label="Roles"
              placeholder="Select Role"
              value={queryModalState?.roleId?.toString() ?? ''}
              isEditing={true}
            />
          </div>
          <Widget
            tableIsLoading={
              applicationsLoading
                ? RequestStatus.loading
                : RequestStatus.success
            }
            customWidgetCss="custom-widget-container"
            customLabelCss="custom-modal-widget-lbl"
            allowRowsSelect={false}
            changeHandler={handleTableChange}
            sortHandler={(row, ascDir) => {
              handleTableSort(row, ascDir, true);
            }}
            title={'Assigned Applications'}
            aria-label="Assigned Applications Widget"
            primaryKeycolumnName="id"
            showPageOptions={true}
            selectPage={(page) => {
              setQueryModalState((prev: IModalState) => ({ ...prev, page }));
            }}
            changeResultsPerPage={(pageSize) => {
              setQueryModalState((prev: IModalState) => ({
                ...prev,
                pageSize,
                page: 1,
              }));
            }}
            tableColumns={staffApplicationsColumns}
            currentPage={queryModalState?.page}
            resultsPerPage={queryModalState?.pageSize}
            tableData={applications?.getApplicationsByStaff?.data ?? []}
            totalResults={applications?.getApplicationsByStaff?.count ?? 0}
          />
        </ModalDialog>
      )}
    </PageContainer>
  );
};

export default Staff;
