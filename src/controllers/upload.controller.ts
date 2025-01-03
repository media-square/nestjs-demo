import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';

// import { Public } from '../services/auth/auth.decorators';
import { DynamicFileInterceptor } from 'src/services/storage/interceptors/dynamic-file.interceptor';

@Controller('upload')
export class UploadController {
  @Post()
  // @Public()
  @UseInterceptors(DynamicFileInterceptor({ s3: { bucket: 'MINIO_BUCKET_SOMETHING' } }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename || file.originalname,
      path: file.path,
    };
  }
}
