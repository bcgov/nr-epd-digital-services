import ModalDialog from '@cats/components/modaldialog/ModalDialog';
import { getNoteFormFields } from '../applicationNotesTableConfig';
import { FC } from 'react';
import Form from '@cats/components/form/Form';
import {
  useCreateApplicationNoteMutation,
  useDeleteApplicationNotesMutation,
  useUpdateApplicationNoteMutation,
} from '../Notes.generated';
import { Note } from '../Notes';

interface NoteModalProps {
  noteModal: NoteModalState;
  setNoteModal: (noteModal: NoteModalState) => void;
  applicationId: number;
  refetchTableData: () => void;
  selectedNoteIds: Set<Note['id']>;
}

export type NoteModalState = {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'delete';
  noteData: {
    noteDate: string;
    noteText: string;
    userName: string;
    noteId?: number;
  };
};

export const initialNoteModalState = (): NoteModalState => ({
  isOpen: false,
  mode: 'add',
  noteData: {
    noteDate: '',
    noteText: '',
    userName: '',
  },
});

export const NoteModal: FC<NoteModalProps> = ({
  noteModal,
  setNoteModal,
  applicationId,
  refetchTableData,
  selectedNoteIds,
}) => {
  const [createApplicationNote, { loading: createNoteLoading }] =
    useCreateApplicationNoteMutation({
      onCompleted: () => {
        refetchTableData();
        setNoteModal(initialNoteModalState());
      },
    });

  const [updateApplicationNote, { loading: updateNoteLoading }] =
    useUpdateApplicationNoteMutation({
      onCompleted: () => {
        refetchTableData();
        setNoteModal(initialNoteModalState());
      },
    });

  const [deleteApplicationNotes, { loading: deleteNoteLoading }] =
    useDeleteApplicationNotesMutation({
      onCompleted: () => {
        refetchTableData();
        setNoteModal(initialNoteModalState());
      },
    });

  const handleInputChange = (propetyName: string, value: any) => {
    setNoteModal({
      ...noteModal,
      noteData: {
        ...noteModal.noteData,
        [propetyName]: value,
      },
    });
  };

  const loading = createNoteLoading || updateNoteLoading || deleteNoteLoading;

  return (
    <>
      {noteModal.isOpen && (
        <ModalDialog
          headerLabel="New Note"
          saveButtonDisabled={loading}
          cancelButtonDisabled={loading}
          saveBtnLabel={noteModal.mode === 'delete' ? 'Confirm' : 'Save Note'}
          closeHandler={(saved) => {
            if (!saved) {
              setNoteModal(initialNoteModalState());
              return;
            }

            if (noteModal.mode === 'add') {
              createApplicationNote({
                variables: {
                  applicationId,
                  noteDate: noteModal.noteData.noteDate,
                  noteText: noteModal.noteData.noteText,
                },
              });
            }

            if (noteModal.mode === 'edit' && noteModal.noteData.noteId) {
              updateApplicationNote({
                variables: {
                  noteId: noteModal.noteData.noteId,
                  noteDate: noteModal.noteData.noteDate,
                  noteText: noteModal.noteData.noteText,
                },
              });
            }

            if (noteModal.mode === 'delete') {
              deleteApplicationNotes({
                variables: { noteIds: Array.from(selectedNoteIds) },
              });
            }
          }}
        >
          {noteModal.mode === 'delete' ? (
            <div>Are you sure you want to delete the selected notes?</div>
          ) : (
            <Form
              editMode={true}
              formRows={getNoteFormFields()}
              formData={noteModal.noteData}
              handleInputChange={handleInputChange}
            />
          )}
        </ModalDialog>
      )}
    </>
  );
};
