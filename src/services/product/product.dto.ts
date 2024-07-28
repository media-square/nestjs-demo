import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const ProductCreateSchema = z.object({
  name: z.string().min(1).max(64),
  description: z.string().min(1).optional().nullable(),
  price: z.number().positive(),
});

export class ProductCreateDto {
  @ApiProperty({ example: 'Product name' })
  name: string;

  @ApiProperty({ example: 100, description: 'Price of the product' })
  price: number;

  @ApiProperty({ example: 'Product description', required: false })
  description?: string;
}
