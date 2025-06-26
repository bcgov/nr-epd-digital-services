import { RequestStatus } from '../../helpers/requests/status';

export interface IWidget {
  title?: string;
  tableIsLoading?: RequestStatus;
  tableColumns?: any[];
  tableData?: any[];
  customLabelCss?: string;
  children?: React.ReactNode;
  allowRowsSelect?: boolean;
  hideTable?: boolean;
  hideTitle?: boolean;
  editMode?: boolean;
  isRequired?: boolean;
  srMode?: boolean;
  currentPage?: number;
  primaryKeycolumnName?: string;
  changeHandler?: (event: any) => void;
  handleCheckBoxChange?: (event: any) => void;
  sortHandler?: (row: any, ascSort: boolean) => void;
  showPageOptions?: boolean;
  widgetIschecked?: boolean;
  hideWidgetCheckbox?: boolean;
  customWidgetCss?: string;
  selectPage?: (pageNumber: number) => void;
  changeResultsPerPage?: (pageNumber: number) => void;
  resultsPerPage?: number;
  totalResults?: number;
  filter?: React.ReactNode;
  widgetLabelContainerCss?: string;
}
