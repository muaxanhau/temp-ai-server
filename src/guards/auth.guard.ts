import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { config } from 'src/config';
import { NO_AUTH } from 'src/decorators';
import { firebaseAuth } from 'src/services/firebase';
import { exceptionUtil } from 'src/utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const noAuthGuard = this.reflector.get<boolean>(
      NO_AUTH,
      context.getHandler(),
    );
    if (noAuthGuard) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.headers[config.tokenName];
    if (!token) return exceptionUtil.unauthorized();

    try {
      await firebaseAuth.verifyIdToken(token);
      return true;
    } catch (e) {
      return exceptionUtil.unauthorized();
    }
  }
}
