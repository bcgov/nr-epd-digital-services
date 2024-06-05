import { RequestStatus } from "../../helpers/requests/status";

export interface IWidget {
    title?: string;
    tableIsLoading: RequestStatus;
    tableColumns: any[];
    tableData: any[];
    customLabelCss?: string;
    children?: React.ReactNode;
    allowRowsSelect?:boolean;
    hideTable?:boolean;
    hideTitle?:boolean;
    editMode?:boolean;
    changeHandler:(event:any)=>void;
}