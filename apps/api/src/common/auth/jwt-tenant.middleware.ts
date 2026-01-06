import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from './jwt-payload.interface';
import { TenantScopedRequest } from '../tenancy/tenant-scoped-request.interface';
import { ForbiddenException } from '@nestjs/common';

const AUTH_HEADER_PREFIX = 'bearer ';

@Injectable()
export class JwtTenantMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: TenantScopedRequest, _res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];

    if (!authHeader || typeof authHeader !== 'string' || !authHeader.toLowerCase().startsWith(AUTH_HEADER_PREFIX)) {
      throw new UnauthorizedException('ERR.AUTH.MISSING_TOKEN');
    }

    const token = authHeader.slice(AUTH_HEADER_PREFIX.length).trim();

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(token);
    } catch (error) {
      throw new UnauthorizedException('ERR.AUTH.INVALID_TOKEN');
    }

    if (!payload?.tenant_id || !payload?.sub) {
      throw new UnauthorizedException('ERR.AUTH.INVALID_TOKEN');
    }

    if (req.params?.tenant_id && req.params.tenant_id !== payload.tenant_id) {
      throw new ForbiddenException('ERR.AUTH.CROSS_TENANT');
    }

    req.user = {
      userId: payload.sub,
      tenantId: payload.tenant_id,
      roles: payload.roles ?? [],
      permissions: payload.permissions ?? [],
      email: payload.email,
    };

    next();
  }
}
