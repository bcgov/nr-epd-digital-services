import { useState } from 'react';
import { Button } from '../../components/button/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { staffApplicationsColumns, StaffDashboardColumns } from './StaffDashboardConfig';
import { useGetApplicationsByStaffQuery, useGetRolesQuery, useGetStaffsQuery } from './graphql/StaffDashboard.generated';
import {
  ApplicationSortByDirection,
  Filter,
  StaffSortByField,
  ViewStaff,
} from '../../../generated/types';
import { AngleLeft, Plus } from '../../components/common/icon';
import PageContainer from '../../components/simple/PageContainer';
import Widget from '../../components/widget/Widget';
import FilterControls from './FilterControls';
import './StaffDashboard.css';
import { RequestStatus } from '@cats/helpers/requests/status';
import { TableColumn } from '@cats/components/table/TableColumn';
import ModalDialog from '@cats/components/modaldialog/ModalDialog';
import { DropdownInput } from '@cats/components/input-controls/InputControls';
import { FormFieldType } from '@cats/components/input-controls/IFormField';

interface IStaffDashboard {
  page: number;
  pageSize: number;
  sortBy: StaffSortByField;
  sortByDir: ApplicationSortByDirection;
  filter?: Filter;
}

interface IModalState extends IStaffDashboard{
  isModalOpen: boolean;
  personId: number
  roleId?: number
}

const StaffDashboard = () => {
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
    personId: 0
  });

  const [queryState, setQueryState] = useState<IStaffDashboard>({
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

  const {data: applications, loading: applicationsLoading} = useGetApplicationsByStaffQuery({
    variables: {
      page: queryModalState.page,
      pageSize: queryModalState.pageSize,
      sortBy: queryModalState.sortBy,
      sortByDir: queryModalState.sortByDir,
      personId: queryModalState.personId,
      roleId: queryModalState.roleId
    },
    skip: !queryModalState.isModalOpen || !queryModalState.personId,
  });

  const {data: roles, loading: rolesLoading} = useGetRolesQuery();


  console.log('applications', applications);
  console.log('applicationsLoading', applicationsLoading);
  const handleTableSort = (row: TableColumn, ascending: boolean) => {
    let newSortByDir = ascending
      ? ApplicationSortByDirection.Asc
      : ApplicationSortByDirection.Desc;
    let sortField = StaffSortByField.Name;
    switch (row.graphQLPropertyName) {
      case 'name':
        sortField = StaffSortByField.Name;
        break;
      case 'assignments':
        sortField = StaffSortByField.Assignment;
        break;
      default:
        sortField = StaffSortByField.Id;
        break;
    }
    setQueryState((prev: IStaffDashboard) => ({
      ...prev,
      sortBy: sortField,
      sortByDir: newSortByDir,
    }));
  };

  const handleTableChange = (event: any) => {
    if (event?.property?.includes('view')) {
      // TODO : navigate to staff details
      console.log(event);
      setQueryModalState((prev: IStaffDashboard) => ({
        ...prev,
        page: 1,
        pageSize: 5,
        sortBy: StaffSortByField.Id,
        sortByDir: ApplicationSortByDirection.Asc,
        isModalOpen: true,
        personId: Number(event?.row?.id)
      }))
    }
  };

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
          handleTableSort(row, ascDir);
        }}
        title={'Staff'}
        aria-label="Staff Dashboard Widget"
        primaryKeycolumnName="id"
        showPageOptions={true}
        selectPage={(page) => {
          setQueryState((prev: IStaffDashboard) => ({ ...prev, page }));
        }}
        changeResultsPerPage={(pageSize) => {
          setQueryState((prev: IStaffDashboard) => ({
            ...prev,
            pageSize,
            page: 1,
          }));
        }}
        tableColumns={StaffDashboardColumns}
        currentPage={queryState?.page}
        resultsPerPage={queryState?.pageSize}
        tableData={data?.getStaffs?.data ?? []}
        totalResults={data?.getStaffs?.count ?? 0}
        filter={
          <FilterControls
            toggleColumnSelect={() => {
              setShowFilterSelect(!showFilterSelect);
            }}
            handleFilterChange={(filter) => {
              setQueryState((prev: IStaffDashboard) => ({
                ...prev,
                filter,
                page: 1,
              }));
            }}
            filter={queryState?.filter ?? Filter.All}
          />
        }
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
      {
        queryModalState.isModalOpen && (
          <ModalDialog 
            headerLabel={'Viewing: '}
            noFooterOptions={true}
            closeHandler={() => setQueryModalState((prev: IModalState) => ({...prev, isModalOpen: !prev.isModalOpen}))}
          >
            <div>
              <div className="custom-modal-lbl mb-2"> Staff Options </div>
              <DropdownInput
                type={FormFieldType.DropDown}
                options={rolesLoading ? [] : roles?.getAllParticipantRoles?.data?.map((role) => ({key: role.id.toString(), value: role.description}))}
                onChange={(value) => {
                  setQueryModalState((prev: IModalState) => ({...prev, roleId: Number(value)}))
                }}
                label="Roles"
                value={queryModalState?.roleId?.toString() ?? ''}
                isEditing={true}
              />
            </div>
            <Widget
              tableIsLoading={loading ? RequestStatus.loading : RequestStatus.success}
              customWidgetCss={'custom-widget-container'}
              customLabelCss="custom-modal-widget-lbl"
              allowRowsSelect={false}
              changeHandler={handleTableChange}
              sortHandler={(row, ascDir) => {
                handleTableSort(row, ascDir);
              }}
              title={'Assigned Applications'}
              aria-label="Assigned Applications Widget"
              primaryKeycolumnName="id"
              showPageOptions={true}
              selectPage={(page) => {
                setQueryState((prev: IStaffDashboard) => ({ ...prev, page }));
              }}
              changeResultsPerPage={(pageSize) => {
                setQueryState((prev: IStaffDashboard) => ({
                  ...prev,
                  pageSize,
                  page: 1,
                }));
              }}
              tableColumns={staffApplicationsColumns}
              currentPage={queryState?.page}
              resultsPerPage={queryState?.pageSize}
              tableData={data?.getStaffs?.data ?? []}
              totalResults={data?.getStaffs?.count ?? 0}
            >
            </Widget>
          </ModalDialog>
        )
      }
    </PageContainer>
  );
};

export default StaffDashboard;
