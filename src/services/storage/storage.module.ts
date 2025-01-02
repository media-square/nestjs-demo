import { Module, Global } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { StorageFactory } from './storage.factory';
import * as StorageAdapters from './adapters';

@Global()
@Module({
  imports: [
    ConfigModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: StorageFactory,
    }),
  ],
  providers: [ConfigService, StorageFactory, ...Object.values(StorageAdapters)],
  exports: [MulterModule, ...Object.values(StorageAdapters)],
})
export class StorageModule {}
