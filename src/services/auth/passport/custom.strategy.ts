import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

import AuthService from '../auth.service';
import { AuthStrategy } from '../auth.constants';
import type { Request, User } from '../auth.types';

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject() private authService: AuthService) {
    super();
  }

  /**
   * When endpoint is secure, validate the JWT token and return Advisor as user.
   * This will bind 'user' to the request and can be retrieved as @CurrentUser() in any secured endpoint
   * @param req Request
   * @returns User | boolean
   */
  async validate(req: Request): Promise<User | boolean> {
    switch (req.authParameters?.strategy) {
      case AuthStrategy.Public:
        return true;
      case AuthStrategy.Secure:
        try {
          const validatedUser = await this.authService.validateUser(req);

          const user = await this.authService.getUser(validatedUser);

          return user;
        } catch (error: unknown) {
          throw new ForbiddenException(error);
        }
      default:
        return false;
    }
  }
}
