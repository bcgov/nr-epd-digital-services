import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RoleMatchingMode } from 'nest-keycloak-connect';
import {
  REGISTRY_ROLES_KEY,
  RegistryRolesOptions,
} from './registry-roles.decorator';

@Injectable()
export class RegistryRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequest(context);
    const tokenData = this.getTokenData(request);
    const options = this.reflector.getAllAndOverride<RegistryRolesOptions>(
      REGISTRY_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!options?.roles?.length) {
      return true;
    }

    const userRoles = this.getUserRoles(tokenData);
    const mode = options.mode ?? RoleMatchingMode.ANY;

    if (mode === RoleMatchingMode.ALL) {
      return options.roles.every((role) => userRoles.includes(role));
    }

    return options.roles.some((role) => userRoles.includes(role));
  }

  private getRequest(context: ExecutionContext): any {
    if (context.getType<'graphql' | 'http'>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      return gqlContext?.req;
    }

    return context.switchToHttp().getRequest();
  }

  private getTokenData(request: any): any {
    if (!request?.user) {
      return undefined;
    }

    this.normalizeUserClaims(request.user);
    return request.user;
  }

  private normalizeUserClaims(user: any): void {
    if (!user || user.identity_provider || !user.loginSource) {
      return;
    }

    user.identity_provider = String(user.loginSource).toLowerCase();
  }

  private getUserRoles(tokenData: any): string[] {
    const roleSets = [
      tokenData?.site_roles,
      tokenData?.profile?.site_roles,
      tokenData?.user?.profile?.site_roles,
      tokenData?.roles,
      tokenData?.realm_access?.roles,
      ...Object.values(tokenData?.resource_access ?? {}).map(
        (resource: any) => resource?.roles,
      ),
    ];

    return roleSets.flatMap((roles) => this.normalizeRoles(roles));
  }

  private normalizeRoles(roles: unknown): string[] {
    if (Array.isArray(roles)) {
      return roles.filter((role): role is string => typeof role === 'string');
    }

    if (typeof roles === 'string') {
      return [roles];
    }

    return [];
  }
}
