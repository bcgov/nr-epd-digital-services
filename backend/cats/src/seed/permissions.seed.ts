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

    const permissionEntities: Permissions[] = [];

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

        if (perm.serviceTypesDetails && perm.serviceTypesDetails.length > 0) {
          for (const serviceTypeDetail of perm.serviceTypesDetails) {
            const permissionServiceTypeMapping = new PermissionServiceType();

            let serviceTypeItem = await manager.findOne(
              ApplicationServiceType,
              {
                where: {
                  serviceName: serviceTypeDetail.applicationServiceDesc,
                  serviceType: serviceTypeDetail.serviceType,
                },
              },
            );

            if (serviceTypeItem) {
              permissionServiceTypeMapping.serviceTypeId = parseInt(
                serviceTypeItem.id,
              );

              permissionServiceTypeMapping.permissionId = permission.id;

              let existingServiceTypeItem = await manager.findOne(
                PermissionServiceType,
                {
                  where: {
                    serviceTypeId: permissionServiceTypeMapping.serviceTypeId,
                    permissionId: permissionServiceTypeMapping.permissionId,
                  },
                },
              );
              if (!existingServiceTypeItem) {
                await manager.save(
                  PermissionServiceType,
                  permissionServiceTypeMapping,
                );
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
