import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleMatchingMode } from 'nest-keycloak-connect';
import { SiteRoleGuard } from './site-role.guard';

describe('SiteRoleGuard', () => {
  const createContext = (request: any = {}): ExecutionContext =>
    ({
      getType: jest.fn(() => 'http'),
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => request),
      })),
    }) as any;

  const createGuard = (rolesOptions: any) => {
    const reflector = {
      getAllAndOverride: jest.fn(() => rolesOptions),
    } as unknown as Reflector;

    return new SiteRoleGuard(reflector);
  };

  it('allows requests without site role metadata', () => {
    const guard = createGuard(undefined);

    expect(guard.canActivate(createContext())).toBe(true);
  });

  it('allows requests when any required role is present in site_roles', () => {
    const guard = createGuard({
      roles: ['user-admin'],
      mode: RoleMatchingMode.ANY,
    });

    expect(
      guard.canActivate(
        createContext({ user: { site_roles: ['user-admin'] } }),
      ),
    ).toBe(true);
  });

  it('denies requests when required roles are absent', () => {
    const guard = createGuard({
      roles: ['user-admin'],
      mode: RoleMatchingMode.ANY,
    });

    expect(
      guard.canActivate(createContext({ user: { site_roles: ['viewer'] } })),
    ).toBe(false);
  });

  it('requires every role in all matching mode', () => {
    const guard = createGuard({
      roles: ['user-admin', 'cats-admin'],
      mode: RoleMatchingMode.ALL,
    });

    expect(
      guard.canActivate(
        createContext({ user: { site_roles: ['user-admin', 'cats-admin'] } }),
      ),
    ).toBe(true);
  });

  it('supports legacy realm and resource role claims during migration', () => {
    const guard = createGuard({
      roles: ['user-admin'],
      mode: RoleMatchingMode.ANY,
    });

    expect(
      guard.canActivate(
        createContext({
          user: {
            realm_access: { roles: ['viewer'] },
            resource_access: { 'site-service': { roles: ['user-admin'] } },
          },
        }),
      ),
    ).toBe(true);
  });

  it('denies requests when no authenticated user is present', () => {
    const guard = createGuard({
      roles: ['user-admin'],
      mode: RoleMatchingMode.ANY,
    });

    expect(
      guard.canActivate(
        createContext({ headers: { authorization: 'Bearer test-token' } }),
      ),
    ).toBe(false);
  });

  it('normalizes loginSource to identity_provider for downstream services', () => {
    const request: any = {
      user: { loginSource: 'IDIR', site_roles: ['user-admin'] },
    };
    const guard = createGuard({
      roles: ['user-admin'],
      mode: RoleMatchingMode.ANY,
    });

    expect(guard.canActivate(createContext(request))).toBe(true);
    expect(request.user.identity_provider).toBe('idir');
  });
});