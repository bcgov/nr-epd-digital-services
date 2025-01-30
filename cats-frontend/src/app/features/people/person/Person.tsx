import React, { useEffect, useState } from "react";
import Widget from "../../../components/widget/Widget";
import Form from "../../../components/form/Form";
import PageContainer from "../../../components/simple/PageContainer";
import { addressForm, contactInformationForm, noteColumns } from "./PersonConfig";
import { UserType } from "../../../helpers/requests/userType";
import { UserMode } from "../../../helpers/requests/userMode";
import { Button } from "../../../components/button/Button";
import { AngleLeft, TrashCanIcon, UserPlus } from "../../../components/common/icon";
import './Person.css';
import { v4 } from "uuid";
import { sortArray } from "../../../helpers/utility";
import { RequestStatus } from "../../../helpers/requests/status";
import ModalDialog from "../../../components/modaldialog/ModalDialog";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Actions from "../../../components/action/Actions";
import CustomLabel from "../../../components/simple/CustomLabel";
import { CancelButton, SaveButton } from "../../../components/simple/CustomButtons";
import { ActionItems } from "../../../components/action/ActionsConfig";
import { UserAction } from "../../../helpers/requests/UserAction";
import { usePerson } from "./hooks/usePerson";
import { useCreatePerson } from "./hooks/useCreatePerson";
import { useUpdatePerson } from "./hooks/useUpdatePerson";
import { fetchPerson } from "./services/PersonService";
import LoadingOverlay from "../../../components/loader/LoadingOverlay";


const noteColumnsData = [
    {
      note_date:  new Date(),
      psn_id: '12345',
      displayName:'abc',
      note_text: 'This is a sample description for the note 1.',
      note_id: 'abc123',
    },
    {
      note_date:  new Date(),
      psn_id: '12346',
      displayName:'abc',
      note_text: 'This is a sample description for the note 2.',
      note_id: 'abc124',
    },
    {
      note_date:  new Date(),
      psn_id: '12347',
      displayName:'abc',
      note_text: 'This is a sample description for the note 3.',
      note_id: 'abc125',
    }
];
  
const Person = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromScreen = location.state?.from || ""; // Default to "Unknown Screen" if no state is passed

 
  // Custom hooks for creating/updating person
  //  const { createNewPerson, loading: createLoading, error: createError } = useCreatePerson();
  const { updateExistingPerson, loading: updateLoading, error: updateError } = useUpdatePerson();
 
  const [isVisible, setIsVisible] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [userType, setUserType] = useState<UserType>(UserType.STAFF);
  const [viewMode, setViewMode] = useState(UserMode.Default);
  const [formData, setFormData] = useState<{ [key: string]: any } | null>(null);
  const [noteData, setNoteData] = useState<{ [key: string]: any }[]>(noteColumnsData ?? []);
  const [selectedRows, setSelectedRows] = useState<{noteId: any; psnId: any;}[]>([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState<string | null>(null);

  const onClickBackButton = () => {
    navigate(-1);
  };

  useEffect(()=>{
    if(id)
    {
      const getPersonData = async () => {
        try {
          const personData = await fetchPerson(id);
          setFormData(personData);
        } catch (err) {
          setError('Failed to load person data');
        } finally {
          setLoading(false);
        }
      };
      getPersonData();
    }
    else
    {
      setLoading(false);
      setFormData({})
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 5) {
        // Adjust the scroll position as needed
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleInputChange = (graphQLPropertyName: any, value: String | [Date, Date]) => {
    console.log('graphQLPropertyName -->', graphQLPropertyName, 'value -->', value)
     setFormData({...formData, [graphQLPropertyName]: value})
  };
  
  const handleTableChange = (psnId: any, event: any) => {
      if ( event.property.includes('select_all') ||  event.property.includes('select_row')) {
          let rows = event.property === 'select_row' ? [event.row] : event.value;
          let isTrue = event.property === 'select_row' ? event.value : event.selected;
          if (isTrue) {
            setSelectedRows((prevSelectedRows) => [
              ...prevSelectedRows,
              ...rows.map((row: any) => ({
                  psnId: row.psn_id,
                  noteId: row.note_id,
              })),
            ]);
          } else {
            setSelectedRows((prevSelectedRows) =>
              prevSelectedRows.filter(
                (selectedRow) =>
                  !rows.some(
                    (row: any) =>
                      selectedRow.psnId === row.psn_id &&
                      selectedRow.noteId === row.note_id,
                  ),
              ),
            );
          }
      }
  }

  const handleAddNotes = () =>{
      const newNote = {
        note_date: new Date(),
        psn_id: '12345',
        displayName:'abc',
        note_text: 'This is a sample description for the note.',
        note_id: v4(),
      };
      setNoteData((prevData) => [newNote, ...prevData])
  }

  const handleTableSort = (row: any, ascDir: any) => {
    debugger;
      let property = row['graphQLPropertyName'];
      setNoteData((prevData) => {
        // Create a shallow copy of the previous data
        let updatedNotes = [...prevData];
  
        // Call the common sort function to sort the updatedNotes array
        updatedNotes = sortArray(updatedNotes, property, ascDir);
  
        // Return the sorted array
        return updatedNotes;
      });
  };

  useEffect(() => { console.log('formData -->', formData)}, [formData])

  const handleDeleteNotes = (particIsDelete: boolean = false) => {
      if (particIsDelete) 
      {
          // Filter out participants based on selectedRows for formData
          const filteredNotes = noteData.filter((note: any) => !selectedRows.some((row) => row.noteId === note.note_id && row.psnId === note.psn_id));
          setNoteData(filteredNotes);
          // Clear selectedRows state
          setSelectedRows([]);
          setIsDelete(false);
      } 
      else 
      {
          setIsDelete(true);
      }
  }

  const handleItemClick = async (value: string) => {
      switch (value) {
        case UserMode.EditMode:
          setViewMode(UserMode.EditMode);
          break;
        case UserMode.Default:
          setViewMode(UserMode.Default);
          break;
        case UserAction.SAVE: // Save the changes
          // need to ask Anton how to use generated.ts for graphql type safe.
          if (id) {
            setLoading(updateLoading); // Set loading to true
            // await updateExistingPerson(id, formData).then((response) => { console.log('response -->', response) }).catch((error) => { console.log('error -->', error) });
          } 
          // else {
          //   // If no `id`, create a new person
          //   await createNewPerson(name, age, address);
          // }
          break;
        case UserAction.CANCEL: // Cancel the changes
          setViewMode(UserMode.Default);
          break;
        default:
          break;
      }
  };

  {/* Use the LoadingOverlay component */}
  if (loading)
    return <LoadingOverlay loading={loading} />


  return (
    <>
    <div className={`d-flex justify-content-between align-items-center ${isVisible ? 'custom-person-sticky-header' : 'custom-person-header'} w-100`}>
      <div className="d-flex gap-4 flex-wrap align-items-center">
        <Button variant="secondary" onClick={onClickBackButton}>
          <AngleLeft />
          Back to {fromScreen}
        </Button>
        <div className="d-flex flex-wrap align-items-center pe-3 custom-person-sticky-header-lbl">
        {
          Object.keys(formData ?? {})?.length > 0 
          ?
          isVisible && <div className="d-flex align-items-center">Viewing: <span>{(formData?.firstName ?? '') + ' ' + (formData?.middleName ?? '') + ' ' + (formData?.lastName ?? '')}</span></div>
          :
          <span>Create New Person</span>
        }
        </div>
      </div>
      <div className="d-flex gap-2 justify-align-center pe-2 position-relative">
         {/* For Action Dropdown*/}
         { viewMode === UserMode.Default &&
              userType === UserType.STAFF &&
               (
                <Actions
                  label="Actions"
                  items={ActionItems}
                  onItemClick={handleItemClick}
                />
              )}
            {/* For Edit */}
            <div className="gap-3 align-items-center d-none d-md-flex d-lg-flex d-xl-flex">
              {viewMode === UserMode.EditMode && 
                userType === UserType.STAFF && 
              (
                <>
                  <CustomLabel labelType="c-b" label={`${'Edit Mode'}`}/>
                  <SaveButton clickHandler={() => handleItemClick(UserAction.SAVE)}
                    // isDisabled={savedChanges?.length > 0 ? false : true}
                  />
                  <CancelButton variant="secondary" clickHandler={() => handleItemClick(UserAction.CANCEL)} />
                </>
              )}
            </div>
            {viewMode === UserMode.EditMode && (
              <div className="d-flex d-md-none d-lg-none d-xl-none">
                <Actions
                  label="Actions"
                  items={[
                    {
                      label: UserAction.SAVE,
                      value: UserAction.SAVE,
                    },
                    {
                      label: UserAction.CANCEL,
                      value: UserAction.CANCEL,
                    },
                  ]}
                  onItemClick={handleItemClick}
                />
              </div>
            )}
      </div>
    </div>
      <PageContainer role="Person">
          <div className="custom-person-name">
            { 
              Object.keys(formData ?? {}).length > 0 
              ?
              (formData?.firstName ?? '') + ' ' + (formData?.middleName ?? '') + ' ' + (formData?.lastName ?? '')
              :
              'New Person'
            }
          </div>
          <Widget title={'Contact Information'} hideTable = {true} customWidgetCss="custom-widget">
              <Form editMode={viewMode === UserMode.EditMode} formRows={contactInformationForm} formData={formData ?? {}} handleInputChange={(graphQLPropertyName, value) =>
            handleInputChange(graphQLPropertyName, value)} />
          </Widget>
          <Widget title={'Address'} hideTable = {true} customWidgetCss="custom-widget">
              <Form editMode={viewMode === UserMode.EditMode} formRows={addressForm} formData={formData ?? {}} handleInputChange={(graphQLPropertyName, value) =>
            handleInputChange(graphQLPropertyName, value)} />
          </Widget>
          <Widget  
              currentPage={1} 
              allowRowsSelect={true}
              tableColumns={noteColumns}
              tableData={noteData ?? []} 
              // tableIsLoading={status ?? RequestStatus.idle}
              changeHandler={(event) => handleTableChange(formData?.psn_id, event)} 
              sortHandler={(row, ascDir) => { handleTableSort(row, ascDir)}}
              title={'Notes'} 
              aria-label="Manage Person Widget"
              primaryKeycolumnName="note_id">
              { userType === UserType.STAFF && (
                  <div className="d-flex gap-2 flex-wrap">
                  <Button variant="secondary" onClick={handleAddNotes}>
                      <UserPlus />
                      New Note
                  </Button>
                  <Button
                      variant="secondary"
                      onClick={() => handleDeleteNotes()}
                      disabled={selectedRows.length <= 0}
                  >
                      <TrashCanIcon />
                      Delete Selected
                  </Button>
                  </div>
               )}
          </Widget>
          {isDelete && (
              <ModalDialog
              key={v4()}
              label={`Are you sure you want to delete note(s) ?`}
              closeHandler={(response) => {
                  if (response) {
                  if (isDelete) {
                      handleDeleteNotes(response);
                  }
                  }
                  setIsDelete(false);
              }}
              />
          )}
      </PageContainer>
    </>
  )
}

export default Person;