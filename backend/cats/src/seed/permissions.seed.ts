import { EntityManager } from 'typeorm';
import { ParticipantRole } from '../app/entities/participantRole.entity';
import { Permissions } from '../app/entities/permissions.entity';
import {
  CASEWORKER_PERMISSIONS,
  COMMON_PERMISSIONS,
  MENTOR_PERMISSIONS,
  SDM_PERMISSIONS,
} from './permissions';
import { ApplicationServiceType } from '../app/entities/applicationServiceType.entity';
import { PermissionServiceType } from '../app/entities/permissionServiceType';
import { StaffRoles } from '../app/services/assignment/staffRoles.enum';

export const PermissionsSeeder = async (manager: EntityManager) => {
  console.log('PermissionsSeeder start');
  try {
    const roles = await manager.find(ParticipantRole, {
      where: { roleType: 'STAFF' },
    });

    if (!roles.length) {
      console.log('No STAFF roles found. Skipping PermissionsSeeder.');
      return;
    }

    const getPermissionsForRole = (abbrev: string): any[] => {
      switch (abbrev) {
        case StaffRoles.CASE_WORKER:
          return [...COMMON_PERMISSIONS, ...CASEWORKER_PERMISSIONS];
        case StaffRoles.SDM:
          return [...COMMON_PERMISSIONS, ...SDM_PERMISSIONS];
        case StaffRoles.MENTOR:
          return [...COMMON_PERMISSIONS, ...MENTOR_PERMISSIONS];
        default:
          return [];
      }
    };

    for (const role of roles) {
      const permissions = getPermissionsForRole(role.abbrev);

      // Fetch existing permission descriptions for this role
      const existingPermissions = await manager.find(Permissions, {
        where: { roleId: role.id },
        select: ['description'],
      });
      const existingDescriptions = new Set(
        existingPermissions.map((p) => p.description),
      );

      // Filter out permissions that already exist
      const newPermissions = permissions.filter(
        (perm) => !existingDescriptions.has(perm.description),
      );

      for (const perm of newPermissions) {
        const permission = new Permissions();
        permission.roleId = role.id;
        permission.description = perm.description;
        permission.createdBy = 'sysadmin';
        permission.createdDatetime = new Date();
        permission.updatedBy = 'sysadmin';
        permission.updatedDatetime = new Date();
        await manager.save(Permissions, permission);
        console.log('permission created', permission.description);
      }

      const allPermissionsForRole = await manager.find(Permissions, {
        where: { roleId: role.id },
      });

      for (const permission of allPermissionsForRole) {
        const permissionDef = permissions.find(
          (p) => p.description === permission.description,
        );

        if (
          permissionDef?.serviceTypesDetails &&
          permissionDef.serviceTypesDetails.length > 0
        ) {
          for (const serviceTypeDetail of permissionDef.serviceTypesDetails) {
            const serviceTypeItem = await manager.findOne(
              ApplicationServiceType,
              {
                where: {
                  serviceName: serviceTypeDetail.applicationServiceDesc,
                  serviceType: serviceTypeDetail.serviceType,
                },
              },
            );

            if (serviceTypeItem) {
              const existingMapping = await manager.findOne(
                PermissionServiceType,
                {
                  where: {
                    serviceTypeId: parseInt(serviceTypeItem.id),
                    permissionId: permission.id,
                  },
                },
              );

              if (!existingMapping) {
                const newMapping = new PermissionServiceType();
                newMapping.serviceTypeId = parseInt(serviceTypeItem.id);
                newMapping.permissionId = permission.id;
                await manager.save(PermissionServiceType, newMapping);
                console.log('permissionServiceTypeMapping ensured', newMapping);
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log('PermissionsSeeder error:', error);
  }
};
