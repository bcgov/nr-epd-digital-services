import { IFormField } from '../input-controls/IFormField';

export interface ISort {
  editMode: boolean;
  formData: any;
  formRows?: IFormField[][];
  handleSortChange: (
    graphQLPropertyName: any,
    value: string | [Date, Date],
  ) => void;
}
