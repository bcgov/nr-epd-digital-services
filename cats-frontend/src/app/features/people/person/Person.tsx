import React, { useCallback, useEffect, useState } from "react";
import Widget from "../../../components/widget/Widget";
import Form from "../../../components/form/Form";
import PageContainer from "../../../components/simple/PageContainer";
import { addressForm, contactInformationForm, noteColumns, noteForm } from "./PersonConfig";
import { UserType } from "../../../helpers/requests/userType";
import { UserMode } from "../../../helpers/requests/userMode";
import { Button } from "../../../components/button/Button";
import { TrashCanIcon, UserPlus } from "../../../components/common/icon";
import './Person.css';
import { v4 } from "uuid";
import { getUser, resultCache, sortArray, updateFields } from "../../../helpers/utility";
import { RequestStatus } from "../../../helpers/requests/status";
import ModalDialog from "../../../components/modaldialog/ModalDialog";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Actions from "../../../components/action/Actions";
import CustomLabel from "../../../components/simple/CustomLabel";
import { CancelButton, SaveButton } from "../../../components/simple/CustomButtons";
import { ActionItems } from "../../../components/action/ActionsConfig";
import { UserAction } from "../../../helpers/requests/UserAction";
import NavigationBar from "../../../components/navigation-bar/NavigationBar";
import { useCreatePerson } from "./hooks/useCreatePerson";
import { useUpdatePerson } from "./hooks/useUpdatePerson";
import { fetchPerson } from "./services/PersonService";
import LoadingOverlay from "../../../components/loader/LoadingOverlay";
import { getAddress } from "../../../helpers/geocoder";


const noteColumnsData = [
    {
      noteDate:  new Date(),
      noteUser: 'abc',
      noteDescription: 'This is a sample description for the note 1.',
      noteId: 'abc123',
    },
    {
      noteDate:  new Date(),
      noteUser: 'abc',
      noteDescription: 'This is a sample description for the note 2.',
      noteId: 'abc124',
    },
    {
      noteDate:  new Date(),
      noteUser: 'abc',
      noteDescription: 'This is a sample description for the note 3.',
      noteId: 'abc125',
    }
];
  
export type NoteTypes = 'Edit Note' | 'New Note' | 'View Note'; 

const Person = () => {

  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromScreen = location.state?.from || ""; // Default to "Unknown Screen" if no state is passed
  const user = getUser();
  const initialNote = {
    noteDate: new Date(),
    noteUser: user?.profile?.name ?? '',
    noteDescription: '',
    noteId: v4(),
  };

  const { createNewPerson, loading: createLoading} = useCreatePerson();
  const { updateExistingPerson, loading: updateLoading} = useUpdatePerson();
  const [personName, setPersonName]= useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [note, setNote] = useState({ isNotesModal: false, noteData: initialNote, noteType: 'View Note' as NoteTypes });
  const [notes, setNotes] = useState<{ [key: string]: any }[]>(noteColumnsData ?? []);
  const [userType, setUserType] = useState<UserType>(UserType.STAFF);
  const [viewMode, setViewMode] = useState(UserMode.Default);
  const [formData, setFormData] = useState<{ [key: string]: any } | null>(null);
  const [selectedRows, setSelectedRows] = useState<{noteId: any;}[]>([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState(addressForm);

  const onClickBackButton = () => {
    navigate(-1);
  };

  const getPersonData = async (id:any) => {
    try {
      const personData = await fetchPerson(id);
      if(personData === null || personData === undefined)
      {
        setError('Person not found');
      }
      else
     {
        setPersonName((personData?.firstName ?? '') + ' ' + (personData?.middleName ?? '') + ' ' + (personData?.lastName ?? ''));
        setFormData(personData);
        setLoading(false);
      }
    } 
    catch (err) 
    {
      setError('Failed to load person data');
    } 
  };
  
  useEffect(()=>{
    if(id)
    {
      getPersonData(id);
    }
    else
    {
      setLoading(false);
      setFormData({})
      setNotes([]);
      setViewMode(UserMode.EditMode);
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


  const fetchAddresses = useCallback(async (searchParam: string) => {
    if (searchParam.trim()) {
      try {
        // Check cache first
        if (resultCache[searchParam]) {
          return resultCache[searchParam];
        }
        const response = await getAddress(searchParam);

        // Store result in cache if successful
        if (response?.features?.length > 0) {
          resultCache[searchParam] = response?.features;
          return response?.features;
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        return [];
      }
    }
    return [];
  }, []);


  const handleInputChange = (graphQLPropertyName: any, value: String | [Date, Date]) => {
    if((graphQLPropertyName === 'addressLine1' || graphQLPropertyName === 'addressLine2') && value.toString().trim().length > 0)
    {
      const indexToUpdate = addrForm.findIndex((row) => row.some((field) => (field.graphQLPropertyName === 'addressLine1' || field.graphQLPropertyName === 'addressLine2')));
      let addr: any = null;
      fetchAddresses(value as string).then((response) => {
        if(response?.length > 0)
        {
          addr = response?.map((feature: any) => {
            return {
              key: feature?.properties?.fullAddress,
              value: feature?.properties?.fullAddress,
            };
          });
        
        }
        else
        {
          addr = null;
        }
        setAddrForm((prev) =>
          updateFields(prev, {
            indexToUpdate,
            updates: {
              isLoading: RequestStatus.success,
              options: addr,
              customInfoMessage: '',
            },
          }),
        );
      }).catch((err) => {
        console.error(`Error: ${err.message}`, err.response?.data);
      });
    }
    setFormData({...formData, [graphQLPropertyName]: value})
  };
  
  const handleNoteChange = (graphQLPropertyName: any, value: String | [Date, Date]) => {
    setNote({...note, noteData: {...note.noteData, [graphQLPropertyName]: value}});
  };

  const handleTableChange = (event: any) => {
    if ( event.property.includes('select_all') ||  event.property.includes('select_row')) 
    {
        let rows = event.property === 'select_row' ? [event.row] : event.value;
        let isTrue = event.property === 'select_row' ? event.value : event.selected;
        if (isTrue)
        {
          setSelectedRows((prevSelectedRows) => [
            ...prevSelectedRows,
            ...rows.map((row: any) => ({noteId: row.noteId})),
          ]);
        } 
        else 
        {
          setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.filter(
              (selectedRow) =>
                !rows.some(
                  (row: any) =>selectedRow.noteId === row.note_id),
            ),
          );
        }
    }
    if (event.property.includes('edit')) 
    {
      setNote({isNotesModal: true, noteData: event.row, noteType: 'Edit Note'});
    }
  }

  const handleAddNotes = () =>{
    setNote({isNotesModal: true, noteData: initialNote, noteType: 'New Note'});
  }

  const handleTableSort = (row: any, ascDir: any) => {
      let property = row['graphQLPropertyName'];
      setNotes((prevData) => {
        // Create a shallow copy of the previous data
        let updatedNotes = [...prevData];
  
        // Call the common sort function to sort the updatedNotes array
        updatedNotes = sortArray(updatedNotes, property, ascDir);
  
        // Return the sorted array
        return updatedNotes;
      });
  };

  const handleDeleteNotes = (particIsDelete: boolean = false) => {
      if (particIsDelete) 
      {
          // Filter out participants based on selectedRows for formData
          const filteredNotes = notes.filter((note: any) => !selectedRows.some((row) => row.noteId === note.noteId));
          setNotes(filteredNotes);
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
          if (id) 
          {
            setLoading(updateLoading); // Set loading to true
            updateExistingPerson([formData]).then((response) => {
              if(response?.success)
              {
                setViewMode(UserMode.Default);
                getPersonData(id);
              }
            })
            .catch((error) => { 
              console.error('Error updating person:', error);
              setError('Failed to update person');
            });
          } 
          else 
          {
            setLoading(createLoading); // Set loading to true
            createNewPerson(formData).then((response) => {
              if(response)
              {
                setViewMode(UserMode.Default);
                navigate(-1);
              }
            })
            .catch((error) => { 
              console.error('Error Create person:', error);
              setError('Failed to update person');
            });
          }
          break;
        case UserAction.CANCEL: // Cancel the changes
          if (id) 
          {
            setViewMode(UserMode.Default);
          } 
          else 
          {
            setFormData(null);
            setNotes([]);
            navigate(-1);
          }
          break;
        default:
          break;
      }
  };

  {/* Use the LoadingOverlay component */}
  if (loading && !!id) {
    return <LoadingOverlay loading={loading}  />
  }

    const navigationBarChildern = <>
        { viewMode === UserMode.Default &&
          userType === UserType.STAFF &&
           (
            <Actions
              label="Actions"
              items={ActionItems}
              onItemClick={handleItemClick}
            />
          )
        }
        <div className="gap-3 align-items-center d-none d-md-flex d-lg-flex d-xl-flex">
          {viewMode === UserMode.EditMode && 
            userType === UserType.STAFF && 
          (
            <>
              <CustomLabel labelType="c-b" label={`${'Edit Mode'}`}/>
              <SaveButton clickHandler={() => handleItemClick(UserAction.SAVE)}/>
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
    </>

    const navigationBarText = <>
      {  
        personName?.length > 0
        ?
        isVisible && <div className="d-flex align-items-center">Viewing: <span>{personName}</span></div>
        :
        <span>Create New Person</span>
      }
    </>
    
    return (
      <>
        <NavigationBar 
          isVisible={isVisible} 
          onClickBackButton = {onClickBackButton}
          backButtonProps={ { variant:"secondary"} } 
          backButtonText={`Back to ${fromScreen}`}
          navigationBarText={navigationBarText}
          childern={navigationBarChildern}
        />
        <PageContainer role="Person">
            <div className="custom-person-name">
              {(!isVisible && (personName.length > 0 ? personName : 'New Person')) || ''}
            </div>
            <Widget title={'Contact Information'} hideTable = {true} customWidgetCss="custom-widget">
              <Form editMode={viewMode === UserMode.EditMode} formRows={contactInformationForm} formData={formData ?? {}} handleInputChange={(graphQLPropertyName, value) =>
            handleInputChange(graphQLPropertyName, value)} />
          </Widget>
          <Widget title={'Address'} hideTable = {true} customWidgetCss="custom-widget">
              <Form editMode={viewMode === UserMode.EditMode} formRows={addrForm} formData={formData ?? {}} handleInputChange={(graphQLPropertyName, value) =>
            handleInputChange(graphQLPropertyName, value)} />
          </Widget>
          <Widget  
              currentPage={1} 
              allowRowsSelect={true}
              tableColumns={noteColumns}
              tableData={notes ?? []} 
              // tableIsLoading={status ?? RequestStatus.idle}
              changeHandler={handleTableChange} 
              sortHandler={(row, ascDir) => { handleTableSort(row, ascDir)}}
              title={'Notes'} 
              aria-label="Manage Person Widget"
              primaryKeycolumnName="noteId">
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
          {note?.isNotesModal && (
              <ModalDialog
                headerLabel={note?.noteType}
                saveButtonDisabled={note?.noteData?.noteDescription?.length <= 0}
                closeHandler={(response) => {
                    if (response) {
                      if(note.noteType === 'New Note')
                      {
                        setNotes((prev) => [...prev, note.noteData]);
                      }
                      if(note.noteType === 'Edit Note')
                      {
                        setNotes((prev) => prev.map((item) => {
                          if(item.noteId === note?.noteData?.noteId)
                          {
                            return note.noteData;
                          }
                          return item;
                        }));
                      }
                    }
                    setNote({isNotesModal: false, noteData: initialNote, noteType:'View Note'}); // Reset the note state
                }}
              >
                <Form editMode={true} formRows={noteForm} formData={note?.noteData ?? {}} handleInputChange={(graphQLPropertyName, value) => handleNoteChange(graphQLPropertyName, value)} />
              </ModalDialog>
          )}
        </PageContainer>
      </>
    )
}

export default Person;