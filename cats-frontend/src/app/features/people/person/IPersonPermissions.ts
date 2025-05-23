import { RoleWithPermissions } from "../../../../generated/types";

export interface IPersonPermission {
    editMode?: boolean;
    permissions: RoleWithPermissions[];
    enabledRoles: Record<number, boolean>;
    selectedPermissions: Set<number>;
    onSwitchToggle: (role: number) => void;
    onCheckboxToggle: (permissionId: number) => void;
}
