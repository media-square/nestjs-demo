import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';

@Injectable()
export class MinioStorageService implements MulterOptionsFactory {
  private static readonly DEFAULT_PORT = 9000;

  private static readonly DEFAULT_HOST = 'localhost';

  // Minio doesn't care about regions, but we need to provide one to be compatible with the S3Client
  private static readonly DEFAULT_REGION = 'eu-west-1';

  private client: S3Client;

  private bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('MINIO_BUCKET', '');
  }

  private getClient(): S3Client {
    if (!this.client) {
      const endpoint = this.getEndpoint();
      this.client = new S3Client({
        region: this.configService.get<string>('MINIO_REGION', MinioStorageService.DEFAULT_REGION),
        endpoint,
        credentials: {
          accessKeyId: this.configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
          secretAccessKey: this.configService.getOrThrow<string>('MINIO_SECRET_KEY'),
        },
      });
    }
    return this.client;
  }

  private getEndpoint(): string {
    const protocol = this.configService.get<boolean>('MINIO_FORCE_SSL', false) ? 'https' : 'http';
    const host = this.configService.get<string>('MINIO_HOST', MinioStorageService.DEFAULT_HOST);
    const port = this.configService.get<number>('MINIO_PORT', MinioStorageService.DEFAULT_PORT);
    const url = new URL(`${protocol}://${host}:${port}/`);

    return url.toString();
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
      }),
    };
  }
}
