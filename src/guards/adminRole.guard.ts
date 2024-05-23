import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NO_ADMIN_ROLE, NO_AUTH } from 'src/decorators';
import { RoleEnum } from 'src/models';
import { UsersService } from 'src/services';
import { exceptionUtils } from 'src/utils';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const noRoleGuard = this.reflector.get<boolean>(
      NO_ADMIN_ROLE,
      context.getHandler(),
    );
    const noAuthGuard = this.reflector.get<boolean>(
      NO_AUTH,
      context.getHandler(),
    );
    if (noRoleGuard || noAuthGuard) return true;

    const request = context.switchToHttp().getRequest();

    const user = (await this.userService.getUserBy(request.headers))!;
    const isUser = user.role === RoleEnum.USER;
    if (isUser) return exceptionUtils.role();

    return true;
  }
}
