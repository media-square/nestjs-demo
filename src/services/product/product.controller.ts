import { Controller, Post, Body, Get, Param, UnauthorizedException, NotFoundException, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ProductService } from './product.service';
import { ProductCreateDto, ProductCreateSchema } from './product.dto';
import { CurrentUser } from '../auth/auth.decorators';
import { User } from '../auth/auth.types';
import { ProductEntity } from './product.entity';
import { ZodValidationPipe } from 'src/utils/validation.pipe';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 200, description: 'The product has been successfully created.' })
  @ApiResponse({ status: 401, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UsePipes(new ZodValidationPipe(ProductCreateSchema))
  async create(@CurrentUser() user: User, @Body() product: ProductCreateDto) {
    return this.productService.create(product, user);
  }

  @Get('list')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get product for current logged in user' })
  @ApiResponse({ status: 200, description: 'Get all the products' })
  @ApiResponse({ status: 401, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getByAdvisor(@CurrentUser() user: User): Promise<ProductEntity[]> {
    const products = await this.productService.getByAdvisor(user.id);

    if (!products) throw new NotFoundException(`No product found`);

    return products;
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get product' })
  @ApiResponse({ status: 200, description: 'Get the product' })
  @ApiResponse({ status: 401, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getById(@CurrentUser() user: User, @Param('id') id: string): Promise<ProductEntity> {
    const product = await this.productService.getById(id);
    this.guardAccess(product, user);

    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);

    return product;
  }

  guardAccess(product: ProductEntity, user: User): void {
    if (product.advisorId !== user.id) throw new UnauthorizedException('Access Denied');
  }
}
