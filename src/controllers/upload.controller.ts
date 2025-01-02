import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

// import { Public } from '../services/auth/auth.decorators';

@Controller('upload')
export class UploadController {
  private static readonly uploadPath = 'uploads';

  @Post()
  @UseInterceptors(FileInterceptor('file', { dest: UploadController.uploadPath }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename || file.originalname,
      path: file.path,
    };
  }
}
