import { CircleXMarkIcon, MagnifyingGlassIcon } from "../common/icon";
import { ISearchInput } from "./ISearchInput";
import './SearchInput.css';

const SearchInput: React.FC<ISearchInput> = ({ label, searchTerm, handleSearchChange, clearSearch }) => {
    return (
        <>
            {label && <label className="form-label custom-search-label">{label}</label>}
            <div className="d-flex align-items-center justify-content-center w-100 position-relative">
                <input
                aria-label="Search input "
                onChange={(event) => {handleSearchChange(event)}}
                value={searchTerm}
                type="text"
                className={`form-control custom-search ${searchTerm.length > 0 ? 'ps-2' : 'ps-5'}`}
                />
                {
                searchTerm.length <= 0  
                    ? 
                    <span className="search-icon custom-icon position-absolute px-2"><MagnifyingGlassIcon/></span>
                    :  
                    <span className="clear-icon custom-icon position-absolute px-2"><CircleXMarkIcon  onClick={clearSearch} /></span>
                }
            </div>
        </>
    );
  };
  
  export default SearchInput;