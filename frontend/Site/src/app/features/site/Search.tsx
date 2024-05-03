import React, { useState,useEffect } from "react";
import "./Search.css";
import "@bcgov/design-tokens/css/variables.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchSites , resetSites , setFetchLoadingState , updateSearchQuery } from "./dto/SiteSlice";

import { AppDispatch } from "../../Store";
import { selectAllSites } from "./dto/SiteSlice";
import SearchResults from "./SearchResults";
import { 
  ShoppingCartIcon,
  FolderPlusIcon,
  FileExportIcon,
  TableColumnsIcon,
  FilterIcon,
  CircleXMarkIcon
} from "../../components/common/icon";
import Intro from "./Intro";
import Column from "./columns/Column";
import TableColumns from "./dto/Columns";
import { getSiteSearchResultsColumns } from "./dto/Columns";
import SiteFilterForm from "./filters/SiteFilterForm";

const Search = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sites = useSelector(selectAllSites);
  const [noUserAction, setUserAction] = useState(true);
  const [displayColumn,SetDisplayColumns] = useState(false);
  const [displayFilters,SetDisplayFilters] = useState(false);
  const columns = getSiteSearchResultsColumns();
  const [columnsToDisplay, setColumnsToDisplay] = useState<TableColumns[]>([...columns]);


  const toggleColumnSelectionForDisplay = (column:TableColumns) =>{
      const index =  columnsToDisplay.findIndex(item=>item.id===column.id);  
  
      if (index !== -1 && !columnsToDisplay[index].disabled) {
        const updatedColumnsToDisplay = [...columnsToDisplay];
        updatedColumnsToDisplay[index] = {
            ...updatedColumnsToDisplay[index],
            isChecked: !updatedColumnsToDisplay[index].isChecked
        };
        setColumnsToDisplay(updatedColumnsToDisplay);
    }
  }

  const resetDefaultColums = () => {
    setColumnsToDisplay(columns);
  }

  const cancelSearchFilter = () => {
    SetDisplayFilters(false);
 }

  useEffect(() => {}, []);

  const search = (value: any) => {
    console.log(sites);
    return sites;
  };

  useEffect(() => {
    console.log(sites);
    //if(sites)
  }, [sites]);

  const [searchText, setSearchText] = useState('');

  useEffect(()=>{
    console.log("updated",columnsToDisplay.filter(x=>x.isChecked === true).map((item,index)=>{ return item.graphQLPropertyName  }).toString());

    dispatch(updateSearchQuery(columnsToDisplay.filter(x=>x.isChecked === true).map((item,index)=>{ return item.graphQLPropertyName  }).toString()));
    //dispatch();
    
    fetchSites({ searchParam: searchText.trim() });
  },[dispatch,columnsToDisplay, searchText]);
  

  const handleClearSearch = ()=>{
    setSearchText('');
    dispatch(resetSites(null))
  }

  const handleTextChange = (event: any) => {
    setUserAction(false);
    setSearchText(event.target.value);
    if (event.target.value.length >= 3) {
      dispatch(setFetchLoadingState(null));
      dispatch(fetchSites({searchParam: event.target.value}));
    }
    else
    {
        console.log('reset');
        dispatch(resetSites(null));
        
    }
    console.log(searchText);
  };

  return (
    <div className="siteSearchContainer" role="search">
      <div className="row search-container">
        <h1 className="search-text-label">Search Site Registry</h1>
        <div className="row">
          <div className="d-flex align-items-center">
            <input
              type="text"
              onChange={handleTextChange}
              className="form-control textSearch"
              placeholder="Search"
              aria-label="Search input"
              value={searchText}
              tabIndex={13}
            />
            {noUserAction ?  null :(
            <CircleXMarkIcon className="clear-button" onClick={()=>{handleClearSearch()}} > 
            </CircleXMarkIcon>)}
          </div>       
        </div>       
      </div>
      {noUserAction ? 
      (<div>
        <Intro></Intro>
      </div>) : (
      <div className="row search-container" aria-labelledby="search-results-section-title">
        <div className="search-results-section-header-top">
          <div>
            <h2 className="search-results-section-title">Results</h2>
          </div>
          <div className="table-actions hide-custom">
            <div className={`table-actions-items ${displayColumn ? 'active': ''} ` } onClick={()=>{ console.log(columns); SetDisplayColumns(!displayColumn); SetDisplayFilters(false);}} >
              <TableColumnsIcon />
              Columns
            </div>
            <div className={`table-actions-items ${displayFilters ? 'active': ''}`}  onClick={() => {SetDisplayFilters(!displayFilters); SetDisplayColumns(false);}}>
              <FilterIcon />
              Filters
            </div>
          </div>
        </div>
        {displayFilters && <SiteFilterForm cancelSearchFilter = {cancelSearchFilter}/>}
        {displayColumn ? (<div> <Column toggleColumnSelectionForDisplay={toggleColumnSelectionForDisplay} columns={columnsToDisplay} reset={resetDefaultColums}  /></div> ): null }
        <div className="search-result-actions d-none d-md-flex">
          <div className="search-result-actions-btn">
            <ShoppingCartIcon />
            <span>Add Selected To Cart</span>
          </div>
          <div className="search-result-actions-btn">
            <FolderPlusIcon />
            <span>Add Selected To Folio</span>
          </div>
          <div className="search-result-actions-btn">
            <FileExportIcon />
            <span>Export Results As File</span>
          </div>
        </div>
       
        <div className="" aria-label="Search results">
          <SearchResults data={search(searchText)} columns={columnsToDisplay.filter(x=>x.isChecked === true)} />
        </div>
      </div>
      )}

     
    </div>
  );
};

export default Search;
