import { ReactNode } from 'react';
import { RequestStatus } from '../../helpers/requests/status';

export enum FormFieldType {
  Text = 'text',
  TextArea = 'textarea',
  Search = 'search',
  DropDown = 'dropdown',
  DropDownWithSearch = 'dropdownWithSearch',
  Date = 'date',
  DateRange = 'daterange',
  Group = 'group',
  Label = 'label',
  Link = 'link',
  Checkbox = 'checkbox',
  DeleteIcon = 'deleteIcon',
  IconButton = 'iconbutton',
}

export interface IFormField {
  type:
    | FormFieldType.Text
    | FormFieldType.DropDown
    | FormFieldType.Date
    | FormFieldType.Group
    | FormFieldType.Label
    | FormFieldType.Link
    | FormFieldType.Checkbox
    | FormFieldType.DateRange
    | FormFieldType.TextArea
    | FormFieldType.DropDownWithSearch
    | FormFieldType.DeleteIcon
    | FormFieldType.IconButton
    | FormFieldType.Search;
  label: string;
  isLabel?: boolean;
  placeholder?: string;
  colSize?: string;
  customLabelCss?: string;
  customEditLabelCss?: string;
  customInputTextCss?: string;
  customEditInputTextCss?: string;
  customPlaceholderCss?: string;
  customLeftIconCss?: string;
  customRightIconCss?: string;
  customErrorCss?: string;
  graphQLPropertyName?: string;
  allowNumbersOnly?: boolean;
  options?: { key: string; value: string; imageUrl?: any }[];
  filteredOptions?: { key: string; value: string }[];
  value?: any;
  customLinkValue?: any;
  customIcon?: ReactNode;
  isChecked?: boolean;
  isDateRange?: boolean;
  children?: IFormField[];
  isChildLabel?: boolean;
  isDisabled?: boolean;
  suffix?: string;
  isImage?: boolean;
  isLoading?: RequestStatus;
  customInfoMessage?: ReactNode;
  customMenuMessage?: ReactNode;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customMessage?: string;
  };
  tableMode?: boolean;
  stickyCol?: boolean;
  href?: string;
  textAreaRow?: number;
  textAreaColoum?: number;
  handleSearch?: (event: any) => void;
}
