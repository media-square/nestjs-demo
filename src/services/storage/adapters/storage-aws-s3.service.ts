import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';

@Injectable()
export class AWSS3StorageService implements MulterOptionsFactory {
  private client: S3Client;

  private bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET', '');
  }

  private getClient(): S3Client {
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

  private getBucket(bucket?: string): string {
    return bucket || this.bucket;
  }

  createMulterOptions(): MulterModuleOptions {
    const s3 = this.getClient();
    const bucket = this.getBucket();

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
