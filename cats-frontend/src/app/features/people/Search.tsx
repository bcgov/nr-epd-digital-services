import React, { useState, useEffect } from 'react';
import './Search.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPeoples,
  resetPeoples,
  setFetchLoadingState,
  updateSearchQuery,
  updatePageSizeSetting,
  resultsCount,
  updatePeopleStatus,
} from './dto/PeopleSlice';

import { AppDispatch } from '../../Store';
import {
  selectAllPeoples,
  currentPageSelection,
  currentPageSize,
} from './dto/PeopleSlice';
import SearchResults from './searchResults/SearchResults';
import {
  CircleXMarkIcon,
  MagnifyingGlassIcon,
  Plus,
} from '../../components/common/icon';

import { TableColumn } from '../../components/table/TableColumn';
import { getPeopleSearchResultsColumns } from './dto/Columns';
import PageContainer from '../../components/simple/PageContainer';
import {
  flattenFormRows,
  formatDateRange,
  getUser,
  isBCEIDUserType,
} from '../../helpers/utility';
import FilterPills from './filters/FilterPills';
import { formRows } from './dto/PeopleFilterConfig';
import { SearchResultsFilters } from './searchResults/SearchResultsFilters';
import { SearchResultsActions } from './searchResults/SearchResultsActions';
import { Button } from '../../components/button/Button';
import Actions from '../../components/action/Actions';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { from } from '@apollo/client';

const Search = () => {
  const auth = useAuth();
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const peoples = useSelector(selectAllPeoples);
  const currSearchVal = useSelector((state: any) => state.peoples);
  const currentPageInState = useSelector(currentPageSelection);
  const currentPageSizeInState = useSelector(currentPageSize);
  const updatePeopleStatusInState = useSelector(updatePeopleStatus);
  const totalRecords = useSelector(resultsCount);
  const [noUserAction, setUserAction] = useState(true);

  const columns = getPeopleSearchResultsColumns();
  const [columnsToDisplay, setColumnsToDisplay] = useState<TableColumn[]>([
    ...columns,
  ]);
  const [selectedRows, SetSelectedRows] = useState<any[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<
    { key: string; value: string; label: string }[]
  >([]);
  const [formData, setFormData] = useState<{
    [key: string]: any | [Date, Date];
  }>({});

  const navigate = useNavigate();
  const toggleColumnSelectionForDisplay = (column: TableColumn) => {
    const index = columnsToDisplay.findIndex((item) => item.id === column.id);

    if (index !== -1 && !columnsToDisplay[index].disabled) {
      const updatedColumnsToDisplay = [...columnsToDisplay];
      updatedColumnsToDisplay[index] = {
        ...updatedColumnsToDisplay[index],
        isChecked: !updatedColumnsToDisplay[index].isChecked,
      };
      setColumnsToDisplay(updatedColumnsToDisplay);
    }
  };

  useEffect(() => {}, [selectedRows]);

  useEffect(() => {
    if (currSearchVal.searchQuery !== '') {
      dispatch(
        fetchPeoples({ searchParam: currSearchVal.searchQuery ?? searchText }),
      );
    }
  }, [currentPageInState, updatePeopleStatusInState]);

  useEffect(() => {
    if (currSearchVal.searchQuery !== '') {
      dispatch(
        fetchPeoples({ searchParam: currSearchVal.searchQuery ?? searchText }),
      );
    }
  }, [currentPageSizeInState]);

  const resetDefaultColums = () => {
    setColumnsToDisplay(columns);
  };

  const pageChange = (pageRequested: number, resultsCount: number) => {
    dispatch(
      updatePageSizeSetting({
        currentPage: pageRequested,
        pageSize: resultsCount,
      }),
    );
  };

  useEffect(() => {
    const loggedInUserBCEID = isBCEIDUserType();
    if (loggedInUserBCEID) {
      navigate('/error');
    }
  }, []);

  useEffect(() => {
    const loggedInUserBCEID = isBCEIDUserType();
    if (loggedInUserBCEID) {
      auth.signinRedirect({ extraQueryParams: { kc_idp_hint: 'idir' } });
    }

    if (currSearchVal.searchQuery !== '') {
      setUserAction(false);
      setSearchText(currSearchVal.searchQuery);
      dispatch(fetchPeoples({ searchParam: currSearchVal.searchQuery }));
    }
  }, []);

  // useEffect(() => {
  //   fetchPeoples(searchText);
  // }, [dispatch,  searchText]);

  const handleClearSearch = () => {
    setSearchText('');
    setUserAction(true);
    dispatch(resetPeoples(null));
    dispatch(updateSearchQuery(''));
  };

  const handleTextChange = (event: any) => {
    setUserAction(false);
    setSearchText(event.target.value);
    if (event.target.value.length >= 3) {
      dispatch(setFetchLoadingState(null));
      if (selectedFilters) {
        const filterData: any = {};
        selectedFilters.forEach((filter: any) => {
          filterData[filter.key] = filter.value;
        });
        dispatch(
          fetchPeoples({
            searchParam: event.target.value,
            filter: filterData,
          }),
        );
      } else {
        dispatch(fetchPeoples({ searchParam: event.target.value }));
      }
      dispatch(updateSearchQuery(event.target.value));
    } else {
      dispatch(resetPeoples(null));
    }
  };

  const changeHandler = (event: any) => {
    if (event && event.property === 'select_row') {
      if (event.value) {
        const index = selectedRows.findIndex((r: any) => r.id === event.row.id);
        if (index === -1) {
          SetSelectedRows([...selectedRows, event.row]);
        } else {
          // do nothing
        }
      } else {
        SetSelectedRows(selectedRows.filter((r: any) => r.id !== event.row.id));
      }

      //const index = selectedRows.findIndex((r: any) => r.id === event.row.id);
      // if (index > -1 && !event.value) {
      //   // If row is already selected, remove it
      //   SetSelectedRows(selectedRows.filter((r: any) => r.id !== event.row.id));
      // } else {
      //   // If row is not selected, add it
      //   SetSelectedRows([...selectedRows, event.row]);
      // }
    } else if (event && event.property === 'select_all') {
      const newRows = event.value;
      if (event.selected) {
        SetSelectedRows((prevArray) => {
          const existingIds = new Set(prevArray.map((obj) => obj.id));
          const uniqueRows = newRows.filter(
            (row: any) => !existingIds.has(row.id),
          );
          return [...prevArray, ...uniqueRows];
        });
      } else {
        SetSelectedRows((prevArray) => {
          const idsToRemove = new Set(newRows.map((row: any) => row.id));
          return prevArray.filter((obj) => !idsToRemove.has(obj.id));
        });
      }
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const filteredFormData: { [key: string]: string } = {};
    const filters: { key: string; value: string; label: string }[] = [];
    const flattedArr = flattenFormRows(formRows);
    // Filter out form data with non-empty values and construct filteredFormData and filters
    for (const [key, value] of Object.entries(formData)) {
      let currLabel =
        flattedArr && flattedArr.find((row) => row.graphQLPropertyName === key);
      if (key === 'whenCreated' || key === 'whenUpdated') {
        let dateRangeValue = formatDateRange(value);
        filteredFormData[key] = value;
        filters.push({
          key,
          value: dateRangeValue,
          label: currLabel?.label ?? '',
        });
      } else if (value.trim() !== '') {
        filteredFormData[key] = value;
        filters.push({ key, value, label: currLabel?.label ?? '' });
      }
    }

    // show and format pill.
    if (filters.length !== 0) {
      dispatch(
        fetchPeoples({
          searchParam: currSearchVal.searchQuery,
          filter: filteredFormData,
        }),
      );
      setSelectedFilters(filters);

      // Save filter selections to local storage
      localStorage.setItem('peopleFilterPills', JSON.stringify(filters));
    }
  };

  const handleReset = () => {
    setFormData({});
    setSelectedFilters([]);
    localStorage.removeItem('peopleFilterPills');
  };

  useEffect(() => {
    const storedFilters = localStorage.getItem('peopleFilterPills');
    if (storedFilters) {
      const parsedFilters = JSON.parse(storedFilters);
      const initialFormData: any = {};
      parsedFilters.forEach((filter: any) => {
        initialFormData[filter.key] = filter.value;
      });
      setFormData(initialFormData);
      setSelectedFilters(parsedFilters);
    }
  }, []);

  const handleRemoveFilter = (filter: any) => {
    setFormData((prevData) => {
      const newData = { ...prevData };
      delete newData[filter.key]; // Remove the filter key from the form data
      dispatch(
        fetchPeoples({
          searchParam: currSearchVal.searchQuery,
          filter: newData,
        }),
      );
      return newData;
    });
    let currFilter = selectedFilters.filter((item) => item.key !== filter.key);
    setSelectedFilters(currFilter);
    localStorage.setItem('peopleFilterPills', JSON.stringify(currFilter));
  };

  return (
    <PageContainer role="Search">
      <div className="search-container">
        <h1 className="search-text-label">Manage People</h1>
        <div className="manage-people">
          <Button
            onClick={() => {
              navigate('/person', { state: { from: 'Manage People' } });
            }}
          >
            <Plus />
            New Person Profile
          </Button>
        </div>
        <div className="">
          <div className="d-flex align-items-center">
            <div className="custom-text-search">
              {!noUserAction ? null : (
                <div className="custom-text-search-start">
                  <MagnifyingGlassIcon className="customSearchIcon"></MagnifyingGlassIcon>
                </div>
              )}

              <div className={`custom-text-search-middle`}>
                <input
                  tabIndex={13}
                  aria-label="Search input"
                  placeholder="Search People"
                  onChange={handleTextChange}
                  value={searchText}
                  type="text"
                  className={`textSearch custom-text-search-control  ${
                    !noUserAction ? `addBorder` : ``
                  }`}
                />
              </div>
              {noUserAction ? null : (
                <div className="custom-text-search-end">
                  <CircleXMarkIcon
                    onClick={() => {
                      handleClearSearch();
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="search-parent">
        <div
          className="row search-container results"
          aria-label="search-results-section-title"
        >
          <SearchResultsFilters
            columns={columnsToDisplay}
            onColumnSelectionChange={toggleColumnSelectionForDisplay}
            resetColumns={resetDefaultColums}
            filtersFormData={formData}
            onFiltersChange={handleInputChange}
            onFiltersSubmit={handleFormSubmit}
            onFiltersReset={handleReset}
          />
          <SearchResultsActions selectedRows={selectedRows} />
        </div>
        <FilterPills
          filters={selectedFilters}
          onRemoveFilter={(filter) => {
            handleRemoveFilter(filter);
          }}
        />
        <div>
          <div className="" aria-label="Search results">
            <SearchResults
              pageChange={pageChange}
              data={peoples}
              columns={columnsToDisplay.filter((x) => x.isChecked === true)}
              totalRecords={totalRecords}
              changeHandler={changeHandler}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Search;
