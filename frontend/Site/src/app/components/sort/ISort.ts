import { Mode } from "fs";
import { UserMode } from "../../helpers/requests/userMode";

export interface ISort {
    editMode: boolean;
    formData: any;
    handleSortChange:  (graphQLPropertyName: any, value: string | [Date, Date]) => void;
}