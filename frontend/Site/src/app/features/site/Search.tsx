import React, { useState } from "react";
import "./Search.css";
import "@bcgov/design-tokens/css/variables.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchSites , resetSites , setFetchLoadingState } from "./dto/SiteSlice";
import { useEffect } from "react";
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

const Search = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sites = useSelector(selectAllSites);
  const [noUserAction, setUserAction] = useState(true);
  const [displayColumn,SetDisplayColumns] = useState(false);

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

  const handleClearSearch = ()=>{
    setSearchText('');
    dispatch(resetSites(null))
  }

  const handleTextChange = (event: any) => {
    setUserAction(false);
    setSearchText(event.target.value);
    if (event.target.value.length >= 3) {
      dispatch(setFetchLoadingState(null));
      dispatch(fetchSites(event.target.value));
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
            <div className="table-actions-items" onClick={()=>{SetDisplayColumns(!displayColumn)}} >
              <TableColumnsIcon />
              Columns
            </div>
            <div className="table-actions-items">
              <FilterIcon />
              Filters
            </div>
          </div>
        </div>
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
        {displayColumn ? (<div> <Column/></div> ): null }
        <div className="" aria-label="Search results">
          <SearchResults data={search(searchText)} />
        </div>
      </div>
      )}

     
    </div>
  );
};

export default Search;
