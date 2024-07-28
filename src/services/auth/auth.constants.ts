export const HeaderNames = {
  Authorization: 'authorization',
};

export const AUTH_PASSWORD_SALT_ROUNDS: number = 10;

export const AUTH_STRATEGY_KEY = 'AuthStrategy';

export enum AuthStrategy {
  Public = 'public',
  Secure = 'secure',
}
