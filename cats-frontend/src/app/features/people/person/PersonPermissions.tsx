import { IPersonPermission } from './IPersonPermissions';
import {
  RoleWithPermissions,
  ViewPermissions,
} from '../../../../generated/types';
import {
  CheckBoxInput,
  SwitchInput,
} from '../../../components/input-controls/InputControls';
import { FormFieldType } from '../../../components/input-controls/IFormField';

const PersonPermissions: React.FC<IPersonPermission> = ({
  editMode,
  permissions,
  enabledRoles,
  selectedPermissions,
  onSwitchToggle,
  onCheckboxToggle,
}) => {
  return (
    <div>
      {permissions?.map((role: RoleWithPermissions, index) => {
        return (
          <div key={role.roleId} className="row py-2 px-0">
            <SwitchInput
              label={role.roleDescription}
              value={!!enabledRoles[role.roleId]}
              onChange={() => onSwitchToggle(role.roleId)}
              isEditing={editMode || false}
              type={FormFieldType.Switch}
              labelPosition={'right'}
              customLabelCss="custom-people-lbl"
              customEditLabelCss="custom-people-edit-lbl"
              customInputTextCss="custom-people-txt"
            />
            {editMode
              ? enabledRoles[role.roleId] &&
              role.permissions.map((permission: ViewPermissions, index) => (
                <div
                  className="col-lg-4 col-md-6 col-sm-12 px-4"
                  key={permission.id}
                >
                  <CheckBoxInput
                    isLabel={true}
                    label={permission.description}
                    isChecked={selectedPermissions.has(permission.id)}
                    onChange={() => onCheckboxToggle(permission?.id)}
                    type={FormFieldType.Checkbox}
                    isEditing={editMode || false}
                    customLabelCss="custom-people-lbl"
                    customEditLabelCss="custom-people-permission-edit-lbl"
                    wrapperClassName="d-flex gap-2 py-1"
                  />
                </div>
              ))
              : enabledRoles[role.roleId] && (
                <div>
                  <div className="custom-people-lbl">Permissions</div>
                  <div className="d-flex flex-wrap custom-people-txt">
                    {role.permissions
                      .filter((permission: ViewPermissions) =>
                        selectedPermissions.has(permission.id),
                      )
                      .map(
                        (permission: ViewPermissions) =>
                          permission.description,
                      )
                      .join(', ')}
                  </div>
                </div>
              )}
          </div>
        );
      })}
    </div>
  );
};

export default PersonPermissions;
