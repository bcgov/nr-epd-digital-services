import { useCallback, useEffect, useState } from "react";
import { Button } from "../../components/button/Button";
import PageContainer from "../../components/simple/PageContainer";
import Widget from "../../components/widget/Widget";
import { AngleLeft, Plus } from "../../components/common/icon";
import { sortArray } from "../../helpers/utility";
import { debounce } from "lodash";
import { ApplicationSortByDirection, Filter, StaffSortByField, ViewStaff } from "../../../generated/types";
import "./StaffDashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import FilterControls from "./FilterControls";
import { StaffDashboardColumns } from "./StaffDashboardConfig";
import { useGetStaffsQuery } from "./graphql/StaffDashboard.generated";

const StaffDashboard = () => {
 const [staffs, setStaffs] = useState({
  data: [] as ViewStaff[],
  page: 1,
  pageSize: 5,
  totalResults: 0,
  filter: Filter.All,
  sortBy: StaffSortByField.Id,
  sortByDir: ApplicationSortByDirection.Asc,
});

  
  const { data, loading, error, refetch } = useGetStaffsQuery({
    variables: {
      page: staffs.page,
      pageSize: staffs.pageSize,
      filter: staffs.filter,
      sortBy: staffs.sortBy,
      sortByDir: staffs.sortByDir,
    }
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      setStaffs(prev => {
        return {
          ...prev,
          data: data.getStaffs.data,
          page: data.getStaffs.page || 1,
          pageSize: data.getStaffs.pageSize || 5,
          totalResults: data.getStaffs.count || 0,
        };
      });
    }
  }, [data, loading]);
  const navigate = useNavigate();
  const location = useLocation();
  const fromScreen = location.state?.from || '';
  const [showFilterSelect, setShowFilterSelect] = useState(false);
    
  const toggleFilterSelect = () => {
    setShowFilterSelect(!showFilterSelect);
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePageChange = (page: number) => {
    setStaffs((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setStaffs((prev) => ({ ...prev, pageSize, page: 1 })); // reset page
  };

  const handleFilterChange = (filter: Filter) => {
    setStaffs((prev) => ({ ...prev, filter, page: 1 }));
  };

  const handleTableSort = (row: any, ascending: any) => {
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
    setStaffs((prev) => ({
      ...prev,
      sortBy: sortField,
      sortByDir: newSortByDir,
    }));
  };

  const handleTableChange = (event: any) => {
      // if (
      //   event.property.includes('select_all') ||
      //   event.property.includes('select_row')
      // ) {
      //   let rows = event.property === 'select_row' ? [event.row] : event.value;
      //   let isTrue =
      //     event.property === 'select_row' ? event.value : event.selected;
      //   if (isTrue) {
      //     setSelectedRows((prevSelectedRows) => [
      //       ...prevSelectedRows,
      //       ...rows.map((row: any) => ({ id: row.id })),
      //     ]);
      //   } else {
      //     setSelectedRows((prevSelectedRows) =>
      //       prevSelectedRows.filter(
      //         (selectedRow) =>
      //           !rows.some((row: any) => selectedRow.id === row.id),
      //       ),
      //     );
      //   }
      // }
      if (event.property.includes('view')) {
       alert(
          `
            id: ${event.row.id},
            name: ${event.row.name},
            role: ${event.row.role},
            assignments: ${event.row.assignments},
            capacity: ${event.row.capacity}
          `
        );
      }
  };
    
  // const handleTableSort = (row: any, ascDir: any) => {
  //   let property = row['graphQLPropertyName'];
  //   setStaffs((prevData) => {
  //     // Create a shallow copy of the previous data
  //     let updatedNotes = [...prevData?.data];
  //     // Call the common sort function to sort the updatedNotes array
  //     updatedNotes = sortArray(updatedNotes, property, ascDir);
  //     // Return the sorted array
  //     return { ...prevData, data: updatedNotes };
  //   });
  // };
    
  return (
    <PageContainer role="staff">
        <div>
          <Button onClick={handleGoBack} variant="secondary" >
              <AngleLeft />
              {`Back ${fromScreen ? `to ${fromScreen}` : ''}`}
          </Button>
        </div>
        <Widget
          customWidgetCss={'custom-widget-container'}
          allowRowsSelect={false}
          tableColumns={StaffDashboardColumns}
          tableData={staffs?.data ?? []}
          // tableIsLoading={loading ?? RequestStatus.idle}
          changeHandler={handleTableChange}
          sortHandler={(row, ascDir) => { handleTableSort(row, ascDir); }}
          title={'Staff'}
          aria-label="Staff Dashboard Widget"
          primaryKeycolumnName="id"
          showPageOptions={true}
          selectPage={handlePageChange}
          changeResultsPerPage={handlePageSizeChange}
          currentPage={staffs?.page ?? 1}
          resultsPerPage={staffs?.pageSize ?? 5}
          totalResults={staffs?.totalResults ?? 0}
          filter={
            <FilterControls 
              toggleColumnSelect={toggleFilterSelect} 
              handleFilterChange={handleFilterChange} 
              filter={staffs.filter ?? {}}/>} 
        >
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="secondary" onClick={() => {   navigate('/person', { state: { from: 'Staff' } });}}>
              <Plus />
                Add Person
            </Button>
          </div>
      </Widget>
    </PageContainer>
  )
};

export default StaffDashboard;