import ModalDialog from '@cats/components/modaldialog/ModalDialog';
import { getNoteFormFields } from '../applicationNotesTableConfig';
import { FC } from 'react';
import Form from '@cats/components/form/Form';
import {
  useCreateApplicationNoteMutation,
  useUpdateApplicationNoteMutation,
} from '../Notes.generated';

interface NoteModalProps {
  noteModal: NoteModalState;
  setNoteModal: (noteModal: NoteModalState) => void;
  applicationId: number;
  refetchTableData: () => void;
}

export type NoteModalState = {
  isOpen: boolean;
  mode: 'add' | 'edit';
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

  const handleInputChange = (propetyName: string, value: any) => {
    setNoteModal({
      ...noteModal,
      noteData: {
        ...noteModal.noteData,
        [propetyName]: value,
      },
    });
  };

  const handleCreate = async () => {
    await createApplicationNote({
      variables: {
        applicationId,
        noteDate: noteModal.noteData.noteDate,
        noteText: noteModal.noteData.noteText,
      },
    });
  };

  const loading = createNoteLoading;

  return (
    <>
      {noteModal.isOpen && (
        <ModalDialog
          headerLabel="New Note"
          saveButtonDisabled={loading}
          cancelButtonDisabled={loading}
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
          }}
        >
          <Form
            editMode={true}
            formRows={getNoteFormFields()}
            formData={noteModal.noteData}
            handleInputChange={handleInputChange}
          />
        </ModalDialog>
      )}
    </>
  );
};
