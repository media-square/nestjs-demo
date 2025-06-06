import { Injectable } from '@nestjs/common';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

import * as StorageAdapters from './adapters';
import { DynamicFileInterceptorOptions } from './interceptors/dynamic-file.interceptor';

@Injectable()
export class StorageFactory implements MulterOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly minioStorageService: StorageAdapters.MinioStorageService,
    private readonly awsS3StorageService: StorageAdapters.AWSS3StorageService,
  ) {}

  // Add service in this constructor and define Multer Storage Engine options here
  createMulterOptions(options?: DynamicFileInterceptorOptions): MulterModuleOptions {
    const storageEngine = this.configService.getOrThrow<string>('STORAGE_ENGINE');
    switch (storageEngine) {
      case 's3':
        return this.awsS3StorageService.createMulterOptions(options);
      case 'minio':
        return this.minioStorageService.createMulterOptions(options);
      default:
        throw new Error(`Invalid storage engine: ${storageEngine}`);
    }
  }
}
