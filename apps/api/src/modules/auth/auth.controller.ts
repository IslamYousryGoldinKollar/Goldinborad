import { Body, Controller, Get, Post } from '@nestjs/common';
import { RequiresPermissions } from '../../common/rbac/rbac.guard';

interface LoginDto {
  email: string;
  password: string;
}

@Controller('v1')
export class AuthController {
  @Post('auth/login')
  login(@Body() body: LoginDto) {
    return {
      access_token: 'stub-token',
      refresh_token: 'stub-refresh',
      user: {
        email: body.email,
        permissions: ['PERM.LRN.ACCESS']
      }
    };
  }

  @Post('auth/refresh')
  refresh() {
    return { access_token: 'stub-token-refreshed' };
  }

  @Get('me')
  @RequiresPermissions('PERM.LRN.ACCESS')
  me() {
    return {
      id: 'user-1',
      tenant_id: 'tenant-1',
      roles: ['learner'],
      permissions: ['PERM.LRN.ACCESS']
    };
  }
}
