import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetApplicationNotesByApplicationIdQuery,
  GetApplicationNotesByApplicationIdQuery,
} from './Notes.generated';
import Widget from '@cats/components/widget/Widget';
import { Button } from '@cats/components/button/Button';
import { Plus, TrashCanIcon } from '@cats/components/common/icon';
import { RequestStatus } from '@cats/helpers/requests/status';
import { getApplicationNotesColumns } from './applicationNotesTableConfig';
import { useAuth } from 'react-oidc-context';
import {
  NoteModal,
  initialNoteModalState,
  NoteModalState,
} from './components/NoteModal';
export type Note =
  GetApplicationNotesByApplicationIdQuery['getApplicationNotesByApplicationId']['data'][number];

type SortColumn = {
  column: ReturnType<
    typeof getApplicationNotesColumns
  >[number]['graphQLPropertyName'];
  direction: 'asc' | 'desc';
};

const sortNotes = (data: Note[], sortColumn: SortColumn | null) => {
  if (!sortColumn) return data;

  return data.toSorted((a, b) => {
    if (sortColumn.column === 'noteDate') {
      return sortColumn.direction === 'asc'
        ? new Date(a.noteDate).getTime() - new Date(b.noteDate).getTime()
        : new Date(b.noteDate).getTime() - new Date(a.noteDate).getTime();
    }
    if (sortColumn.column === 'createdBy') {
      const aDisplayName = a.updatedBy || a.createdBy;
      const bDisplayName = b.updatedBy || b.createdBy;
      return sortColumn.direction === 'asc'
        ? aDisplayName.localeCompare(bDisplayName)
        : bDisplayName.localeCompare(aDisplayName);
    }
    if (sortColumn.column === 'noteText') {
      return sortColumn.direction === 'asc'
        ? a.noteText.localeCompare(b.noteText)
        : b.noteText.localeCompare(a.noteText);
    }
    return 0;
  });
};

export const Notes = () => {
  const auth = useAuth();
  const { id: applicationId } = useParams();
  const { data, loading, refetch } = useGetApplicationNotesByApplicationIdQuery(
    {
      variables: {
        applicationId: parseInt(applicationId ?? '0', 10),
      },
      skip: !applicationId,
    },
  );

  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<Note['id']>>(
    new Set(),
  );
  const [noteModal, setNoteModal] = useState<NoteModalState>(
    initialNoteModalState(),
  );
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const tableSortHandler = (
    column: ReturnType<typeof getApplicationNotesColumns>[number],
    ascSort: boolean,
  ) => {
    setSortColumn({
      column: column.graphQLPropertyName,
      direction: ascSort ? 'asc' : 'desc',
    });
  };

  const sortedData = sortNotes(
    data?.getApplicationNotesByApplicationId.data || [],
    sortColumn,
  );

  const tableChangeHandler = (event: any) => {
    if (event.property === 'select_row') {
      const row = event.row as Note;
      setSelectedNoteIds((prev) => {
        const ids = new Set(prev);
        ids.has(row.id) ? ids.delete(row.id) : ids.add(row.id);
        return ids;
      });
    }
  };

  if (!applicationId) {
    return null;
  }

  return (
    <div>
      <Widget
        primaryKeycolumnName="id"
        allowRowsSelect
        tableData={sortedData}
        title={'Notes'}
        tableColumns={getApplicationNotesColumns({
          onEdit: (row) =>
            setNoteModal({
              isOpen: true,
              mode: 'edit',
              noteData: {
                noteDate: row.noteDate,
                noteText: row.noteText,
                userName: row.updatedBy || row.createdBy,
                noteId: row.id,
              },
            }),
        })}
        tableIsLoading={loading ? RequestStatus.loading : RequestStatus.idle}
        changeHandler={tableChangeHandler}
        sortHandler={tableSortHandler}
      >
        <div className="d-flex gap-2 flex-wrap">
          <Button
            variant="secondary"
            onClick={() => {
              const initialState = initialNoteModalState();
              setNoteModal({
                ...initialState,
                isOpen: true,
                noteData: {
                  ...initialState.noteData,
                  userName: auth.user?.profile.name ?? '',
                },
              });
            }}
          >
            <Plus />
            New Note
          </Button>
          <Button
            variant="secondary"
            disabled={selectedNoteIds.size === 0}
            onClick={() => {
              setNoteModal((prev) => ({
                ...prev,
                isOpen: true,
                mode: 'delete',
              }));
            }}
          >
            <TrashCanIcon />
            Delete Selected
          </Button>
        </div>
      </Widget>

      <NoteModal
        applicationId={parseInt(applicationId, 10)}
        noteModal={noteModal}
        setNoteModal={setNoteModal}
        refetchTableData={refetch}
        selectedNoteIds={selectedNoteIds}
      />
    </div>
  );
};
