import React, { useState } from "react";
import PanelWithUpDown from "../../../components/simple/PanelWithUpDown";
import LabelComponent from "../LabelComponent";
import Form from "../../../components/form/Form";
import { notationColumnInternal, notationFormRowsInternal, notationFormRowExternal, notationFormRowsFirstChild, notationSortBy, notationColumnExternal } from "./NotationsConfig";
import './Notations.css';
import Widget from "../../../components/widget/Widget";
import { IWidget } from "../../../components/widget/IWidget";
import { RequestStatus } from "../../../helpers/requests/status";
import { UserType } from "../../../helpers/requests/userType";
import { AppDispatch } from "../../../Store";
import { useDispatch } from "react-redux";
import { Plus, UserMinus, UserPlus } from "../../../components/common/icon";
import { INotations } from "./INotations";
import { UserMode } from "../../../helpers/requests/userMode";

const dummyData = [
    {
      id: 1,
      role: ["Admin", "User", "Guest"],
      participantName: "John Doe",
      sr: true,
      date: new Date('2024-05-01')
    },
    {
      id: 2,
      role: "User",
      participantName: "Jane Smith",
      sr: false,
      date: new Date('2024-05-05')
    },
    {
      id:3,
      role: "Guest",
      participantName: "Alex Johnson",
      sr: true,
      date: new Date('2024-05-03')
    },
    {
      id:4,
      role: "Moderator",
      participantName: "Chris Lee",
      sr: false,
      date: new Date('2024-05-03')
    },
    {
      id:5,
      role: "User",
      participantName: "Patricia Brown",
      sr: true,
      date: new Date('2024-05-05')
    },
  ];


const Notations: React.FC<INotations> = ({ 
    mode,
    user,
  }) => {

    const [userType, setUserType] = useState<UserType>(UserType.External);
    const [viewMode, setViewMode] = useState(UserMode.EditMode);

    const [formData, setFormData] =  useState<{ [key: string]: any | [Date, Date] }>({});
    const [loading, setLoading] = useState<RequestStatus>(RequestStatus.loading);
    const [data, setData] = useState<any[]>(dummyData);

    const dispatch = useDispatch<AppDispatch>();

    const [btnDisabled, setBtnDisabled] = useState(true);
    const [srTimeStamp, setSRTimeStamp] = useState('Sent to SR on June 2nd, 2013');

    const [sortByValue, setSortByValue] = useState<{ [key: string]: any }>({});
    
    const handleAddParticipant = () => {
        alert('handleAddParticipant click');
    };

    const handleRemoveParticipant = () => {
        alert('handleRemoveParticipant click');
    };

    const handleInputChange = (graphQLPropertyName: any, value: String | [Date, Date]) => {
      setFormData((prevData) => ({
          ...prevData,
          [graphQLPropertyName]:value 
      }));
    };

    const handleSortChange = (graphQLPropertyName: any, value: String | [Date, Date] ) => {
      setSortByValue((prevData) => ({
        ...prevData,
        [graphQLPropertyName]:value 
      }));
      sortItems (value);
    }

    const sortItems = (sortBy:any) => {
      let sorted = [...data];
      switch (sortBy) {
        case 'newToOld':
          sorted.sort((a, b) => b.date - a.date); // Sorting by date from new to old
          break;
        // Add more cases for additional sorting options
        default:
          break;
      }
      setData(sorted);
    };

    const handleOnAddNotation = () => {
      // alert("Add Notation Click");
      setViewMode(UserMode.SrMode);
    };

    return (
      <>
          <div className="row ">
          { userType == UserType.Internal && (viewMode == UserMode.EditMode || viewMode == UserMode.SrMode) &&
            <div className="col-lg-6 col-md-12 py-4">
              <button className={`d-flex align-items-center ${viewMode == UserMode.EditMode ? `btn-add-notation` : `btn-add-notation-disable`} `} disabled= { viewMode == UserMode.SrMode } onClick={handleOnAddNotation}
               aria-label="Add Notation">
                  <Plus className="btn-notation-icon"/>
                  <span>Add Notation</span>
              </button>
            </div>
          }
            <div className={`${userType == UserType.Internal ? `col-lg-6 col-md-12` : `col-lg-12`}`}>
              <div className="row justify-content-between">
                <div className={`${userType == UserType.Internal ? `col` : `col-xxl-8 col-xl-8 col-lg-8 col-md-12 col-sm-12 col-xs-12`}`}>
                  <Form formRows={notationSortBy} formData={sortByValue} editMode={true} handleInputChange={handleSortChange}/> 
                </div>
                <div className={`${userType == UserType.Internal ? `col` : `col-xxl-4 col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12`}`}>
                  <Form formRows={notationSortBy} formData={sortByValue} editMode={true} handleInputChange={handleSortChange}
                  aria-label="Sort By Form"/> 
                </div>
              </div>
            </div>
          </div>
      
        <PanelWithUpDown 
              firstChild= { 
                  <div className="w-100">
                    <Form formRows={notationFormRowsFirstChild} formData={formData} editMode={viewMode == UserMode.EditMode} handleInputChange={handleInputChange}
                     aria-label="Sort Notation Form"/>
                   { userType == UserType.Internal && <span className="sr-time-stamp">{srTimeStamp}</span> }
                  </div>
                  }
              secondChild= { 
                  <div>
                      <Form formRows={ userType == UserType.External ? notationFormRowExternal : notationFormRowsInternal } formData={formData} editMode={viewMode == UserMode.EditMode} handleInputChange={handleInputChange}
                      aria-label="Sort Notation Form"/>
                      <Widget title={'Notation'} tableColumns={ userType == UserType.Internal ? notationColumnInternal : notationColumnExternal} tableData={data} tableIsLoading={loading} allowRowsSelect={viewMode == UserMode.EditMode}
                      aria-label="Notation Widget">
                       { userType == UserType.Internal &&
                          <div className="d-flex gap-2">
                            <button className=" d-flex align-items-center notation-btn" type="button" onClick={handleAddParticipant} aria-label={'Add Participant'} >
                                <UserPlus className="btn-user-icon"/>
                                <span className="notation-btn-lbl">{'Add Participant'}</span>
                            </button>
                            <button className={`d-flex align-items-center ${!btnDisabled ? `notation-btn` : `notation-btn-disable`}`} disabled={btnDisabled} type="button" onClick={handleRemoveParticipant} aria-label={'Remove Participant'} >
                                <UserMinus className={`${!btnDisabled ?`btn-user-icon`: `btn-user-icon-disabled`}`}/>
                                <span className={`${!btnDisabled ? `notation-btn-lbl` : `notation-btn-lbl-disabled`}`}>{'Remove Participant'}</span>
                            </button>
                          </div>
                        }
                      </Widget>
                     { userType == UserType.Internal && <p className="sr-time-stamp">{srTimeStamp}</p>}
                  </div>
                }
          />
      </>
    );
}


export default Notations;