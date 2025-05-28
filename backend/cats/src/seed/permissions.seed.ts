import { EntityManager } from 'typeorm';
import { ParticipantRole } from '../app/entities/participantRole.entity';
import { Permissions } from '../app/entities/permissions.entity';
import {
  CASEWORKER_PERMISSIONS,
  COMMON_PERMISSIONS,
  MENTOR_PERMISSIONS,
  SDM_PRMISSIONS,
} from './permissions';

export const PermissionsSeeder = async (manager: EntityManager) => {
  try {
    const roles = await manager.find(ParticipantRole, {
      where: { roleType: 'STAFF' },
    });

    if (!roles.length) {
      console.warn('No STAFF roles found. Skipping PermissionsSeeder.');
      return;
    }

    const getPermissionsForRole = (abbrev: string): any[] => {
      switch (abbrev) {
        case 'CSWKR':
          return [...COMMON_PERMISSIONS, ...CASEWORKER_PERMISSIONS];
        case 'SDM':
          return [...COMMON_PERMISSIONS, ...SDM_PRMISSIONS];
        case 'MENTOR':
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

      newPermissions.forEach((perm) => {
        const permission = new Permissions();
        permission.roleId = role.id;
        permission.description = perm.description;
        permission.createdBy = 'sysadmin';
        permission.createdDatetime = new Date();
        permission.updatedBy = 'sysadmin';
        permission.updatedDatetime = new Date();

        permissionEntities.push(permission);
      });
    }

    if (permissionEntities.length) {
      await manager.save(Permissions, permissionEntities);
      console.log(`Seeded ${permissionEntities.length} permissions.`);
    } else {
      console.warn('No permissions generated for available roles.');
    }
  } catch (error) {
    console.error('PermissionsSeeder error:', error);
  }
};
