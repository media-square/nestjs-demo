import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

import { AUTH_STRATEGY_KEY, AuthStrategy } from './auth.constants';
import type { AuthParameters } from './auth.types';

@Injectable()
export class AuthGuard extends PassportAuthGuard('custom') implements CanActivate {
  constructor(@Inject(Reflector) protected reflector: Reflector) {
    super();
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();

    const authParameters = this.reflector.getAllAndOverride<AuthParameters | undefined>(AUTH_STRATEGY_KEY, [ctx.getHandler()]);

    request.authParameters = {
      strategy: typeof authParameters?.strategy === 'string' ? authParameters.strategy : AuthStrategy.Secure,
    };

    return super.canActivate(ctx) as Promise<boolean>;
  }
}
