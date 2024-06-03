import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CustomLabel from "../../components/simple/CustomLabel";
import PageContainer from "../../components/simple/PageContainer";
import LabelComponent from "./LabelComponent";
import {
  ChevronDown,
  ChevronUp,
  AngleLeft,
  DropdownIcon,
  FolderPlusIcon,
  ShoppingCartIcon,
} from "../../components/common/icon";
import { ColumnType, TableColumn } from "../../components/table/TableColumn";
import Table from "../../components/table/Table";
import { RequestStatus } from "../../helpers/requests/status";
import SummaryForm from "./SummaryForm";
import PanelWithUpDown from "../../components/simple/PanelWithUpDown";
import {
  fetchSitesDetails,
  selectSiteDetails,
  trackChanges,
  trackedChanges,
  clearTrackChanges,
} from "../site/dto/SiteSlice";
import { AppDispatch } from "../../Store";
import ModalDialog from "../../components/modaldialog/ModalDialog";
import {
  CancelButton,
  CustomPillButton,
  SaveButton,
} from "../../components/simple/CustomButtons";
import {
  ChangeTracker,
  IChangeType,
} from "../../components/common/IChangeType";

// @ts-ignore
import Map from "../../../../node_modules/react-parcelmap-bc/dist/Map";

import "./SiteDetails.css"; // Ensure this import is correct

// State Initializations
const initialParcelIds = [
  12123123, 123123, 12312312, 1231231, 23, 123123123123, 123123213, 1123123,
];

const SiteDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();

  const details = useSelector(selectSiteDetails);
  const savedChanges = useSelector(trackedChanges);

  const [editSiteDetailsObject, setEditSiteDetailsObject] = useState(details);
  const [location, setLocation] = useState([48.46762, -123.25458]);
  const [edit, setEdit] = useState(false);
  const [save, setSave] = useState(false);
  const [parcelIds, setParcelIds] = useState(initialParcelIds);
  const [showLocationDetails, setShowLocationDetails] = useState(true);
  const [showParcelDetails, setShowParcelDetails] = useState(true);

  // Handlers
  const onClickBackButton = () => navigate(-1);

  const handleInputChange = (graphQLPropertyName: any, value: any) => {
    const trackerLabel = getTrackerLabel(graphQLPropertyName);
    const tracker = new ChangeTracker(
      IChangeType.Modified,
      "Site Location Details " + trackerLabel
    );
    dispatch(trackChanges(tracker.toPlainObject()));

    const newState = { ...editSiteDetailsObject, [graphQLPropertyName]: value };
    setEditSiteDetailsObject(newState);
  };

  const handleParcelIdDelete = (pid: any) => {
    const tracker = new ChangeTracker(IChangeType.Deleted, "Parcel ID " + pid);
    dispatch(trackChanges(tracker.toPlainObject()));
    setParcelIds(parcelIds.filter((x) => x !== pid));
  };

  // Utility Functions
  const getTrackerLabel = (graphQLPropertyName: any) => {
    if (graphQLPropertyName === "id") return "Site ID";
    if (graphQLPropertyName.includes("addr")) return "Address";
    if (graphQLPropertyName.includes("common")) return "Common Name";
    if (graphQLPropertyName.includes("region")) return "Region";
    return graphQLPropertyName;
  };

  // Effects
  useEffect(() => {
    dispatch(fetchSitesDetails({ siteId: id ?? "" }));
  }, [id]);

  useEffect(() => {
    setEditSiteDetailsObject(details);
  }, [details]);

  // Column Definitions
  const columns = [
    {
      id: 1,
      displayName: "Documents",
      active: true,
      graphQLPropertyName: "documents",
    },
    {
      id: 2,
      displayName: "Land Uses",
      active: true,
      graphQLPropertyName: "landUses",
    },
    {
      id: 3,
      displayName: "Associated Sites",
      active: true,
      graphQLPropertyName: "associatedSites",
    },
    {
      id: 4,
      displayName: "Notations",
      active: true,
      graphQLPropertyName: "notation",
    },
    {
      id: 5,
      displayName: "Participants",
      active: true,
      graphQLPropertyName: "participants",
    },
    {
      id: 6,
      displayName: "Parcel Description",
      active: true,
      graphQLPropertyName: "parcelDescription",
    },
  ];

  const activityColumns = [
    {
      id: 1,
      displayName: "Activity",
      active: true,
      graphQLPropertyName: "activity",
    },
    { id: 2, displayName: "User", active: true, graphQLPropertyName: "user" },
    {
      id: 3,
      displayName: "Time Stamp",
      active: true,
      graphQLPropertyName: "timeStamp",
    },
    {
      id: 4,
      displayName: "SR",
      active: true,
      graphQLPropertyName: "id",
      displayType: ColumnType.Checkbox,
    },
  ];

  const data = [
    {
      notation: 2,
      participants: 1,
      associatedSites: 1,
      documents: 1,
      landUses: 5,
      parcelDescription: 10,
    },
  ];

  const activityData = [
    {
      activity: "some activity",
      user: "Midhun",
      timeStamp: "23-04-1989 00:11:11",
    },
  ];

  return (
    <PageContainer role="details">
      {save && (
        <ModalDialog
          closeHandler={() => {
            setEdit(false);
            setSave(false);
          }}
        >
          {savedChanges.length > 0 ? (
            <React.Fragment>
              <div>
                <span className="custom-modal-data-text">
                  The following fields will be updated:
                </span>
              </div>
              <div>
                <ul className="custom-modal-data-text">
                  {savedChanges.map((item: any) => (
                    <li key={item.label}>
                      {IChangeType[item.changeType]} {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div>
                <span className="custom-modal-data-text">
                  No changes to save
                </span>
              </div>
            </React.Fragment>
          )}
        </ModalDialog>
      )}

      <div className="d-flex justify-content-between">
        <button
          className="d-flex btn-back align-items-center"
          onClick={onClickBackButton}
        >
          <AngleLeft className="btn-icon" />
          <span className="btn-back-lbl">Back to</span>
        </button>
        <div className="d-flex gap-2 justify-align-center">
          {!edit && (
            <button
              className="d-flex btn-cart align-items-center"
              onClick={() => setEdit(!edit)}
            >
              <span className="btn-cart-lbl">Edit</span>
            </button>
          )}
          {edit && (
            <Fragment>
              <CustomLabel labelType="c-b" label="Edit Mode" />
              <SaveButton clickHandler={() => setSave(true)} />
              <CancelButton
                clickHandler={() => {
                  dispatch(clearTrackChanges({}));
                  setEditSiteDetailsObject(details);
                  setSave(false);
                  setEdit(false);
                }}
              />
            </Fragment>
          )}
        </div>
      </div>

      <div className="section-details-header row">
        <div>
          <CustomLabel label="Site ID:" labelType="b-h5" />
          <CustomLabel label="18326" labelType="r-h5" />
        </div>
        <div>
          <CustomLabel label="29292 quadra, victoria" labelType="b-h1" />
        </div>
      </div>

      <PanelWithUpDown label="Location Details">
        <div className="row">
          <div className="col-12 col-lg-6">
            <Map callback={() => {}} initLocation={location} readOnly={true} />
          </div>
          <div className="col-12 col-lg-6">
            <SummaryForm
              sitesDetails={editSiteDetailsObject}
              edit={edit}
              changeHandler={handleInputChange}
            />
          </div>
        </div>
      </PanelWithUpDown>

      <PanelWithUpDown label="Parcel IDs">
        {!edit ? (
          <div>{parcelIds.join(", ")}</div>
        ) : (
          <div className="parcel-edit-div">
            {parcelIds.map((pid) => (
              <CustomPillButton
                key={pid}
                label={pid}
                clickHandler={() => handleParcelIdDelete(pid)}
              />
            ))}
          </div>
        )}
      </PanelWithUpDown>

      <div className="summary-details-border">
        <span className="summary-details-header">Summary of details types</span>
        <div className="col-12">
          <Table
            label="Search Results"
            isLoading={RequestStatus.success}
            columns={columns}
            data={data}
            totalResults={data.length}
            allowRowsSelect={false}
            showPageOptions={false}
          />
        </div>
      </div>

      <div className="summary-details-border">
        <span className="summary-details-header">Activity Log</span>
        <div className="col-12">
          <Table
            label="Search Results"
            isLoading={RequestStatus.success}
            columns={activityColumns}
            data={activityData}
            totalResults={activityData.length}
            allowRowsSelect={false}
            showPageOptions={false}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default SiteDetails;
