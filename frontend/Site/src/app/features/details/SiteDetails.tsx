import SectionHeader from "../../components/simple/SectionHeader";
import PageContainer from "../../components/simple/PageContainer";
import "./SiteDetails.css";
import LabelComponent from "./LabelComponent";
import { ChevronDown } from "../../components/common/icon";
import { AngleLeft, DropdownIcon, FolderPlusIcon, ShoppingCartIcon } from "../../components/common/icon";
import { useNavigate } from "react-router-dom";

const SiteDetails = () => {
  const navigate = useNavigate();
  const onClickBackButton = () => {
    navigate(-1); 
  }

  return (
    <PageContainer role="deatils">
       <div className="d-flex justify-content-between">
          <button className="d-flex btn-back align-items-center" onClick={onClickBackButton}>
            <AngleLeft className="btn-icon"/>
            <span className="btn-back-lbl"> Back to</span>
          </button>
          <div className="d-flex gap-2">
            <button className="d-flex btn-cart align-items-center">
              <ShoppingCartIcon className="btn-icon"/>
              <span className="btn-cart-lbl"> Add to Cart</span>
            </button>
            <button className="d-flex btn-folio align-items-center">
              <FolderPlusIcon className="btn-folio-icon"/>
              <span className="btn-folio-lbl"> Add to Folio</span>
              <DropdownIcon className="btn-folio-icon"/>
            </button>
          </div>
       </div>
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
