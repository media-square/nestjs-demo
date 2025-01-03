import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';

import { DynamicFileInterceptorOptions } from '../interceptors/dynamic-file.interceptor';

@Injectable()
export class AWSS3StorageService implements MulterOptionsFactory {
  protected client: S3Client;

  protected readonly DEFAULT_BUCKET_ENV_KEY: string = 'AWS_S3_BUCKET';

  constructor(protected readonly configService: ConfigService) {}

  protected getClient(): S3Client {
    if (!this.client) {
      this.client = new S3Client({
        region: this.configService.getOrThrow<string>('AWS_REGION'),
        credentials: {
          accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
          secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
        },
      });
    }
    return this.client;
  }

  protected getBucket(bucket?: string): string {
    let bucketEnvKey = this.DEFAULT_BUCKET_ENV_KEY;
    if (bucket && typeof bucket === 'string' && bucket.length > 0) {
      bucketEnvKey = bucket;
    }
    return this.configService.getOrThrow<string>(bucketEnvKey);
  }

  createMulterOptions(options?: DynamicFileInterceptorOptions): MulterModuleOptions {
    const s3 = this.getClient();
    const bucket = this.getBucket(options?.s3?.bucket);

    return {
      storage: multerS3({
        s3,
        bucket,
        metadata: (req, file, cb) => {
          cb(null, { fieldname: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(null, new Date().toISOString() + '-' + file.originalname);
        },
      }),
    };
  }
}
