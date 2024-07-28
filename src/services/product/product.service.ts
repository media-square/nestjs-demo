import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductEntity } from './product.entity';
import { ProductCreateDto } from './product.dto';
import { User } from '../auth/auth.types';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async create(product: ProductCreateDto, user: User): Promise<ProductEntity> {
    const entity = this.productRepository.create({ ...product, advisorId: user.id });

    return this.productRepository.save(entity);
  }

  async getById(id: string): Promise<ProductEntity | undefined> {
    return this.productRepository.findOne({ where: { id }, relations: ['advisor'] });
  }

  async getByAdvisor(advisorId: string): Promise<ProductEntity[] | undefined> {
    return this.productRepository.find({ where: { advisorId } });
  }
}
