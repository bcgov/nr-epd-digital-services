import { UserMode } from "../../helpers/requests/userMode";

export interface DropdownItem {
    label: string;
    value: UserMode;
}

export interface IActions {
    label: string;
    items: DropdownItem[];
    onItemClick: (value: string) => void;
}
  