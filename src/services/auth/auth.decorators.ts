import { SetMetadata, createParamDecorator, ExecutionContext, applyDecorators } from '@nestjs/common';

import { AUTH_STRATEGY_KEY, AuthStrategy } from './auth.constants';

/**
 * Use this decorator to mark endpoint as secure or public, by
 */
export const Auth = (strategy: AuthStrategy) => SetMetadata(AUTH_STRATEGY_KEY, { strategy });

/**
 * Use this decorator to get the current user from the request in any secure enpoint
 */
export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => context.switchToHttp().getRequest().user);

/**
 * Short-hand decorator @Auth(AuthStrategy.Public) to mark endpoint as public
 */
export const Public = () => {
  return applyDecorators(
    SetMetadata(AUTH_STRATEGY_KEY, {
      strategy: AuthStrategy.Public,
    }),
  );
};
