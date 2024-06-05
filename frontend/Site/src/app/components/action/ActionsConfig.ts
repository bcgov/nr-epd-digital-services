import { UserMode } from "../../helpers/requests/userMode";
import { DropdownItem } from "./IActions";

export const ActionItems: DropdownItem[] = [
    {
        label:'Edit Mode',
        value: UserMode.EditMode
    },
    {
        label:'SR Mode',
        value: UserMode.SrMode
    },
    {
        label:'Delete',
        value: UserMode.DeleteMode
    },
]