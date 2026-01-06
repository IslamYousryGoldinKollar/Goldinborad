import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TenantScopedRequest } from './tenant-scoped-request.interface';

@Injectable()
export class TenantContextGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<TenantScopedRequest>();

    if (!request.user) {
      throw new UnauthorizedException('ERR.AUTH.MISSING_TOKEN');
    }

    return true;
  }
}
