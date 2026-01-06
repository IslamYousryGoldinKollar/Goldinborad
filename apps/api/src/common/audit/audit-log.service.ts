import { Injectable } from '@nestjs/common';
import { AuthenticatedUser } from '../tenancy/tenant-scoped-request.interface';

export interface AuditLogEntry {
  actorId: string;
  tenantId: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
  createdAt?: Date;
}

@Injectable()
export class AuditLogService {
  async record(entry: AuditLogEntry): Promise<void> {
    // TODO: persist to audit log table according to schema.sql
    if (!entry.createdAt) {
      entry.createdAt = new Date();
    }
    // placeholder to allow compilation
    return Promise.resolve();
  }

  buildEntry(actor: AuthenticatedUser, action: string, entityType: string, entityId: string, details?: Record<string, unknown>): AuditLogEntry {
    return {
      actorId: actor.userId,
      tenantId: actor.tenantId,
      action,
      entityType,
      entityId,
      details,
    };
  }
}
