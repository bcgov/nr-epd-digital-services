import { ColumnSize } from '@cats/components/table/TableColumn';
import {
  FormFieldType,
  IFormField,
} from '@cats/components/input-controls/IFormField';
import { TableColumn } from '@cats/components/table/TableColumn';
import { formatDate } from '@cats/helpers/utility';
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
        return value;
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

const noteFormFields: {
  [key: string]: IFormField;
} = {
  noteDate: {
    type: FormFieldType.Date,
    label: 'Date',
    placeholder: 'EE MMM dd yyyy',
    dateFormat: 'EE MMM dd yyyy',
    graphQLPropertyName: 'noteDate',
    colSize: 'col-lg-6 col-md-6 col-sm-12',
    validation: {
      required: true,
      customMessage: 'Date is required.',
    },
  },
  userName: {
    type: FormFieldType.Text,
    label: 'User',
    placeholder: 'User',
    graphQLPropertyName: 'userName',
    colSize: 'col-lg-6 col-md-6 col-sm-12',
    isDisabled: true,
    validation: {
      required: true,
      customMessage: 'User is required.',
    },
  },

  noteText: {
    type: FormFieldType.TextArea,
    label: 'Note',
    placeholder: 'Note',
    graphQLPropertyName: 'noteText',
    validation: {
      required: true,
      customMessage: 'Note is required.',
    },
  },
};

export const getNoteFormFields = (): IFormField[][] => [
  [noteFormFields['noteDate'], noteFormFields['userName']],
  [noteFormFields['noteText']],
];
