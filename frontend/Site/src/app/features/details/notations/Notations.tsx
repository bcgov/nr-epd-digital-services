import React, { useEffect, useState } from "react";
import PanelWithUpDown from "../../../components/simple/PanelWithUpDown";
import Form from "../../../components/form/Form";
import { notationColumnInternal, notationFormRowsInternal, notationFormRowExternal, notationFormRowsFirstChild, notationColumnExternal } from "./NotationsConfig";
import './Notations.css';
import Widget from "../../../components/widget/Widget";
import { RequestStatus } from "../../../helpers/requests/status";
import { UserType } from "../../../helpers/requests/userType";
import { AppDispatch } from "../../../Store";
import { useDispatch, useSelector } from "react-redux";
import { CircleXMarkIcon, MagnifyingGlassIcon, Plus, UserMinus, UserPlus } from "../../../components/common/icon";
import { INotations } from "./INotations";
// import { SiteDetailsMode } from "../../../helpers/requests/SiteDetailsMode";
import { ChangeTracker, IChangeType } from "../../../components/common/IChangeType";
import { resetSiteDetails, siteDetailsMode, trackChanges } from "../../site/dto/SiteSlice";
import { flattenFormRows, formatDateRange } from "../../../helpers/utility";
import Search from "../../site/Search";
import SearchInput from "../../../components/search/SearchInput";
import Sort from "../../../components/sort/Sort"; 
import SiteDetails from "../SiteDetails";
import { SiteDetailsMode } from "../dto/SiteDetailsMode";
import { setDate } from "date-fns";

const dummyData = [
    // {
    //   id: 1,
    //   role: ["Admin", "User", "Guest"],
    //   participantName: "John Doe",
    //   sr: true,
    //   date: new Date('2024-05-01')
    // },
    {
      id: 2,
      role: "CSAP",
      participantName: "Jane Smith",
      sr: false,
      date: new Date('2024-05-05')
    },
    {
      id:3,
      role: "SDM",
      participantName: "Alex Johnson",
      sr: true,
      date: new Date('2024-05-03')
    },
    {
      id:4,
      role: "CSSATEAM",
      participantName: "Chris Lee",
      sr: false,
      date: new Date('2024-05-03')
    }
  ];


const Notations: React.FC<INotations> = ({    
    user,
  }) => {

    const [userType, setUserType] = useState<UserType>(UserType.Internal);
    const [viewMode, setViewMode] = useState(SiteDetailsMode.ViewOnlyMode);

    const [formData, setFormData] =  useState<{ [key: string]: any | [Date, Date] }>({});
    const [loading, setLoading] = useState<RequestStatus>(RequestStatus.loading);
    const [data, setData] = useState<any[]>(dummyData);

    const dispatch = useDispatch<AppDispatch>();
    const mode = useSelector(siteDetailsMode);

    const [btnDisabled, setBtnDisabled] = useState(true);
    const [srTimeStamp, setSRTimeStamp] = useState('Sent to SR on June 2nd, 2013');

    const [sortByValue, setSortByValue] = useState<{ [key: string]: any }>({});
    
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchTerm = event.target.value;
      setSearchTerm(searchTerm.trim());
      const filtered = dummyData.filter((form) =>
        Object.entries(form).some(
          ([key, value]) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchTerm.trim().toLowerCase())
        )
      );
      // setData(filtered);
    };

    useEffect(()=> {
        setViewMode(mode);
    }, [mode]);

    const clearSearch = () => {
      setSearchTerm('');
    };

    const handleAddParticipant = () => {

      setData([...data , {
        id:0,
        role: "",
        participantName: "",
        sr: true,
        date: new Date()
      }])

        //alert('handleAddParticipant click');
        
    };

    const handleRemoveParticipant = () => {
        alert('handleRemoveParticipant click');
    };

    const resetDetails = useSelector(resetSiteDetails);  
    useEffect(()=>{

        if(resetDetails)
        {
          setFormData({})
          setData(dummyData);
        }

    },[resetDetails]);

    const handleInputChange = (graphQLPropertyName: any, value: String | [Date, Date]) => {
      if(viewMode === SiteDetailsMode.SRMode)
      {
        console.log({[graphQLPropertyName]:value})
      }
      else
      {
        setFormData((prevData) => ({
          ...prevData,
          [graphQLPropertyName]:value 
      }));
      }
    
      const flattedArr = flattenFormRows(notationFormRowsInternal)
      const currLabel = flattedArr && flattedArr.find(row => row.graphQLPropertyName === graphQLPropertyName);
      const tracker = new ChangeTracker(
        IChangeType.Modified,
        "Notations: " + currLabel?.label ?? ''
      );
      dispatch(trackChanges(tracker.toPlainObject()));
    };

    const handleSortChange = (graphQLPropertyName: any, value: String | [Date, Date] ) => {
      setSortByValue((prevData) => ({
        ...prevData,
        [graphQLPropertyName]:value 
      }));
      sortItems (value, data);
    }

    const sortItems = (sortBy:any, data:any) => {
      let sorted = [...data];
      switch (sortBy) {
        case 'newToOld':
          sorted.sort((a, b) => b.date - a.date); // Sorting by date from new to old
          break;
        case 'oldTonew':
          sorted.sort((a, b) => a.date - b.date); // Sorting by date from new to old
          break;
        // Add more cases for additional sorting options
        default:
          break;
      }
      setData(sorted);
    };

    const handleOnAddNotation = () => {
      alert("Add Notation Click");
      // setViewMode(SiteDetailsMode.SRMode);
    };

    const changeHandler = (event:any) => {

      let existingRecords = [...data];

      let index = existingRecords.findIndex(obj => obj.id === event.row.id);

      
      existingRecords[index][event.property] = event.value;

      setData([...existingRecords]);

      //event
      console.log(event);
    }

    return (
      <>
          <div className="row ">
          { userType === UserType.Internal && (viewMode === SiteDetailsMode.EditMode || viewMode === SiteDetailsMode.SRMode) &&
            <div className="col-lg-6 col-md-12 py-4">
              <button className={`d-flex align-items-center ${viewMode === SiteDetailsMode.EditMode ? `btn-add-notation` : `btn-add-notation-disable`} `} disabled= { viewMode === SiteDetailsMode.SRMode } onClick={handleOnAddNotation}
               aria-label="Add Notation">
                  <Plus className="btn-notation-icon"/>
                  <span>Add Notation</span>
              </button>
            </div>
          }
            <div className={`${userType === UserType.Internal && (viewMode === SiteDetailsMode.EditMode || viewMode === SiteDetailsMode.SRMode) ? `col-lg-6 col-md-12` : `col-lg-12`}`}>
              <div className="row align-items-center justify-content-between p-0">
                <div className={`mb-3 ${userType === UserType.Internal ? (viewMode === SiteDetailsMode.EditMode || viewMode === SiteDetailsMode.SRMode) ? `col` : `col-lg-8 col-md-12` : `col-xxl-8 col-xl-8 col-lg-8 col-md-12 col-sm-12 col-xs-12`}`}>
                  <SearchInput label={'Search'} searchTerm={searchTerm} clearSearch={clearSearch} handleSearchChange={handleSearchChange}/>
                </div>            
                <div className={`${userType === UserType.Internal ? (viewMode === SiteDetailsMode.EditMode || viewMode === SiteDetailsMode.SRMode) ? `col` : `col-lg-4 col-md-12` : `col-xxl-4 col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12`}`}>
                  <Sort formData={sortByValue} editMode={true} handleSortChange={handleSortChange} /> 
                </div>
              </div>
            </div>
          </div>
      
        <PanelWithUpDown 
              firstChild = { 
                  <div className="w-100">
                    <Form formRows = {notationFormRowsFirstChild} formData = {formData} editMode = {viewMode === SiteDetailsMode.EditMode} srMode= { viewMode === SiteDetailsMode.SRMode } handleInputChange={handleInputChange}
                     aria-label="Sort Notation Form"/>
                   { userType === UserType.Internal && <span className="sr-time-stamp">{srTimeStamp}</span> }
                  </div>
                  }
              secondChild = { 
                  <div className="w-100">
                      <Form formRows={ userType === UserType.External ? notationFormRowExternal : notationFormRowsInternal } formData={formData} editMode={viewMode === SiteDetailsMode.EditMode}  srMode= { viewMode === SiteDetailsMode.SRMode } handleInputChange={handleInputChange}
                      aria-label="Sort Notation Form"/>
                      <Widget changeHandler={changeHandler} title={'Notation Participants'} tableColumns={ userType === UserType.Internal ? notationColumnInternal : notationColumnExternal} tableData={data} tableIsLoading={loading} allowRowsSelect={viewMode === SiteDetailsMode.EditMode}
                      aria-label="Notation Widget" hideTable = { false } hideTitle = { false } editMode={ viewMode === SiteDetailsMode.EditMode && userType === UserType.Internal}>
                       { viewMode === SiteDetailsMode.EditMode && userType === UserType.Internal &&
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
                        { viewMode === SiteDetailsMode.SRMode && userType === UserType.Internal &&
                          <button className={`d-flex align-items-center ${!btnDisabled ? `notation-btn` : `notation-btn-disable`}`} disabled={btnDisabled} type="button" onClick={handleRemoveParticipant} aria-label={'Set SR Visibility'} >
                            <span className={`${!btnDisabled ? `notation-btn-lbl` : `notation-btn-lbl-disabled`}`}>{'Set SR Visibility'}</span>
                          </button>
                        }
                      </Widget>
                     { userType === UserType.Internal && <p className="sr-time-stamp">{srTimeStamp}</p>}
                  </div>
                }
          />
      </>
    );
}


export default Notations;