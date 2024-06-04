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
import { TableColumn } from "../../components/table/TableColumn";
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
  siteDetailsMode,
  updateSiteDetailsMode,
} from "../site/dto/SiteSlice";
import { AppDispatch } from "../../Store";
import Notations from "./notations/Notations";
import NavigationPills from "../../components/navigation/navigationpills/NavigationPills";
import { navComponents, navItems } from "./NavigationPillsConfig";
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

import "./SiteDetails.css"; // Ensure this import is correct
import { FormFieldType } from "../../components/input-controls/IFormField";
import { SiteDetailsMode } from "./dto/SiteDetailsMode";

const SiteDetails = () => {
 
  const [edit, setEdit] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const onClickBackButton = () => {
    navigate(-1);
  };

  const [showLocationDetails, SetShowLocationDetails] = useState(false);
  const [showParcelDetails, SetShowParcelDetails] = useState(false);

  const { id } = useParams();

  const details = useSelector(selectSiteDetails);
  const [editSiteDetailsObject, setEditSiteDetailsObject] = useState(details);
  const savedChanges = useSelector(trackedChanges);

  const [save, setSave] = useState(false);

  const items = ["Component 1", "Component 2", "Component 3"];
  const components = [<></>];

  // Effects
  useEffect(() => {
    dispatch(fetchSitesDetails({ siteId: id ?? "" }));
  }, [id]);

  useEffect(() => {
    setEditSiteDetailsObject(details);
  }, [details]);

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
              onClick={() => { dispatch(updateSiteDetailsMode(SiteDetailsMode.edit)); setEdit(!edit)}}
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
        {/* <div className="d-flex gap-2">
          <button className="d-flex btn-cart align-items-center" onClick={()=>{setEdit(!edit)}}>
            <span className="btn-cart-lbl" > Edit</span>
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
        </div> */}
      </div>

      <div className="section-details-header row">
        {/* <div>
          <CustomLabel label="Site ID:" labelType="b-h5" />
          <CustomLabel label={editSiteDetailsObject.id} labelType="r-h5" />
        </div>
        <div>
          <CustomLabel label={editSiteDetailsObject.addrLine_1 +","+editSiteDetailsObject.addrLine_2+","+editSiteDetailsObject.addrLine_3} labelType="b-h1" />
        </div> */}
      </div>
      <NavigationPills items={navItems} components={navComponents} />
    </PageContainer>
  );
};

export default SiteDetails;
