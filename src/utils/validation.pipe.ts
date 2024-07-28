import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { AnyZodObject, z } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: AnyZodObject) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      return metadata.type === 'custom' ? value : this.schema.parse(value);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) throw new BadRequestException(error.errors);

      throw error;
    }
  }
}
