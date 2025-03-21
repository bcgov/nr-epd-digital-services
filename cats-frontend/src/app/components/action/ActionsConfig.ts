import { UserMode } from '../../helpers/requests/userMode';
import { DropdownItem } from './IActions';

export const ActionItems: DropdownItem[] = [
  {
    label: 'Edit Mode',
    value: UserMode.EditMode,
  },
  {
    label: 'Delete',
    value: UserMode.DeleteMode,
  },
];
