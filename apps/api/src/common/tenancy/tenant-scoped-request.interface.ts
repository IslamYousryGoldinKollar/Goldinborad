import { Request } from 'express';

export interface AuthenticatedUser {
  userId: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
  email?: string;
}

export interface TenantScopedRequest extends Request {
  user?: AuthenticatedUser;
}
