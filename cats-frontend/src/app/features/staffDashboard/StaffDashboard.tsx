import { useCallback, useState } from "react";
import { Button } from "../../components/button/Button";
import PageContainer from "../../components/simple/PageContainer";
import Widget from "../../components/widget/Widget";
import { AngleLeft, Plus } from "../../components/common/icon";
import { sortArray } from "../../helpers/utility";
import { debounce } from "lodash";
import { ApplicationSortByDirection, Filter } from "../../../generated/types";
import "./StaffDashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import FilterControls from "./FilterControls";
import { StaffDashboardColumns } from "./StaffDashboardConfig";

const StaffDashboard = () => {
  const data = [
      {
          id: 1,
          name: 'John Doe',
          role: 'Administrator',
          assignments: 0,
          capacity: 10,
      },
      {
          id: 2,
          name: 'Jane Doe',
          role: 'Manager',
          assignments: 3,
          capacity:10,
      },
      {
          id: 3,
          name: 'George Doe',
          role: 'Staff',
          assignments:8,
          capacity: 10,
      },
      {
          id: 4,
          name: 'Emily Doe',
          role: 'Staff',
          assignments: 10,
          capacity: 10,
      },
      {
          id: 5,
          name: 'John kane',
          role: 'Staff',
          assignments: 15,
          capacity: 10,
      },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const fromScreen = location.state?.from || '';
  const [selectedRows, setSelectedRows] = useState<{ id: any }[]>([]);
  const [staffs, setStaffs] = useState({
      data: data,
      page: 1,
      pageSize: 5,
      filter: Filter.All,
      sortByDir: ApplicationSortByDirection.Asc,
    });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [sortByDir, setSortByDir] = useState<ApplicationSortByDirection>(ApplicationSortByDirection.Asc);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [showFilterSelect, setShowFilterSelect] = useState(false);
    
  const toggleFilterSelect = () => {
    setShowFilterSelect(!showFilterSelect);
  };
  const handleGoBack = () => {
    navigate(-1);
  };

  const debouncedSearch = useCallback(
    debounce(
      (
        data: any,
        page: number,
        pageSize: number,
        filter: Filter,
        sortByDir: ApplicationSortByDirection,
      ) => {
        setStaffs({
          data,
          page,
          pageSize,
          filter,
          sortByDir,
        });
      },
      300,
    ),
    [],
  );

  const handlePageChange = (page: number) => {
    setPage(page);
    debouncedSearch( staffs.data, page, pageSize, filter, sortByDir);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
    debouncedSearch( staffs.data, page, pageSize, filter, sortByDir);
  };
  
  const handleFilterChange = (filter: Filter) => {
    setFilter(filter);
    debouncedSearch( staffs.data, page, pageSize, filter, sortByDir);
  };

  const handleTableChange = (event: any) => {
      if (
        event.property.includes('select_all') ||
        event.property.includes('select_row')
      ) {
        let rows = event.property === 'select_row' ? [event.row] : event.value;
        let isTrue =
          event.property === 'select_row' ? event.value : event.selected;
        if (isTrue) {
          setSelectedRows((prevSelectedRows) => [
            ...prevSelectedRows,
            ...rows.map((row: any) => ({ id: row.id })),
          ]);
        } else {
          setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.filter(
              (selectedRow) =>
                !rows.some((row: any) => selectedRow.id === row.id),
            ),
          );
        }
      }
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
    
  const handleTableSort = (row: any, ascDir: any) => {
    let property = row['graphQLPropertyName'];
    setStaffs((prevData) => {
      // Create a shallow copy of the previous data
      let updatedNotes = [...prevData?.data];
      // Call the common sort function to sort the updatedNotes array
      updatedNotes = sortArray(updatedNotes, property, ascDir);
      // Return the sorted array
      return { ...prevData, data: updatedNotes };
    });
  };
    
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
          allowRowsSelect={true}
          tableColumns={StaffDashboardColumns}
          tableData={staffs?.data ?? []}
          // tableIsLoading={status ?? RequestStatus.idle}
          changeHandler={handleTableChange}
          sortHandler={(row, ascDir) => { handleTableSort(row, ascDir); }}
          title={'Staff'}
          aria-label="Staff Dashboard Widget"
          primaryKeycolumnName="id"
          showPageOptions={true}
          selectPage={handlePageChange}
          changeResultsPerPage={handlePageSizeChange}
          currentPage={page}
          resultsPerPage={pageSize}
          totalResults={staffs?.data?.length ?? 0}
          filter={<FilterControls toggleColumnSelect={toggleFilterSelect} handleFilterChange={handleFilterChange} filter={filter}/>} 
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