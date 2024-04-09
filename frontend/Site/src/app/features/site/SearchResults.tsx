import React, { useEffect } from "react";
import { SpinnerIcon, SortIcon } from "../../components/common/icon";
import "./SearchResults.css";
import { loadingState } from "./dto/SiteSlice";
import { RequestStatus } from "../../helpers/requests/status";
import { useSelector } from "react-redux";

const SearchResults = ({ data }: { data: any[] }) => {
  const columns: string[] = [
    "Site ID",
    "Site Address",
    "City",
    "Region",
    "Last Updated Date",
    "Map",
    "Details",
  ];

  const requestStatus = useSelector(loadingState);

  useEffect(() => {
    console.log("loadingState", requestStatus);
  }, [requestStatus]);

  return (
    <table className="table" aria-label="Search Results">
      <thead aria-label="Search Results Header" >
        <tr className="search-results-section-header">
          <th scope="col" className="search-results-th">
            <input type="checkbox" className="checkbox-color" />
          </th>
          {/* {columns.map((item, index) => {            
            if (item === 'Region' || item === 'Last Updated Date') {
              return (
                <th key={index} scope="col" className="search-results-th hide-custom">
                  {item}
                  <SortIcon className="search-results-sort-icon" />
                </th>
              );
            } else {
              return (
                <th key={index} scope="col" className="search-results-th">
                  {item}
                  <SortIcon className="search-results-sort-icon" />
                </th>
              );
            }
          })} */}

{columns.map((item, index) => (
            <th key={index} scope="col" className={`search-results-th ${item === 'Region' || item === 'Last Updated Date' ? 'hide-custom' : ''}`}>
              {item}
              <SortIcon className="search-results-sort-icon" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={8} className="noContent border-quick-color">
              {requestStatus === RequestStatus.loading ? (
                <div className="results-loading">
                  <SpinnerIcon
                    data-testid="loading-spinner"
                    className="fa-spin "
                  />
                  <span className="noContentText"> Searching </span>
                </div>
              ) : (
                <span className="noContentText">No Results Found</span>
              )}
            </td>
          </tr>
        ) : (
          data.map((item: any) => (
            <tr key={item.id}>
              <td className="border-quick-color search-results-text">
                <input
                  type="checkbox"
                  className="checkbox-color"
                  aria-label="Select Row"
                />
              </td>
              <td className="border-quick-color search-results-text">
              
                <a href="#" aria-label={`Site ID ${item.siteId}`}>
                  {item.id}
                </a>
              </td>
              <td
                className="border-quick-color search-results-text"
                aria-label={`Site Address ${item.address}`}
              >
                {item.addrLine_1 +
                  " " +
                  item.addrLine_2 +
                  " " +
                  item.addrLine_3}
              </td>
              <td
                className="border-quick-color search-results-text"
                aria-label={`City ${item.city}`}
              >
                {item.city}
              </td>
              <td
                className="border-quick-color search-results-text hide-custom"
                aria-label={`Region ${item.provState}`}
              >
                {item.provState}
              </td>
              <td
                className="border-quick-color search-results-text hide-custom"
                aria-label={`Region ${item.whenCreated}`}
              >
                {item.whenCreated}
              </td>
              <td className="border-quick-color search-results-text">
                <a href="/map">View</a>
              </td>
              <td className="border-quick-color search-results-text">
                <a href="/site/details">Details</a>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default SearchResults;
