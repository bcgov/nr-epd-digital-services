import { ColumnSize } from '@cats/components/table/TableColumn';
import { FormFieldType } from '@cats/components/input-controls/IFormField';
import { TableColumn } from '@cats/components/table/TableColumn';
import { formatDateUTC } from '@cats/helpers/utility';
import { PencilIcon } from '@cats/components/common/icon';
import styles from './Notes.module.css';
import type { Note } from './Notes';

export const getApplicationNotesColumns = ({
  onEdit,
}: {
  onEdit: (id: Note) => void;
}): TableColumn[] => [
  {
    id: 1,
    displayName: 'Date',
    active: true,
    graphQLPropertyName: 'noteDate',
    displayType: { type: FormFieldType.Label },
    columnSize: ColumnSize.Small,
    renderCell: (value: Note['noteDate']) => {
      return formatDateUTC(value, 'EEE MMM dd yyyy');
    },
  },
  {
    id: 2,
    displayName: 'User',
    active: true,
    graphQLPropertyName: 'createdBy',
    displayType: { type: FormFieldType.Label },
    renderCell: (_, row: Note) => {
      return row.updatedBy || row.createdBy;
    },
  },
  {
    id: 3,
    displayName: 'Note',
    active: true,
    graphQLPropertyName: 'noteText',
    displayType: { type: FormFieldType.Label },
  },
  {
    id: 4,
    displayName: 'Actions',
    active: true,
    dynamicColumn: true,
    graphQLPropertyName: 'id',
    displayType: { type: FormFieldType.Label },
    columnSize: ColumnSize.XtraSmall,
    renderCell: (_, row: Note) => {
      return (
        <button className={styles.editNoteButton} onClick={() => onEdit(row)}>
          <PencilIcon /> Edit
        </button>
      );
    },
  },
];
