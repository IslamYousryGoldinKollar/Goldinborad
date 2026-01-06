import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const tenant = authHeader?.toString().includes('tenant:')
      ? authHeader.toString().split('tenant:')[1]
      : undefined;

    if (!tenant) {
      throw new UnauthorizedException({
        error_code: 'ERR.AUTH.TENANT_REQUIRED',
        message: 'Tenant context missing'
      });
    }

    (req as any).tenant_id = tenant;
    next();
  }
}
