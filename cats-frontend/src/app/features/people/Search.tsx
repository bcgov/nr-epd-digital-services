import React, { useState, useEffect } from 'react';
import './Search.css';
import { useSelector } from 'react-redux';
import { updatePeopleStatus } from './dto/PeopleSlice';

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
  isBCEIDUserType,
} from '../../helpers/utility';
import FilterPills from './filters/FilterPills';
import { formRows } from './dto/PeopleFilterConfig';
import { SearchResultsFilters } from './searchResults/SearchResultsFilters';
import { SearchResultsActions } from './searchResults/SearchResultsActions';
import { Button } from '../../components/button/Button';
import { useAuth } from 'react-oidc-context';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useDebouncedValue from '../../helpers/useDebouncedValue';
import { RequestStatus } from '../../helpers/requests/status';
import {
  DEFAULT_PEOPLE_PAGE_SIZE,
  PeopleActiveFilter,
  PeopleSearchMode,
  usePeopleSearch,
} from './hooks/usePeopleSearch';

const Search = () => {
  const auth = useAuth();
  const [urlParams, setUrlParams] = useSearchParams();
  const { data, isLoading, isFetching, isError, isSuccess, criteria, refetch } =
    usePeopleSearch();
  const updatePeopleStatusInState = useSelector(updatePeopleStatus);

  const [searchText, setSearchText] = useState(criteria.searchParam);
  const debouncedSearchText = useDebouncedValue(searchText);
  const [noUserAction, setUserAction] = useState(!criteria.searchParam);

  const peoples = data?.persons ?? [];
  const totalRecords = data?.count ?? 0;

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

  const requestStatus =
    isLoading || isFetching
      ? RequestStatus.loading
      : isError
        ? RequestStatus.failed
        : isSuccess
          ? RequestStatus.success
          : RequestStatus.idle;

  const updateUrlParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(urlParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setUrlParams(newParams);
  };

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
    const currentSearch = urlParams.get('search') || '';
    if (debouncedSearchText === currentSearch) {
      return;
    }

    const newParams = new URLSearchParams(urlParams);
    if (debouncedSearchText.trim()) {
      newParams.set('search', debouncedSearchText);
      newParams.set('page', '1');
    } else {
      newParams.delete('search');
    }
    setUrlParams(newParams);
  }, [debouncedSearchText]);

  useEffect(() => {
    if (
      updatePeopleStatusInState === RequestStatus.success &&
      criteria.searchParam.trim()
    ) {
      void refetch();
    }
  }, [updatePeopleStatusInState]);

  const resetDefaultColums = () => {
    setColumnsToDisplay(columns);
  };

  const pageChange = (pageRequested: number, resultsCount: number) => {
    updateUrlParams({
      page: String(pageRequested),
      pageSize: String(resultsCount),
    });
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
  }, []);

  const handleClearSearch = () => {
    setSearchText('');
    setUserAction(true);
    const newParams = new URLSearchParams(urlParams);
    newParams.delete('search');
    setUrlParams(newParams);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserAction(false);
    setSearchText(event.target.value);
  };

  const handleSearchModeChange = (mode: PeopleSearchMode) => {
    updateUrlParams({
      searchMode: mode,
      page: '1',
    });
  };

  const handleActiveFilterChange = (filter: PeopleActiveFilter) => {
    updateUrlParams({
      activeFilter: filter,
      page: '1',
    });
  };

  const changeHandler = (event: any) => {
    if (event && event.property === 'select_row') {
      if (event.value) {
        const index = selectedRows.findIndex((r: any) => r.id === event.row.id);
        if (index === -1) {
          SetSelectedRows([...selectedRows, event.row]);
        }
      } else {
        SetSelectedRows(selectedRows.filter((r: any) => r.id !== event.row.id));
      }
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

    if (filters.length !== 0) {
      setSelectedFilters(filters);
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
      delete newData[filter.key];
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
        <div className="search-controls">
          <div className="search-mode-toggle">
            <label>
              <input
                type="radio"
                value="OR"
                checked={criteria.searchMode === 'OR'}
                onChange={() => handleSearchModeChange('OR')}
              />
              Match Any (OR)
            </label>
            <label>
              <input
                type="radio"
                value="AND"
                checked={criteria.searchMode === 'AND'}
                onChange={() => handleSearchModeChange('AND')}
              />
              Match All (AND)
            </label>
          </div>
          <div className="active-filter-dropdown">
            <label>Status:</label>
            <select
              value={criteria.activeFilter}
              onChange={(e) =>
                handleActiveFilterChange(e.target.value as PeopleActiveFilter)
              }
            >
              <option value="all">All</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
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
              isLoading={requestStatus}
              currentPage={criteria.page}
              resultsPerPage={criteria.pageSize || DEFAULT_PEOPLE_PAGE_SIZE}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Search;
