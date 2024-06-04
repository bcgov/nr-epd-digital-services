import React, { useEffect, useState } from "react";
import PanelWithUpDown from "../../../components/simple/PanelWithUpDown";
// @ts-ignore
import Map from "../../../../../node_modules/react-parcelmap-bc/dist/Map";
import SummaryForm from "../SummaryForm";
import {
  ChangeTracker,
  IChangeType,
} from "../../../components/common/IChangeType";
import { AppDispatch } from "../../../Store";
import { useDispatch, useSelector } from "react-redux";
import { selectSiteDetails, siteDetailsMode, trackChanges } from "../../site/dto/SiteSlice";
import { RequestStatus } from "../../../helpers/requests/status";
import { FormFieldType } from "../../../components/input-controls/IFormField";
import { TableColumn } from "../../../components/table/TableColumn";
import { CustomPillButton } from "../../../components/simple/CustomButtons";
import Table from "../../../components/table/Table";
import "./Summary.css";
import { SiteDetailsMode } from "../dto/SiteDetailsMode";

const Summary = () => {

    const detailsMode = useSelector(siteDetailsMode);

    useEffect(() => {
        if (detailsMode === SiteDetailsMode.EditMode) {
          setEdit(true);
        } else {
          setEdit(false);
        }
      }, [detailsMode]);
    

  // State Initializations
  const initialParcelIds = [
    12123123, 123123, 12312312, 1231231, 23, 123123123123, 123123213, 1123123,
  ];

  const [edit, setEdit] = useState(true);

  const [location, setLocation] = useState([48.46762, -123.25458]);

  const dispatch = useDispatch<AppDispatch>();

  const details = useSelector(selectSiteDetails);

  const [editSiteDetailsObject, setEditSiteDetailsObject] = useState(details);

  const [parcelIds, setParcelIds] = useState(initialParcelIds);

  // Utility Functions
  const getTrackerLabel = (graphQLPropertyName: any) => {
    if (graphQLPropertyName === "id") return "Site ID";
    if (graphQLPropertyName.includes("addr")) return "Address";
    if (graphQLPropertyName.includes("common")) return "Common Name";
    if (graphQLPropertyName.includes("region")) return "Region";
    return graphQLPropertyName;
  };

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
      id: 1,
      activity: "some activity",
      user: "Midhun",
      timeStamp: "23-04-1989 00:11:11",
    },
  ];

  const columns: TableColumn[] = [
    {
      id: 1,
      displayName: "Documents",
      active: true,
      graphQLPropertyName: "documents",
      displayType: {
        type: FormFieldType.Text,
        label: "Site ID",
        placeholder: 'Separate IDs by a comma (",")',
        graphQLPropertyName: "id",
        value: "",
        validation: {
          pattern: /^[0-9,\s]*$/,
          customMessage: "Site ID can only contain numbers and commas",
        },
        allowNumbersOnly: true,
        colSize: "col-lg-6 col-md-6 col-sm-12",
        customLabelCss: "custom-lbl-text",
        customInputTextCss: "custom-input-text",
        tableMode: true,
      },
    },
    {
      id: 2,
      displayName: "Land Uses",
      active: true,
      graphQLPropertyName: "landUses",
      displayType: {
        type: FormFieldType.Text,
        label: "Site ID",
        placeholder: 'Separate IDs by a comma (",")',
        graphQLPropertyName: "id",
        value: "",
        validation: {
          pattern: /^[0-9,\s]*$/,
          customMessage: "Site ID can only contain numbers and commas",
        },
        allowNumbersOnly: true,
        colSize: "col-lg-6 col-md-6 col-sm-12",
        customLabelCss: "custom-lbl-text",
        customInputTextCss: "custom-input-text",
        tableMode: true,
      },
    },
    {
      id: 3,
      displayName: "Associated Sites",
      active: true,
      graphQLPropertyName: "associatedSites",
      displayType: {
        type: FormFieldType.Text,
        label: "Site ID",
        placeholder: 'Separate IDs by a comma (",")',
        graphQLPropertyName: "id",
        value: "",
        validation: {
          pattern: /^[0-9,\s]*$/,
          customMessage: "Site ID can only contain numbers and commas",
        },
        allowNumbersOnly: true,
        colSize: "col-lg-6 col-md-6 col-sm-12",
        customLabelCss: "custom-lbl-text",
        customInputTextCss: "custom-input-text",
        tableMode: true,
      },
    },
    {
      id: 4,
      displayName: "Notations",
      active: true,
      graphQLPropertyName: "notation",
      displayType: {
        type: FormFieldType.Text,
        label: "Site ID",
        placeholder: 'Separate IDs by a comma (",")',
        graphQLPropertyName: "id",
        value: "",
        validation: {
          pattern: /^[0-9,\s]*$/,
          customMessage: "Site ID can only contain numbers and commas",
        },
        allowNumbersOnly: true,
        colSize: "col-lg-6 col-md-6 col-sm-12",
        customLabelCss: "custom-lbl-text",
        customInputTextCss: "custom-input-text",
        tableMode: true,
      },
    },
    {
      id: 5,
      displayName: "Participants",
      active: true,
      graphQLPropertyName: "participants",
      displayType: {
        type: FormFieldType.Text,
        label: "Site ID",
        placeholder: 'Separate IDs by a comma (",")',
        graphQLPropertyName: "id",
        value: "",
        validation: {
          pattern: /^[0-9,\s]*$/,
          customMessage: "Site ID can only contain numbers and commas",
        },
        allowNumbersOnly: true,
        colSize: "col-lg-6 col-md-6 col-sm-12",
        customLabelCss: "custom-lbl-text",
        customInputTextCss: "custom-input-text",
        tableMode: true,
      },
    },
    {
      id: 6,
      displayName: "Parcel Description",
      active: true,
      graphQLPropertyName: "parcelDescription",
      displayType: {
        type: FormFieldType.Text,
        label: "Site ID",
        placeholder: 'Separate IDs by a comma (",")',
        graphQLPropertyName: "id",
        value: "",
        validation: {
          pattern: /^[0-9,\s]*$/,
          customMessage: "Site ID can only contain numbers and commas",
        },
        allowNumbersOnly: true,
        colSize: "col-lg-6 col-md-6 col-sm-12",
        customLabelCss: "custom-lbl-text",
        customInputTextCss: "custom-input-text",
        tableMode: true,
      },
    },
  ];

  const activityColumns: TableColumn[] = [
    {
      id: 1,
      displayName: "Activity",
      active: true,
      graphQLPropertyName: "activity",
      displayType: {
        type: FormFieldType.Text,
        label: "Site ID",
        placeholder: 'Separate IDs by a comma (",")',
        graphQLPropertyName: "activity",
        value: "",

        allowNumbersOnly: true,
        colSize: "col-lg-6 col-md-6 col-sm-12",
        customLabelCss: "custom-lbl-text",
        customInputTextCss: "custom-input-text",
        tableMode: true,
      },
    },
    {
      id: 2,
      displayName: "User",
      active: true,
      graphQLPropertyName: "user",
      displayType: {
        type: FormFieldType.Text,
        label: "Site ID",
        placeholder: 'Separate IDs by a comma (",")',
        graphQLPropertyName: "user",
        value: "",
        validation: {
          pattern: /^[0-9,\s]*$/,
          customMessage: "Site ID can only contain numbers and commas",
        },
        allowNumbersOnly: true,
        colSize: "col-lg-6 col-md-6 col-sm-12",
        customLabelCss: "custom-lbl-text",
        customInputTextCss: "custom-input-text",
        tableMode: true,
      },
    },
    {
      id: 3,
      displayName: "Time Stamp",
      active: true,
      graphQLPropertyName: "timeStamp",
      displayType: {
        type: FormFieldType.Text,
        label: "Site ID",
        placeholder: 'Separate IDs by a comma (",")',
        graphQLPropertyName: "timeStamp",
        value: "",
        validation: {
          pattern: /^[0-9,\s]*$/,
          customMessage: "Site ID can only contain numbers and commas",
        },
        allowNumbersOnly: true,
        colSize: "col-lg-6 col-md-6 col-sm-12",
        customLabelCss: "custom-lbl-text",
        customInputTextCss: "custom-input-text",
        tableMode: true,
      },
    },
    {
      id: 4,
      displayName: "SR",
      active: true,
      graphQLPropertyName: "id",
      displayType: {
        type: FormFieldType.Text,
        label: "Site ID",
        placeholder: 'Separate IDs by a comma (",")',
        graphQLPropertyName: "id",
        value: "",
        validation: {
          pattern: /^[0-9,\s]*$/,
          customMessage: "Site ID can only contain numbers and commas",
        },
        allowNumbersOnly: true,
        colSize: "col-lg-6 col-md-6 col-sm-12",
        customLabelCss: "custom-lbl-text",
        customInputTextCss: "custom-input-text",
        tableMode: true,
      },
    },
  ];

  return (
    <div className="summary-section-details">
      <PanelWithUpDown
        label="Location Details"
        secondChild={
          <div className="row w-100">
            <div className="col-12 col-lg-6">
              <Map
                callback={() => {}}
                initLocation={location}
                readOnly={true}
              />
            </div>
            <div className="col-12 col-lg-6">
            {editSiteDetailsObject != null &&
              <SummaryForm
                sitesDetails={editSiteDetailsObject}
                edit={edit}
                changeHandler={handleInputChange}
              />
            }
            </div>
          </div>
        }
      />
      <PanelWithUpDown
        label="Parcel ID(s)"
        secondChild={
          !edit ? (
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
          )
        }
      />

      <div className="">
        <div className="summary-details-border">
          <span className="summary-details-header">
            Summary of details types
          </span>
        </div>
        <div className="col-12">
          <Table
            label="Search Results"
            isLoading={RequestStatus.success}
            columns={columns}
            data={data}
            totalResults={data.length}
            allowRowsSelect={false}
            showPageOptions={false}
            changeHandler={() => {}}
            editMode={false}
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
            changeHandler={(eventRecord) => {
              console.log(eventRecord);
            }}
            editMode={edit}
          />
        </div>
      </div>
    </div>
  );
};

export default Summary;
