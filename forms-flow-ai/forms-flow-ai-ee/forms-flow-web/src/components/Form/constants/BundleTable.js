import React, { useState, useEffect } from "react";
import {
  InputGroup,
  FormControl,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "react-js-pagination";
import BundleOperations from "../../Bundle/bundleOperations/BundleOperations";
import {
  setBPMFormLimit,
  setBPMFormListPage,
  setBPMFormListSort,
  setBpmFormSearch,
} from "../../../actions/formActions";
import LoadingOverlay from "react-loading-overlay";
//import { format } from 'date-fns'; // 21K (gzipped: 5.8K)
import moment from 'moment'; 
import { useTranslation } from "react-i18next";
function BundleTable() {
  const { t } = useTranslation();
  const dispatch = useDispatch(); 
  const bpmForms = useSelector((state) => state.bpmForms);
  const formData = (() => bpmForms.forms)() || [];
  const pageNo = useSelector((state) => state.bpmForms.page);
  const limit = useSelector((state) => state.bpmForms.limit);
  const totalForms = useSelector((state) => state.bpmForms.totalForms);
  const sortOrder = useSelector((state) => state.bpmForms.sortOrder);
  const [pageLimit, setPageLimit] = useState(5);
  const isAscending = sortOrder === "asc" ? true : false;
  const searchFormLoading = useSelector(state => state.formCheckList.searchFormLoading);
  const searchText = useSelector((state) => state.bpmForms.searchText);
  const [search, setSearch] = useState(searchText || "");

  const pageOptions = [
    {
      text: "5",
      value: 5,
    },
    {
      text: "25",
      value: 25,
    },
    {
      text: "50",
      value: 50,
    },
    {
      text: "100",
      value: 100,
    },
    {
      text: "All",
      value: totalForms,
    },
  ];


  function formatDate(dateString) {
    let dateObj = new Date(dateString);
    
    return moment(dateObj).format('DD/MM/YYYY');
  }

  const updateSort = (updatedSort) => {
    // dispatch(setBpmFormLoading(false));
    dispatch(setBPMFormListSort(updatedSort));
    dispatch(setBPMFormListPage(1));
  };

  const handleSearch = () => {
      dispatch(setBpmFormSearch(search));
      dispatch(setBPMFormListPage(1));
  };

  const handleClearSearch = () => {
    setSearch("");
    dispatch(setBpmFormSearch(""));
  };

  useEffect(()=>{
    setSearch(searchText);
  },[searchText]);

  const handlePageChange = (page) => {
    dispatch(setBPMFormListPage(page));
  };
  const onSizePerPageChange = (limit) => {
    setPageLimit(limit);
    dispatch(setBPMFormLimit(limit));
    dispatch(setBPMFormListPage(1));
  };

  useEffect(()=>{
    if(!search?.trim()){
      dispatch(setBpmFormSearch(""));
    }
  },[search]);
  
  const noDataFound = () => {
    return (
      <tbody >
        <tr>
      <td colSpan="10">
        <div
          className="d-flex align-items-center justify-content-center flex-column w-100"
          style={{minHeight:"300px"}}
        >
          <h3>{t("No bundles found")}</h3>
          <p>{t("Please change the selected filters to view Bundles")}</p>
        </div>
      </td>
      </tr>
      </tbody>
    );
  };

  return (
    <>
    <LoadingOverlay
    active={searchFormLoading}
    spinner
    text = "Loading..."
    >
      <div style={{minHeight:"400px"}}>
      <table className="table">
        <thead>
          <tr>
            <th colSpan="4" >
              <InputGroup className="input-group col-4 px-0">          
                <FormControl 
                  value={search}
                  onChange={(e)=>{setSearch(e.target.value);}}
                  onKeyDown={(e)=> e.keyCode == 13 ? handleSearch() : ""}
                  placeholder= {t("Search...")}
                  style={{ backgroundColor: "#ffff" }}
                />
                {search && (
                  <InputGroup.Append onClick={handleClearSearch}>
                    <InputGroup.Text style={{ backgroundColor: "#ffff" }}>
                      <i className="fa fa-times"></i>
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
                <InputGroup.Append  onClick={handleSearch} disabled={!search?.trim()}>
                  <InputGroup.Text style={{ backgroundColor: "#ffff" }}>
                    <i className="fa fa-search"></i>
                  </InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </th>
          </tr>
          <tr className="table-header table-bordered" style={{backgroundColor:'#F2F2F2'}}>
            <th scope="col">
            <span className="sort-cell" style={{ display: 'flex', gap: '1rem' }}>
                  <span>{t("Bundle Name")}</span>
                    <span >       
                   {isAscending ? (
                      <i
                      className="fa fa-sort-alpha-asc m"
                      onClick={() => {updateSort("desc");}}
                      data-toggle="tooltip"  title={t("Descending")}
                      style={{
                        cursor: "pointer",
                        fontSize : "16px",
                        marginTop : "3px"

                      }}
                      ></i>
                      ) : (
                      <i
                      className="fa fa-sort-alpha-desc"
                      onClick={() => {updateSort("asc");}}
                      data-toggle="tooltip"  title={t("Ascending" )}
                      style={{
                        cursor: "pointer",
                        fontSize : "16px",
                        marginTop : "3px"
                        
                      }}
                      ></i>
                      )
                    }
                    </span> 
            </span>
            </th>
            <th scope="col">{t("Created Date")}</th>
            <th scope="col">{t("Operations")}</th>
          </tr>
        </thead>
        {
        formData?.length ? (
        <tbody className="table-bordered" >
        {
          formData.map((e, index) => {
            return (
              <tr key={index} >
                <td>{e.title}</td>
                <td>{formatDate(e.dateCreated)}</td>
                <td>
                  <BundleOperations formData={e} />
                </td>
              </tr>
            );
          })  
        }
        </tbody>) : !searchFormLoading ? noDataFound() : ""

        }
      </table>
      </div>
   
      
      </LoadingOverlay>
      {
        formData.length ? (
          <div className="d-flex justify-content-between align-items-center">
          <div>
            <span>
              {t("Rows per page")}
              <DropdownButton
                className="ml-2"
                drop="down"
                variant="secondary"
                title={pageLimit}
                style={{ display: "inline" }}
              >
                {pageOptions.map((option, index) => (
                  <Dropdown.Item
                    key={{ index }}
                    type="button"
                    onClick={() => {
                      onSizePerPageChange(option.value);
                    }}
                  >
                    {option.text}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </span>
            {/* <span className="ml-2 mb-3">
              {t("Showing")} {(limit * pageNo ) - (limit - 1)} {t("to")}{" "}
                  {limit * pageNo > totalForms ? totalForms : limit * pageNo} {t("of")}{" "}
                  {totalForms} {t("entries")}
            </span> */}
          </div>
          <div className="d-flex align-items-center">
            <Pagination
              activePage={pageNo}
              itemsCountPerPage={limit}
              totalItemsCount={totalForms}
              pageRangeDisplayed={5}
              itemClass="page-item"
              linkClass="page-link"
              onChange={handlePageChange}
            />
          </div>
        </div>
        ) : ""
      }
    </>
  );
}

export default BundleTable;
