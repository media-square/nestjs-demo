import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductModule } from './services/product';
import { AdvisorModule } from './services/advisor';
import { AuthModule } from './services/auth/auth.modules';
import { AuthGuard } from './services/auth/auth.gaurd';
import { AdvisorEntity } from './services/advisor/advisor.entity';
import { ProductEntity } from './services/product/product.entity';
import { getDefaultTypeormConfig } from './utils/typeorm.config';
import { StorageModule } from './services/storage/storage.module';
import { UploadController } from './controllers/upload.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    StorageModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_DURATION', '8h'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...getDefaultTypeormConfig(configService),
        entities: [AdvisorEntity, ProductEntity],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    AdvisorModule,
    ProductModule,
  ],
  controllers: [UploadController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
