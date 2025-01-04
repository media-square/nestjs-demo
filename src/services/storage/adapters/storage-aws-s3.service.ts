import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { StorageEngine } from 'multer';
import { Request } from 'express';
import * as multerS3 from 'multer-s3';

import { DynamicFileInterceptorOptions } from '../interceptors/dynamic-file.interceptor';

interface MulterFileWithLocation extends Express.Multer.File {
  location?: string;
}
@Injectable()
export class AWSS3StorageService implements MulterOptionsFactory, StorageEngine {
  protected client: S3Client;

  protected readonly DEFAULT_BUCKET_ENV_KEY: string = 'AWS_S3_BUCKET';

  private bucketMap: Map<string, MulterModuleOptions> = new Map();

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
    const bucket = this.getBucket(options?.s3?.bucket);

    return this.getStorageForBucket(bucket);
  }

  getStorageForBucket(bucket: string): MulterModuleOptions {
    if (!this.bucketMap.has(bucket)) {
      const s3 = this.getClient();
      const options = {
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
      this.bucketMap.set(bucket, options);
    }
    return this.bucketMap.get(bucket);
  }

  async removeFile(fileKey: string): Promise<void> {
    try {
      const bucket = this.getBucket();
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucket,
        Key: fileKey,
      });

      await this.getClient().send(deleteCommand);
      console.log(`Successfully removed ${fileKey} from bucket ${bucket}`);
    } catch (error) {
      console.error(`Failed to remove file from S3: ${fileKey}`, error);
      throw new Error('File removal failed');
    }
  }

  async _handleFile(req: Request, file: Express.Multer.File, callback: (error: any, file?: Express.Multer.File) => void): Promise<void> {
    try {
      const { originalname, buffer } = file;
      const bucket = this.getBucket();

      const putCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: originalname,
        Body: buffer,
      });

      await this.getClient().send(putCommand);

      const fileWithLocation: MulterFileWithLocation = {
        ...file,
        location: `https://${bucket}.s3.amazonaws.com/${originalname}`,
      };
      callback(null, fileWithLocation);
    } catch (error) {
      callback(error);
    }
  }

  _removeFile(req: Request, file: MulterFileWithLocation, callback: (error: any) => void) {
    const { location } = file;
    const fileKey = location.split('/').pop();

    if (fileKey) {
      this.removeFile(fileKey)
        .then(() => callback(null))
        .catch((err) => callback(err));
    } else {
      callback(new Error('File key not found'));
    }
  }
}
