 import React from "react";
import SectionHeader from "../../components/simple/SectionHeader";
import PageContainer from "../../components/simple/PageContainer";
import "./SiteDetails.css";
import LabelComponent from "./LabelComponent";
import { ChevronDown } from "../../components/common/icon";

const SiteDetails = () => {
  return (
    <PageContainer role="deatils">
      <div>Back to search results</div>
      <div className="section-details-header row">
        <div>
          <span>Site ID:</span>
          <span>18326</span>
        </div>
        <div>
          <SectionHeader
            label="29292 quadra, victoria"
            headingtype="page"
          ></SectionHeader>
        </div>
      </div>
      <div className="section-container">
        <div className="section-container-label">
          <span>
          Location Details
          </span>
          <span className="view-map">
            View on Map
          </span>
        </div>
        <div>
          <ChevronDown/>
        </div>
       
      </div>
      <div className="row">
        <div className="col-6">Map</div>
        <div className="col-6">
          <div className="row">
            <div className="col-12">
            <LabelComponent name="Site ID" value="14532"/>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
            <LabelComponent name="Latitude" value="101"/>
            </div>
            <div className="col-6">
            <LabelComponent name="Longitude" value="200"/>
            </div>
          </div>
          <div className="row">
          <div className="col-6">
            <LabelComponent name="Address" value="101"/>
            </div>
            <div className="col-6">
            <LabelComponent name="Region" value="200"/>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <LabelComponent name="Common Name" value="ssss"/>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <LabelComponent name="Location Description" value="ssss"/>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <LabelComponent name="Site Risk Classification" value="ssss"/>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">parcel id</div>
      </div>
      <div className="row">
        <div className="col-12">summary of detil types</div>
      </div>
      <div className="row">
        <div className="col-12">activity log</div>
      </div>
    </PageContainer>
  );
};

export default SiteDetails;
