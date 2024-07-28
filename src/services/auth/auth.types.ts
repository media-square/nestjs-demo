import type { Request as ExpressRequest } from 'express';

import { AdvisorDto } from '../advisor/advisor.dto';
import { AuthStrategy } from './auth.constants';

export type User = Pick<AdvisorDto, 'id' | 'name' | 'email'>;

export type AuthParameters = {
  strategy: AuthStrategy;
};

export type AuthLogin = {
  accessToken: string;
};

export type Request = ExpressRequest & {
  authParameters?: AuthParameters;
};
