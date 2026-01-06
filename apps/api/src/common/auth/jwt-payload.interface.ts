export interface JwtPayload {
  sub: string;
  tenant_id: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
  exp?: number;
  iat?: number;
}
