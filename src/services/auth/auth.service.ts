import * as bcrypt from 'bcrypt';
import type { Request } from 'express';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AdvisorService } from '../advisor/advisor.service';
import { AuthLoginScheme, AuthRegisterScheme } from './auth.dto';
import { AdvisorEntity } from '../advisor/advisor.entity';
import { AUTH_PASSWORD_SALT_ROUNDS, HeaderNames } from './auth.constants';
import BackendException from 'src/utils/backend.exception';
import { toArray } from 'src/utils/array';
import { isStringTruthy } from 'src/utils/string';
import type { User } from './auth.types';
import type { AuthRegisterDto, AuthLoginDto } from './auth.dto';

@Injectable()
export default class AuthService {
  constructor(
    @Inject(AdvisorService) private advisorService: AdvisorService,
    private jwtService: JwtService,
  ) {}

  /**
   * Get access token
   * @param req Request
   * @returns string with access token
   */
  getToken(req: Request): string | undefined {
    const token = this.getAccessTokenFromHeaders(req);

    return !isStringTruthy(token) ? undefined : token;
  }

  /**
   * Get Access token from auth header
   * @param req Request
   * @returns token
   */
  getAccessTokenFromHeaders(req: Request): string | undefined {
    if (!req.headers || !req.headers[HeaderNames.Authorization]) return undefined;

    const authHeaders = toArray(req.headers[HeaderNames.Authorization]);

    const authHeader = authHeaders.pop();

    if (!authHeader.startsWith('Bearer ')) return undefined;

    const token = authHeader.substring(7, authHeader.length);

    return token;
  }

  /**
   * Get a hashed password
   * @param password string
   * @returns string
   */
  hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(AUTH_PASSWORD_SALT_ROUNDS);

    return bcrypt.hashSync(password, salt);
  }

  /**
   * Create a JWT token from an advisory entity
   * @param advisor AdvisorEntity
   * @returns string with JWT token
   */
  generateToken(advisor: AdvisorEntity): string {
    const { id, name, email } = advisor;
    const payload = {
      sub: id,
      id,
      name,
      email,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Validate a JWT token payload
   * @param payload token
   * @returns User from JWT
   */
  validateJwt(payload: string): User | undefined {
    try {
      const user = this.jwtService.verify<User>(payload);
      return user;
    } catch (error: unknown) {
      return undefined;
    }
  }

  /**
   * Validate JWT token
   * @param request Request
   * @returns JWT user
   */
  async validateUser(request: Request): Promise<User> {
    const token = this.getToken(request);

    if (!token) throw new BackendException('Authorization not found');

    const user = this.validateJwt(token);

    if (!user) throw new BackendException('Not authorized');

    return user;
  }

  /**
   * Get advisor entity from a validated JWT, or raise UnauthorizedException when not found.
   * @param user JWT
   * @returns advisor entity
   */
  async getUser(user: User): Promise<User> {
    const advisor = await this.advisorService.getById(user.id);

    if (!advisor) throw new BackendException('User not found');

    return advisor as User;
  }

  /**
   * Login an user/adivor and return true
   * Don't provide any failure details, just a login failed
   * @param user JWT token with User
   */
  async login(data: AuthLoginDto): Promise<string> {
    const parsedData = AuthLoginScheme.parse(data);
    const advisor = await this.advisorService.getByEmailWithPassword(parsedData.email);

    if (!advisor) throw new BackendException(`Login Failed`);

    if (!bcrypt.compareSync(parsedData.password, advisor.password || '')) {
      throw new BackendException('Login Failed');
    }

    return this.generateToken(advisor);
  }

  async register(data: AuthRegisterDto): Promise<User> {
    const parsedData = AuthRegisterScheme.parse(data);

    const advisorExists = await this.advisorService.getByEmail(parsedData.email);

    if (advisorExists) throw new BackendException('Unable to register with email address');

    const password = this.hashPassword(parsedData.password);

    const advisor = await this.advisorService.create({ ...parsedData, password });

    if (!advisor) throw new BackendException('Unable to save user account');

    return advisor as User;
  }
}
