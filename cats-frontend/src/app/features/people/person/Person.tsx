import { useCallback, useEffect, useState } from 'react';
import Widget from '../../../components/widget/Widget';
import Form from '../../../components/form/Form';
import PageContainer from '../../../components/simple/PageContainer';
import {
  addressForm,
  contactInformationForm,
  noteColumns,
  noteForm,
} from './PersonConfig';
import { UserType } from '../../../helpers/requests/userType';
import { UserMode } from '../../../helpers/requests/userMode';
import { Button } from '../../../components/button/Button';
import { TrashCanIcon, UserPlus } from '../../../components/common/icon';
import './Person.css';
import { v4 } from 'uuid';
import {
  getUser,
  resultCache,
  sortArray,
  updateFields,
} from '../../../helpers/utility';
import { RequestStatus } from '../../../helpers/requests/status';
import ModalDialog from '../../../components/modaldialog/ModalDialog';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Actions from '../../../components/action/Actions';
import CustomLabel from '../../../components/simple/CustomLabel';
import {
  CancelButton,
  SaveButton,
} from '../../../components/simple/CustomButtons';
import { ActionItems } from '../../../components/action/ActionsConfig';
import { UserAction } from '../../../helpers/requests/UserAction';
import NavigationBar from '../../../components/navigation-bar/NavigationBar';
import { useCreatePerson } from './hooks/useCreatePerson';
import { useUpdatePerson } from './hooks/useUpdatePerson';
import { fetchPerson } from './services/PersonService';
import LoadingOverlay from '../../../components/loader/LoadingOverlay';
import { getAddress } from '../../../helpers/geocoder';
import { useFetchNotes } from './hooks/useFetchNotes';
import { useUpdateNote } from './hooks/useUpdateNotes';
import { useCreateNote } from './hooks/useCreateNote';
import { useDeleteNote } from './hooks/useDeleteNote';
import PersonPermissions from './PersonPermissions';
import { useGetPermissionsQuery } from './graphql/PersonPermissions.generated';

export type NoteTypes = 'Edit Note' | 'New Note' | 'View Note';

const Person = () => {
  const user = getUser();
  const initialNote = {
    noteDescription: '',
    id: '',
    date: new Date(),
    user: user?.profile?.given_name,
  };
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromScreen = location.state?.from || ''; // Default to "Unknown Screen" if no state is passed
  const {
    notes: notesData,
    loading: notesLoading,
    error: notesError,
  } = useFetchNotes(id ?? '');
  const { updateExistingNote } = useUpdateNote();
  const { createNewNote } = useCreateNote();
  const { deleteExistingNote } = useDeleteNote();
  const { createNewPerson, loading: createLoading } = useCreatePerson();
  const { updateExistingPerson, loading: updateLoading } = useUpdatePerson();
  const [personName, setPersonName] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isDeleteNote, setIsDeleteNote] = useState(false);
  const [isDeletePerson, setIsDeletePerson] = useState(false);
  const [note, setNote] = useState({
    isNotesModal: false,
    noteData: initialNote,
    noteType: 'View Note' as NoteTypes,
  });
  const [notes, setNotes] = useState<{ [key: string]: any }[]>([]);
  const [userType, setUserType] = useState<UserType>(UserType.STAFF);
  const [viewMode, setViewMode] = useState(UserMode.Default);
  const [formData, setFormData] = useState<{ [key: string]: any } | null>(null);
  const [selectedRows, setSelectedRows] = useState<{ id: any }[]>([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState(addressForm);

  const { data } = useGetPermissionsQuery();
  const [enabledRoles, setEnabledRoles] = useState<Record<number, boolean>>({});
  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(
    new Set(),
  );

  const onClickBackButton = () => {
    navigate(-1);
  };

  const getPersonData = async (id: any) => {
    try {
      const personData = await fetchPerson(id);
      if (personData === null || personData === undefined) {
        setError('Person not found');
      } else {
        setPersonName(
          (personData?.firstName ?? '') +
            ' ' +
            (personData?.middleName ?? '') +
            ' ' +
            (personData?.lastName ?? ''),
        );
        setFormData(personData);
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to load person data');
    }
  };

  const updatePerson = async (person: any) => {
    try {
      const response = await updateExistingPerson([person]);
      return response?.success; // Return the success value
    } catch (error) {
      console.error('Error updating person:', error);
      setError('Failed to update person');
      return false; // Or you can return a default value indicating failure
    }
  };

  const deleteNotes = async (notes: any) => {
    try {
      const response = await deleteExistingNote(notes);
      return response?.success;
    } catch (error) {
      console.error('Error delete note:', error);
      setError('Failed to delete note');
      return false;
    }
  };

  useEffect(() => {
    if (notesData && notesData?.length > 0) {
      setNotes(notesData);
    }
    if (notesError && notesError?.trim().length > 0) {
      setError(notesError);
    }
  }, [notesLoading, notesError]);

  useEffect(() => {
    if (id) {
      getPersonData(id);
    } else {
      setLoading(false);
      setFormData({});
      setNotes([]);
      setViewMode(UserMode.EditMode);
    }
  }, []);

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

  const handleInputChange = (
    graphQLPropertyName: any,
    value: String | [Date, Date],
  ) => {
    if (
      (graphQLPropertyName === 'address_1' ||
        graphQLPropertyName === 'address_2') &&
      value.toString().trim().length > 0
    ) {
      const indexToUpdate = addrForm.findIndex((row) =>
        row.some((field) => field.graphQLPropertyName === graphQLPropertyName),
      );
      let addr: any = null;
      fetchAddresses(value as string)
        .then((response) => {
          if (response?.length > 0) {
            addr = response?.map((feature: any) => {
              return {
                key: feature?.properties?.fullAddress,
                value: feature?.properties?.fullAddress,
              };
            });
          } else {
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
        })
        .catch((err) => {
          console.error(`Error: ${err.message}`, err.response?.data);
        });
    }
    setFormData({ ...formData, [graphQLPropertyName]: value });
  };

  const handleNoteChange = (
    graphQLPropertyName: any,
    value: String | [Date, Date],
  ) => {
    setNote({
      ...note,
      noteData: { ...note.noteData, [graphQLPropertyName]: value },
    });
  };

  const handleTableChange = (event: any) => {
    if (
      event.property.includes('select_all') ||
      event.property.includes('select_row')
    ) {
      let rows = event.property === 'select_row' ? [event.row] : event.value;
      let isTrue =
        event.property === 'select_row' ? event.value : event.selected;
      if (isTrue) {
        setSelectedRows((prevSelectedRows) => [
          ...prevSelectedRows,
          ...rows.map((row: any) => ({ id: row.id })),
        ]);
      } else {
        setSelectedRows((prevSelectedRows) =>
          prevSelectedRows.filter(
            (selectedRow) =>
              !rows.some((row: any) => selectedRow.id === row.id),
          ),
        );
      }
    }
    if (event.property.includes('edit')) {
      setNote({
        isNotesModal: true,
        noteData: event.row,
        noteType: 'Edit Note',
      });
    }
  };

  const handleAddNotes = () => {
    setNote({
      isNotesModal: true,
      noteData: initialNote,
      noteType: 'New Note',
    });
  };

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

  const handleDeleteNotes = async (particIsDelete: boolean = false) => {
    if (particIsDelete) {
      const result = await deleteNotes(selectedRows);
      if (result) {
        // Filter out notes based on selectedRows for formData
        const filteredNotes = notes.filter(
          (note: any) => !selectedRows.some((row) => row.id === note.id),
        );
        setNotes(filteredNotes);
        setSelectedRows([]);
        setIsDeleteNote(false);
      } else {
        setError('Failed to delete note!!');
      }
    } else {
      setIsDeleteNote(true);
    }
  };

  const handleItemClick = async (value: string) => {
    switch (value) {
      case UserMode.EditMode:
        setViewMode(UserMode.EditMode);
        break;
      case UserMode.Default:
        setViewMode(UserMode.Default);
        break;
      case UserAction.SAVE: // Save the changes
        if (id) {
          setLoading(updateLoading); // Set loading to true
          const result = await updatePerson(formData);
          if (result) {
            setViewMode(UserMode.Default);
            getPersonData(id);
          }
        } else {
          setLoading(createLoading); // Set loading to true
          createNewPerson(formData)
            .then((response) => {
              if (response) {
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
        if (id) {
          setViewMode(UserMode.Default);
        } else {
          setFormData(null);
          setNotes([]);
          navigate(-1);
        }
        break;
      case UserAction.DELETE:
        setIsDeletePerson(true);
      default:
        break;
    }
  };

  const navigationBarChildern = (
    <>
      {viewMode === UserMode.Default && userType === UserType.STAFF && (
        <Actions
          label="Actions"
          items={ActionItems}
          onItemClick={handleItemClick}
        />
      )}
      <div className="gap-3 align-items-center d-none d-md-flex d-lg-flex d-xl-flex">
        {viewMode === UserMode.EditMode && userType === UserType.STAFF && (
          <>
            {id && <CustomLabel labelType="c-b" label={`${'Edit Mode'}`} />}
            <SaveButton clickHandler={() => handleItemClick(UserAction.SAVE)} />
            <CancelButton
              variant="secondary"
              clickHandler={() => handleItemClick(UserAction.CANCEL)}
            />
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
  );

  const navigationBarText = (
    <>
      {personName?.length > 0 ? (
        isVisible && (
          <div className="d-flex align-items-center">
            Viewing: <span>{personName}</span>
          </div>
        )
      ) : (
        <span>Create New Person</span>
      )}
    </>
  );

  useEffect(() => {
    // Only run once when formData is initially populated
    if (
      formData?.permissionIds &&
      data?.getPermissions?.data &&
      selectedPermissions.size === 0
    ) {
      const personPermissions: number[] = formData?.permissionIds;

      setSelectedPermissions(new Set(personPermissions));

      const rolesMap: Record<number, boolean> = {};

      data?.getPermissions?.data.forEach((role: any) => {
        role.permissions.forEach((perm: any) => {
          if (personPermissions.includes(perm.id)) {
            rolesMap[role.roleId] = true;
          }
        });
      });

      setEnabledRoles(rolesMap);
    }
  }, [data?.getPermissions?.data]);

  const handleSwitchToggle = (roleId: number) => {
    setEnabledRoles((prev) => {
      const isCurrentlyEnabled = prev[roleId];
      const newEnabledRoles = {
        ...prev,
        [roleId]: !isCurrentlyEnabled,
      };
      // If turning OFF the role switch, remove its permission IDs
      if (isCurrentlyEnabled) {
        const rolePermissions =
          data?.getPermissions?.data?.find((r) => r.roleId === roleId)
            ?.permissions || [];
        const permissionIdsToRemove = rolePermissions.map((p) => p.id);
        setSelectedPermissions((prev) => {
          const updated = new Set(prev);
          permissionIdsToRemove.forEach((id) => updated.delete(id));
          // Also update formData
          setFormData((prevData) => ({
            ...prevData,
            permissionIds: Array.from(updated),
          }));
          return updated;
        });
      }
      return newEnabledRoles;
    });
  };

  const handleCheckboxToggle = (permissionId: number) => {
    setSelectedPermissions((prev) => {
      const updated = new Set(prev);
      updated.has(permissionId)
        ? updated.delete(permissionId)
        : updated.add(permissionId);
      // Sync to formData here
      const updatedArray = Array.from(updated);
      setFormData((prevData) => ({
        ...prevData,
        permissionIds: updatedArray,
      }));
      return updated;
    });
  };

  if (loading && !!id) {
    return <LoadingOverlay loading={loading} />;
  }

  return (
    <>
      <NavigationBar
        isVisible={isVisible}
        onClickBackButton={onClickBackButton}
        backButtonProps={{ variant: 'secondary' }}
        backButtonText={`Back to ${fromScreen}`}
        navigationBarText={navigationBarText}
        childern={navigationBarChildern}
      />
      <PageContainer role="Person">
        {/* Person Name */}
        <div className="custom-person-name">
          {(!isVisible &&
            (personName.length > 0 ? personName : 'New Person')) ||
            ''}
        </div>

        {/* Account Permissions */}
        <Widget title={'Account Permissions'} hideTable={true}>
          <PersonPermissions
            editMode={viewMode === UserMode.EditMode}
            permissions={data?.getPermissions?.data ?? []}
            enabledRoles={enabledRoles}
            selectedPermissions={selectedPermissions}
            onSwitchToggle={handleSwitchToggle}
            onCheckboxToggle={handleCheckboxToggle}
          />
        </Widget>

        {/* Contact Information */}
        <Widget title={'Contact Information'} hideTable={true}>
          <Form
            editMode={viewMode === UserMode.EditMode}
            formRows={contactInformationForm}
            formData={formData ?? {}}
            handleInputChange={(graphQLPropertyName, value) =>
              handleInputChange(graphQLPropertyName, value)
            }
          />
        </Widget>

        {/* Address */}
        <Widget title={'Address'} hideTable={true}>
          <Form
            editMode={viewMode === UserMode.EditMode}
            formRows={addrForm}
            formData={formData ?? {}}
            handleInputChange={(graphQLPropertyName, value) =>
              handleInputChange(graphQLPropertyName, value)
            }
          />
        </Widget>
        {id && (
          // Notes
          <Widget
            currentPage={1}
            allowRowsSelect={true}
            tableColumns={noteColumns}
            tableData={notes ?? []}
            changeHandler={handleTableChange}
            sortHandler={(row, ascDir) => {
              handleTableSort(row, ascDir);
            }}
            title={'Notes'}
            aria-label="Manage Person Widget"
            primaryKeycolumnName="id"
          >
            {userType === UserType.STAFF && (
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
        )}
        {(isDeleteNote || isDeletePerson) && (
          // Delete Modal
          <ModalDialog
            key={v4()}
            label={`Are you sure you want to delete ${isDeleteNote ? 'note(s)' : 'person'}  ?`}
            saveBtnLabel={isDeleteNote ? 'Delete Notes' : 'Delete Person'}
            closeHandler={async (response) => {
              if (response) {
                if (isDeleteNote) {
                  handleDeleteNotes(response);
                }
                if (isDeletePerson) {
                  const deletePerson = await updatePerson({
                    ...formData,
                    isDeleted: true,
                  });
                  if (deletePerson) {
                    const noteIds = notes?.map((note) => ({ id: note.id }));
                    const result = await deleteNotes(noteIds);
                    if (result) {
                      setViewMode(UserMode.Default);
                      navigate('/people');
                    } else {
                      await updatePerson({ ...formData, isDeleted: false });
                    }
                  }
                }
              }
              setIsDeleteNote(false);
              setIsDeletePerson(false);
            }}
          />
        )}
        {note?.isNotesModal && (
          // Note Modal
          <ModalDialog
            headerLabel={note?.noteType}
            saveButtonDisabled={note?.noteData?.noteDescription?.length <= 0}
            saveBtnLabel="Save Note"
            closeHandler={(response) => {
              if (response) {
                if (note.noteType === 'New Note') {
                  if (id) {
                    const newNote = {
                      personId: parseFloat(id),
                      noteDescription: note?.noteData?.noteDescription,
                    };
                    createNewNote(newNote)
                      .then((response) => {
                        if (response?.success) {
                          setNotes((prev) => [...prev, response.data[0]]);
                        } else {
                          setError('Failed to create new note!!');
                        }
                      })
                      .catch((err) => {
                        console.error('Error create note:', err);
                        setError('Failed to create note');
                      });
                  }
                }
                if (note.noteType === 'Edit Note') {
                  const { id: noteId, noteDescription } = note.noteData;
                  updateExistingNote(noteId, { noteDescription })
                    .then((response) => {
                      if (response?.success) {
                        const result = response?.data[0];
                        setNotes((prev) =>
                          prev.map((item) => {
                            if (item.id === result?.id) {
                              return result;
                            }
                            return item;
                          }),
                        );
                      } else {
                        setError('Failed to update exsitig note!!');
                      }
                    })
                    .catch((err) => {
                      console.error('Error update note:', err);
                      setError('Failed to update note');
                    });
                }
              }
              setNote({
                isNotesModal: false,
                noteData: initialNote,
                noteType: 'View Note',
              }); // Reset the note state
            }}
          >
            {/* Note Form */}
            <Form
              editMode={true}
              formRows={noteForm}
              formData={note?.noteData ?? {}}
              handleInputChange={(graphQLPropertyName, value) =>
                handleNoteChange(graphQLPropertyName, value)
              }
            />
          </ModalDialog>
        )}
      </PageContainer>
    </>
  );
};

export default Person;
