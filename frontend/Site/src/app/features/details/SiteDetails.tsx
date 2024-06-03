import CustomLabel from "../../components/simple/CustomLabel";
import PageContainer from "../../components/simple/PageContainer";
import "./SiteDetails.css";
import LabelComponent from "./LabelComponent";
import { ChevronDown, ChevronUp } from "../../components/common/icon";
import {
  AngleLeft,
  DropdownIcon,
  FolderPlusIcon,
  ShoppingCartIcon,
} from "../../components/common/icon";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ColumnType, TableColumn } from "../../components/table/TableColumn";
import Table from "../../components/table/Table";
import { RequestStatus } from "../../helpers/requests/status";
import userEvent from "@testing-library/user-event";
import SummaryForm from "./SummaryForm";
import PanelWithUpDown from "../../components/simple/PanelWithUpDown";
import Notations from "./notations/Notations";
import NavigationPills from "../../components/navigation/navigationpills/NavigationPills";

const SiteDetails = () => {
  const navigate = useNavigate();
  const onClickBackButton = () => {
    navigate(-1);
  };

  const [showLocationDetails, SetShowLocationDetails] = useState(false);
  const [showParcelDetails, SetShowParcelDetails] = useState(false);

  const items = ['Component 1', 'Component 2', 'Component 3'];
  const components = [<></>];

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

  const activityColumns: TableColumn[] = [
    {
      id: 1,
      displayName: "Activity",
      active: true,
      graphQLPropertyName: "activity",
    },
    {
      id: 1,
      displayName: "User",
      active: true,
      graphQLPropertyName: "user",
    },
    {
      id: 1,
      displayName: "Time Stamp",
      active: true,
      graphQLPropertyName: "timeStamp",
    },
    {
      id: 1,
      displayName: "SR",
      active: true,
      graphQLPropertyName: "id",
      displayType: ColumnType.Checkbox,
    },
  ];

  const columns: TableColumn[] = [
    {
      id: 1,
      displayName: "Documents",
      active: true,
      graphQLPropertyName: "documents",
    },
    {
      id: 1,
      displayName: "Land Uses",
      active: true,
      graphQLPropertyName: "landUses",
    },
    {
      id: 1,
      displayName: "Associated Sites",
      active: true,
      graphQLPropertyName: "associatedSites",
    },
    {
      id: 1,
      displayName: "Notations",
      active: true,
      graphQLPropertyName: "notation",
    },
    {
      id: 1,
      displayName: "Partipants",
      active: true,
      graphQLPropertyName: "participants",
    },
    {
      id: 1,
      displayName: "Parcel Description",
      active: true,
      graphQLPropertyName: "parcelDescription",
    },
  ];

  return (
    <PageContainer role="deatils">
      <div className="d-flex justify-content-between">
        <button
          className="d-flex btn-back align-items-center"
          onClick={onClickBackButton}
        >
          <AngleLeft className="btn-icon" />
          <span className="btn-back-lbl"> Back to</span>
        </button>
        <div className="d-flex gap-2">
          <button className="d-flex btn-cart align-items-center">
            <span className="btn-cart-lbl"> Edit</span>
          </button>
          <button className="d-flex btn-cart align-items-center">
            <ShoppingCartIcon className="btn-icon" />
            <span className="btn-cart-lbl"> Add to Cart</span>
          </button>
          <button className="d-flex btn-folio align-items-center">
            <FolderPlusIcon className="btn-folio-icon" />
            <span className="btn-folio-lbl"> Add to Folio</span>
            <DropdownIcon className="btn-folio-icon" />
          </button>
        </div>
      </div>
      <div className="section-details-header row">
      <div>
        <NavigationPills items={items} components={components} />
      </div>
        <div>
          <CustomLabel label="Site ID:" labelType="b-h5"></CustomLabel>
          <CustomLabel label="18326" labelType="r-h5"></CustomLabel>
        </div>
        <div>
          <CustomLabel
            label="29292 quadra, victoria"
            labelType="b-h1"
          ></CustomLabel>
        </div>
      </div>
      <PanelWithUpDown label="Location Details" secondChild = {
        <div className="row w-100">
          {/* <div color="row"> Location Details </div> */}
          <div className="col-6">Map</div>
          <div className="col-6">
            {/* <SummaryForm /> */}
            <div className="row">
              <div className="col-12">
                <LabelComponent name="Site ID" value="14532" />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <LabelComponent name="Latitude" value="101" />
              </div>
              <div className="col-6">
                <LabelComponent name="Longitude" value="200" />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <LabelComponent name="Address" value="101" />
              </div>
              <div className="col-6">
                <LabelComponent name="Region" value="200" />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <LabelComponent name="Common Name" value="ssss" />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <LabelComponent name="Location Description" value="ssss" />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <LabelComponent name="Site Risk Classification" value="ssss" />
              </div>
            </div>
          </div>
        </div> }
      />
      <PanelWithUpDown label="Parcel ID(s)" secondChild={
        <span>
          12123123, 123123,12312312,1231231,23,123123123123,123123213,1123123
        </span>
      }/>
       
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
          ></Table>
        </div>
      </div>
      <div className="">
        <div className="summary-details-border">
          <span className="summary-details-header">Activity Log</span>
        </div>
        <div className="col-12">
          <Table
            label="Search Results"
            isLoading={RequestStatus.success}
            columns={activityColumns}
            data={activityData}
            totalResults={data.length}
            allowRowsSelect={false}
            showPageOptions={false}
          ></Table>
        </div>
      </div>
      <Notations/>
    </PageContainer>
  );
};

export default SiteDetails;
