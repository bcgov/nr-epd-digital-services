import { SiteDetailsMode } from "../../features/details/dto/SiteDetailsMode";


export interface DropdownItem {
    label: string;
    value: SiteDetailsMode;
}

export interface IActions {
    label: string;
    items: DropdownItem[];
    onItemClick: (value: string) => void;
}
  