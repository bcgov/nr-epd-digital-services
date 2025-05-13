import { useState } from "react";
import { Button } from "../../components/button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { StaffDashboardColumns } from "./StaffDashboardConfig";
import { useGetStaffsQuery } from "./graphql/StaffDashboard.generated";
import { ApplicationSortByDirection, Filter, StaffSortByField, ViewStaff } from "../../../generated/types";
import { AngleLeft, Plus } from "../../components/common/icon";
import PageContainer from "../../components/simple/PageContainer";
import Widget from "../../components/widget/Widget";
import FilterControls from "./FilterControls";
import "./StaffDashboard.css";
import { RequestStatus } from "@cats/helpers/requests/status";
import { TableColumn } from "@cats/components/table/TableColumn";

interface IStaffDashboard {
  page: number;
  pageSize: number;
  filter: Filter;
  sortBy: StaffSortByField;
  sortByDir: ApplicationSortByDirection;
}

const StaffDashboard = () => {
    
  const navigate = useNavigate();
  const location = useLocation();
  const fromScreen = location.state?.from || '';
  const [showFilterSelect, setShowFilterSelect] = useState(false);
  const [queryState, setQueryState] = useState<IStaffDashboard>({
    page: 1,
    pageSize: 5,
    filter: Filter.All,
    sortBy: StaffSortByField.Id,
    sortByDir: ApplicationSortByDirection.Asc,
  });

  const { data, loading} = useGetStaffsQuery({
    variables: {
      page: queryState.page,
      pageSize: queryState.pageSize,
      filter: queryState.filter,
      sortBy: queryState.sortBy,
      sortByDir: queryState.sortByDir,
    }
  });

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
      }
  };

  return (
    <PageContainer role="staff">
        <div>
          <Button onClick={() =>{navigate(-1)}} variant="secondary" >
              <AngleLeft />
              {`Back ${fromScreen ? `to ${fromScreen}` : ''}`}
          </Button>
        </div>
        <Widget
          tableIsLoading={loading ? RequestStatus.loading : RequestStatus.success}
          customWidgetCss={'custom-widget-container'}
          allowRowsSelect={false}
          changeHandler={handleTableChange}
          sortHandler={(row, ascDir) => { handleTableSort(row, ascDir); }}
          title={'Staff'}
          aria-label="Staff Dashboard Widget"
          primaryKeycolumnName="id"
          showPageOptions={true}
          selectPage={
            (page) => {
              setQueryState((prev: IStaffDashboard) => ({ ...prev, page }));
            }
          }
          changeResultsPerPage={
            (pageSize) => {
              setQueryState((prev: IStaffDashboard) => ({ ...prev, pageSize, page: 1 }));
            }
          }
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
              handleFilterChange={
                (filter) => {
                 setQueryState((prev: IStaffDashboard) => ({ ...prev, filter, page: 1 }));
                }
              }
              filter={queryState.filter ?? {}}/>} 
        >
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="secondary" onClick = {
                () => {
                  navigate('/person', { state: { from: 'Staff' } });
                  }
              }>
              <Plus />
                Add Person
            </Button>
          </div>
      </Widget>
    </PageContainer>
  )
};

export default StaffDashboard;