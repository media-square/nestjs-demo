import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import AuthService from './auth.service';
import { CustomStrategy } from './passport/custom.strategy';
import { AuthGuard } from './auth.gaurd';
import { AdvisorModule } from '../advisor';
import { AdvisorService } from '../advisor/advisor.service';
import { AdvisorEntity } from '../advisor/advisor.entity';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule, AdvisorModule, TypeOrmModule.forFeature([AdvisorEntity])],
  providers: [AuthService, AuthGuard, AdvisorService, CustomStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
