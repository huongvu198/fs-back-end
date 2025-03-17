import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Errors } from '../../../errors/errors';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<(number | string)[]>(
      'roles',
      [context.getClass(), context.getHandler()],
    );
    if (!roles?.length) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const userRole = String(user?.role);

    if (!roles.includes(userRole)) {
      throw new ForbiddenException(Errors.FORBIDDEN);
    }

    return true;
  }
}
