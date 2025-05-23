import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptionsFactory } from '@nestjs/platform-express';

import { AWSS3StorageService } from './storage-aws-s3.service';

@Injectable()
export class MinioStorageService extends AWSS3StorageService implements MulterOptionsFactory {
  private readonly DEFAULT_PORT: number = 9000;

  private readonly DEFAULT_HOST: string = 'localhost';

  // Minio doesn't care about regions, but we need to provide one to be compatible with the S3Client
  private readonly DEFAULT_REGION: string = 'eu-west-1';

  private protocol: string;

  private host: string;

  private port: number;

  constructor(configService: ConfigService) {
    super(configService);
    this.protocol = this.configService.get<boolean>('MINIO_FORCE_SSL', false) ? 'https' : 'http';
    this.host = this.configService.get<string>('MINIO_HOST', this.DEFAULT_HOST);
    this.port = this.configService.get<number>('MINIO_PORT', this.DEFAULT_PORT);
  }

  private getEndpoint(): string {
    const url = new URL(`${this.protocol}://${this.host}:${this.port}/`);

    return url.toString();
  }

  override getClient(): S3Client {
    if (!this.client) {
      const endpoint = this.getEndpoint();
      this.client = new S3Client({
        region: this.configService.get<string>('MINIO_REGION', this.DEFAULT_REGION),
        endpoint,
        credentials: {
          accessKeyId: this.configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
          secretAccessKey: this.configService.getOrThrow<string>('MINIO_SECRET_KEY'),
        },
        forcePathStyle: this.configService.get<boolean>('MINIO_FORCE_PATH_STYLE', true),
      });
    }
    return this.client;
  }
}
