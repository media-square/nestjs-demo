import { Controller, Post, Body, BadRequestException, ForbiddenException, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ZodValidationPipe } from 'src/utils/validation.pipe';
import { Public } from '../auth/auth.decorators';
import AuthService from './auth.service';
import { AuthLoginDto, AuthLoginScheme, AuthRegisterDto, AuthRegisterScheme } from './auth.dto';
import type { AuthLogin, User } from './auth.types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Logged in successfully' })
  @ApiResponse({ status: 401, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Public()
  @UsePipes(new ZodValidationPipe(AuthLoginScheme))
  async login(@Body() body: AuthLoginDto): Promise<AuthLogin> {
    try {
      const accessToken = await this.authService.login(body);
      return { accessToken };
    } catch (error: unknown) {
      throw new ForbiddenException(error);
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @ApiResponse({ status: 200, description: 'registered successfully' })
  @ApiResponse({ status: 401, description: 'Bad request' })
  @Public()
  @UsePipes(new ZodValidationPipe(AuthRegisterScheme))
  async register(@Body() body: AuthRegisterDto): Promise<User> {
    try {
      const user = await this.authService.register(body);
      return user;
    } catch (error: unknown) {
      throw new BadRequestException(error);
    }
  }
}
