import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetApplicationNotesByApplicationIdQuery,
  GetApplicationNotesByApplicationIdQuery,
} from './Notes.generated';
import Widget from '@cats/components/widget/Widget';
import { Button } from '@cats/components/button/Button';
import { Plus } from '@cats/components/common/icon';
import { RequestStatus } from '@cats/helpers/requests/status';
import { getApplicationNotesColumns } from './applicationNotesTableConfig';

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
  const { id: applicationId } = useParams();
  const { data, loading } = useGetApplicationNotesByApplicationIdQuery({
    variables: {
      applicationId: parseInt(applicationId ?? '0', 10),
    },
    skip: !applicationId,
  });

  const [selectedRows, setSelectedRows] = useState<Set<Note['id']>>(new Set());

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
      setSelectedRows((prev) => {
        const ids = new Set(prev);
        ids.has(row.id) ? ids.delete(row.id) : ids.add(row.id);
        return ids;
      });
    }
  };

  return (
    <div>
      <Widget
        primaryKeycolumnName="id"
        allowRowsSelect
        tableData={sortedData}
        title={'Notes'}
        tableColumns={getApplicationNotesColumns({
          onEdit: (row) => console.log(row, 'TODO'),
        })}
        tableIsLoading={loading ? RequestStatus.loading : RequestStatus.idle}
        changeHandler={tableChangeHandler}
        sortHandler={tableSortHandler}
      >
        <div className="d-flex gap-2 flex-wrap">
          <Button variant="secondary">
            <Plus />
            New Note
          </Button>
        </div>
      </Widget>
    </div>
  );
};
