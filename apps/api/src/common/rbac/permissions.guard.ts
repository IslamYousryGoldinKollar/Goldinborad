import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, ROLES_KEY } from './permissions.decorator';
import { TenantScopedRequest } from '../tenancy/tenant-scoped-request.interface';
import { DEFAULT_ROLE_PERMISSIONS } from './permission-registry';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<TenantScopedRequest>();
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || [];
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || [];

    const user = request.user;
    if (!user) {
      throw new ForbiddenException('ERR.AUTH.MISSING_TOKEN');
    }

    if (requiredRoles.length > 0) {
      const hasRole = user.roles.some((role) => requiredRoles.includes(role));
      if (!hasRole) {
        throw new ForbiddenException('ERR.AUTH.FORBIDDEN');
      }
    }

    if (requiredPermissions.length === 0) {
      return true;
    }

    const resolvedPermissions = new Set<string>(user.permissions);
    user.roles.forEach((role) => {
      const mappedPermissions = DEFAULT_ROLE_PERMISSIONS[role];
      if (mappedPermissions) {
        mappedPermissions.forEach((perm) => resolvedPermissions.add(perm));
      }
      if (mappedPermissions?.includes('*')) {
        requiredPermissions.forEach((perm) => resolvedPermissions.add(perm));
      }
    });

    const missing = requiredPermissions.filter((permission) => !resolvedPermissions.has(permission));
    if (missing.length > 0) {
      throw new ForbiddenException('ERR.AUTH.FORBIDDEN');
    }

    return true;
  }
}
