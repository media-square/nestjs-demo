import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject, mixin } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { StorageFactory } from '../storage.factory';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export interface DynamicFilesInterceptorOptions extends MulterOptions {
  s3?: {
    bucket?: string;
  };
}

export function DynamicFilesInterceptor(maxCount?: number, options?: DynamicFilesInterceptorOptions) {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    constructor(@Inject(StorageFactory) public readonly storageFactory: StorageFactory) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const multerOptions = this.storageFactory.createMulterOptions(options);

      const DynamicInterceptorClass = FilesInterceptor('Files', maxCount, multerOptions);
      const dynamicInterceptor = new DynamicInterceptorClass();

      return dynamicInterceptor.intercept(context, next);
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor;
}
