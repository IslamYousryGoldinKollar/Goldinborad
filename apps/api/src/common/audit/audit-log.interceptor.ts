import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { AuditLogService } from './audit-log.service';
import { TenantScopedRequest } from '../tenancy/tenant-scoped-request.interface';

export const AUDIT_EVENT_KEY = 'auditEvent';

export const AuditEvent = (action: string, entityType: string) =>
  (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(AUDIT_EVENT_KEY, { action, entityType }, descriptor.value);
    return descriptor;
  };

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector, private readonly auditLog: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const handler = context.getHandler();
    const auditConfig = this.reflector.get<{ action: string; entityType: string } | undefined>(AUDIT_EVENT_KEY, handler);

    if (!auditConfig) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<TenantScopedRequest>();

    return next.handle().pipe(
      tap((result: any) => {
        if (!request.user) {
          return;
        }
        const entityId = result?.id || request.params?.id || 'unknown';
        this.auditLog.record(
          this.auditLog.buildEntry(request.user, auditConfig.action, auditConfig.entityType, entityId, {
            path: request.url,
            method: request.method,
          }),
        );
      }),
    );
  }
}
