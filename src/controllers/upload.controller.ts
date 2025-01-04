import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';

// import { Public } from '../services/auth/auth.decorators';
import { DynamicFileInterceptor } from 'src/services/storage/interceptors/dynamic-file.interceptor';

@Controller('upload')
export class UploadController {
  @Post('document')
  // @Public()
  @UseInterceptors(DynamicFileInterceptor({ s3: { bucket: 'AWS_S3_BUCKET_DOCUMENTS' } }))
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename || file.originalname,
      path: file.path,
    };
  }

  @Post('file')
  // @Public()
  @UseInterceptors(DynamicFileInterceptor({ s3: { bucket: 'AWS_S3_BUCKET_FILES' } }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename || file.originalname,
      path: file.path,
    };
  }
}
