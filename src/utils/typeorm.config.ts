import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

export const getDefaultTypeormConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.getOrThrow<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT', 5432),
  database: configService.getOrThrow<string>('DATABASE_NAME'),
  username: configService.getOrThrow<string>('DATABASE_USERNAME'),
  password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
  schema: 'public',
  synchronize: false,
});

export const getDefaultTypeOrmTestingConfig = (): DataSourceOptions => ({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'app_test',
  username: 'postgres',
  password: 'postgres',
  schema: 'public',
  synchronize: false,
});
