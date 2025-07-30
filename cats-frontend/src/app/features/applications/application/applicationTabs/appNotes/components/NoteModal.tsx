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

  const handleInputChange = (propertyName: string, value: any) => {
    setNoteModal({
      ...noteModal,
      noteData: {
        ...noteModal.noteData,
        [propertyName]: value,
      },
    });
  };

  const loading = createNoteLoading || updateNoteLoading || deleteNoteLoading;

  const modalHeaderLabel =
    noteModal.mode === 'add'
      ? 'New Note'
      : noteModal.mode === 'edit'
        ? 'Edit Note'
        : 'Delete Note';

  return (
    <>
      {noteModal.isOpen && (
        <ModalDialog
          headerLabel={modalHeaderLabel}
          saveButtonDisabled={loading}
          cancelButtonDisabled={loading}
          saveBtnLabel={noteModal.mode === 'delete' ? 'Confirm' : 'Save Note'}
          validator={() => {
            if (noteModal.mode === 'add') {
              if (
                !noteModal.noteData.noteDate ||
                !noteModal.noteData.noteText
              ) {
                alert('Note date and note text are required');
                return false;
              }
            }
            return true;
          }}
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
