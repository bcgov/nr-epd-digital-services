import React, { useState, useEffect } from "react";
import {
  InputGroup,
  FormControl,
  DropdownButton,
  Dropdown,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "react-js-pagination";
import {
  setBPMFormLimit,
  setBPMFormListPage,
  setBPMFormListSort,
  setBpmFormSearch,
  setBpmFormType,
} from "../../../actions/formActions";
import FormOperations from "../FormOperations/FormOperations";
import SelectFormForDownload from "../FileUpload/SelectFormForDownload";
import LoadingOverlay from "react-loading-overlay";
import { STAFF_DESIGNER } from "../../../constants/constants";
import { getBundle } from "../../../apiManager/services/bundleServices";
import { useTranslation } from "react-i18next";
import { TYPE_BUNDLE } from "../../../constants/applicationConstants";

function FormTable() {
  const dispatch = useDispatch();
  const bpmForms = useSelector((state) => state.bpmForms);
  const formData = (() => bpmForms.forms)() || [];
  const userRoles = useSelector((state) => state.user.roles || []);
  const pageNo = useSelector((state) => state.bpmForms.page);
  const limit = useSelector((state) => state.bpmForms.limit);
  const totalForms = useSelector((state) => state.bpmForms.totalForms);
  const sortOrder = useSelector((state) => state.bpmForms.sortOrder);
  const formType = useSelector((state) => state.bpmForms.formType);
  const searchFormLoading = useSelector(
    (state) => state.formCheckList.searchFormLoading,
  );
  const isDesigner = userRoles.includes(STAFF_DESIGNER);
  const [pageLimit, setPageLimit] = useState(5);
  const isAscending = sortOrder === "asc" ? true : false;
  const searchText = useSelector((state) => state.bpmForms.searchText);
  const [search, setSearch] = useState(searchText || "");
  const [bundleData, setBundleData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const { t } = useTranslation();

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

  const updateSort = (updatedSort) => {
    dispatch(setBPMFormListSort(updatedSort));
    dispatch(setBPMFormListPage(1));
  };

  const handleTypeChange = (type) => {
    dispatch(setBPMFormListPage(1));
    dispatch(setBPMFormLimit(5));
    dispatch(setBpmFormType(type));
  };

  useEffect(() => {
    setSearch(searchText);
  }, [searchText]);

  useEffect(() => {
    if (!search?.trim()) {
      dispatch(setBpmFormSearch(""));
    }
  }, [search]);

  useEffect(() => {
    setSelectedRow(null);
  }, [pageNo]);

  const handleSearch = () => {
    dispatch(setBpmFormSearch(search));
    dispatch(setBPMFormListPage(1));
  };

  const handleClearSearch = () => {
    setSearch("");
    dispatch(setBpmFormSearch(""));
  };

  const handlePageChange = (page) => {
    dispatch(setBPMFormListPage(page));
  };
  const onSizePerPageChange = (limit) => {
    setPageLimit(limit);
    dispatch(setBPMFormLimit(limit));
    dispatch(setBPMFormListPage(1));
  };

  const handleRowExpansion = (mapperId, index) => {
    setSelectedRow(index === selectedRow ? null : index);
    getBundle(mapperId)
      .then((res) => {
        setBundleData(res.data);
      })
      .catch((err) => {
        console.error("error", err);
      });
  };

  const bundleFormsData = (data) => {
    return (
      <tr>
        <td colSpan={12}>
          <div style={{ display: "flex" }}>
            <div
              style={{
                flex: 1,
                minWidth: "600px",
                padding: "20px",
                borderRight: "1px solid #dee2e6",
              }}
            >
              <h4 className="font-weight-bold">{t("Description")}</h4>
              <p>{data}</p>
            </div>
            <div style={{ flex: 2, padding: "20px" }} className="ml-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="font-weight-bold">
                  {t("Forms included under the package")}
                </h4>
              </div>
              <table className="table" style={{ minWidth: "600px" }}>
                <thead>
                  <tr>
                    <th>{t("Form Order")}</th>
                    <th>{t("Form Name")}</th>
                  </tr>
                </thead>
                <tbody>
                  {bundleData?.map((e, index) => (
                    <tr key={index}>
                      <td>{e.formOrder}</td>
                      <td>{e.formName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  const noDataFound = () => {
    return (
      <tbody>
        <tr>
          <td colSpan="10">
            <div
              className="d-flex align-items-center justify-content-center flex-column w-100"
              style={{ minHeight: "300px" }}
            >
              <h3>{t("No forms found")}</h3>
              <p>{t("Please change the selected filters to view Forms")}</p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  };
  return (
    <>
      <LoadingOverlay active={searchFormLoading} spinner text="Loading...">
        <div style={{ minHeight: "400px" }}>
          <table className="table table-header-color ">
            <thead>
              <tr>
                <th colSpan="4">
                  <InputGroup className="input-group col-4 p-0">
                    <FormControl
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                      onKeyDown={(e) => (e.keyCode == 13 ? handleSearch() : "")}
                      placeholder={t("Search for a package")}
                      style={{ backgroundColor: "#ffff" }}
                    />
                    {search && (
                      <InputGroup.Append onClick={handleClearSearch}>
                        <InputGroup.Text>
                          <i className="fa fa-times"></i>
                        </InputGroup.Text>
                      </InputGroup.Append>
                    )}
                    <InputGroup.Append
                      onClick={handleSearch}
                      disabled={!search?.trim()}
                    >
                      <InputGroup.Text style={{ backgroundColor: "#ffff" }}>
                        <i className="fa fa-search"></i> &nbsp; Search
                      </InputGroup.Text>
                    </InputGroup.Append>

                    {isDesigner && (
                      <Form.Control
                        className="ml-3"
                        onChange={(e) => {
                          handleTypeChange(e.target.value);
                        }}
                        as="select"
                        style={{ backgroundColor: "#ffff" }}
                      >
                        <option selected={formType === "form"} value="form">
                          {t("Form")}
                        </option>
                        <option
                          selected={formType === "resource"}
                          value="resource"
                        >
                          {t("Resource")}
                        </option>
                      </Form.Control>
                    )}
                  </InputGroup>
                </th>
              </tr>
              <tr className="table-header table-bordered">
                <th scope="col">
                  <span
                    className="sort-cell"
                    style={{ display: "flex", gap: "1rem" }}
                  >
                    <span> {t("Form Name")}</span>
                    <span>
                      {isAscending ? (
                        <i
                          className="fa fa-sort-alpha-asc m"
                          onClick={() => {
                            updateSort("desc");
                          }}
                          data-toggle="tooltip"
                          title={t("Descending")}
                          style={{
                            cursor: "pointer",
                            fontSize: "16px",
                            marginTop: "3px",
                          }}
                        ></i>
                      ) : (
                        <i
                          className="fa fa-sort-alpha-desc"
                          onClick={() => {
                            updateSort("asc");
                          }}
                          data-toggle="tooltip"
                          title={t("Ascending")}
                          style={{
                            cursor: "pointer",
                            fontSize: "16px",
                            marginTop: "3px",
                          }}
                        ></i>
                      )}
                    </span>
                  </span>
                </th>
                <th scope="col">{t("Operations")}</th>
                {isDesigner && (
                  <th scope="col">
                    <SelectFormForDownload type="all" />
                  </th>
                )}
                {!isDesigner && <td></td>}
              </tr>
            </thead>

            {formData?.length ? (
              <tbody className="table-bordered">
                {formData?.map((e, index) => {
                  return (
                    <>
                      <tr key={index}>
                        <td>{e.title}</td>
                        <td>
                          <FormOperations formData={e} />
                        </td>
                        {isDesigner && (
                          <td>
                            <SelectFormForDownload form={e} />
                          </td>
                        )}
                        {!isDesigner && (
                          <td>
                            {e.formType === TYPE_BUNDLE && (
                              <i
                                className={`fa fa-chevron-${
                                  selectedRow === index ? "up" : "down"
                                }`}
                                onClick={() =>
                                  handleRowExpansion(e.mapperId, index)
                                }
                                style={{ cursor: "pointer" }}
                              ></i>
                            )}
                          </td>
                        )}
                      </tr>
                      {selectedRow === index && (
                        <>{bundleFormsData(e.description)}</>
                      )}
                    </>
                  );
                })}
              </tbody>
            ) : !searchFormLoading ? (
              noDataFound()
            ) : (
              ""
            )}
          </table>
        </div>
      </LoadingOverlay>

      {formData.length ? (
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span>
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
            <span className="ml-2 mb-3">
              {t("Showing")} {limit * pageNo - (limit - 1)} {t("to")}{" "}
              {limit * pageNo > totalForms ? totalForms : limit * pageNo}{" "}
              {t("of")} {totalForms} {t("entries")}
            </span>
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
      ) : (
        ""
      )}
    </>
  );
}

export default FormTable;
