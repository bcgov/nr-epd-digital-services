import { SetMetadata } from '@nestjs/common';
import { RoleMatchingMode } from 'nest-keycloak-connect';

export const SITE_ROLES_KEY = 'site_roles';

export type SiteRolesOptions = {
  roles: string[];
  mode?: RoleMatchingMode;
};

export const SiteRoles = (options: SiteRolesOptions) =>
  SetMetadata(SITE_ROLES_KEY, options);