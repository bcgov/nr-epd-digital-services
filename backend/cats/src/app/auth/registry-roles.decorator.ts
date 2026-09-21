import { SetMetadata } from '@nestjs/common';
import { RoleMatchingMode } from 'nest-keycloak-connect';

export const REGISTRY_ROLES_KEY = 'registry_roles';

export type RegistryRolesOptions = {
  roles: string[];
  mode?: RoleMatchingMode;
};

export const RegistryRoles = (options: RegistryRolesOptions) =>
  SetMetadata(REGISTRY_ROLES_KEY, options);
