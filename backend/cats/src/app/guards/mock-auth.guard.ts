import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

const mockUser = {
  sub: 'mock-user-id',
  preferred_username: 'devuser',
  name: 'devuser',
  givenName: 'devuser',
  email: 'devuser@example.com',
  roles: ['developer'],
  identity_provider: 'idir',
};
@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // For REST
    const req = context.switchToHttp().getRequest();
    if (req) {
      req.user = mockUser;
    }

    // For GraphQL
    const gqlCtx = context.getArgByIndex(2);
    if (gqlCtx && gqlCtx.req) {
      gqlCtx.req.user = mockUser;
    }

    return true; // Always allow
  }
}
