import * as assert from 'assert';
import { describe, it, before, after, afterEach } from 'node:test';
import { DataSource, Repository } from 'typeorm';

import { getDefaultTypeOrmTestingConfig } from '../../../src/utils/typeorm.config';

import { ProductEntity } from '../../../src/services/product/product.entity';
import { AdvisorEntity } from '../../../src/services/advisor/advisor.entity';
import { ProductService } from '../../../src/services/product/product.service';

describe('ProductService', () => {
  let service: ProductService;
  let advisorRepository: Repository<AdvisorEntity>;
  let productRepository: Repository<ProductEntity>;
  let dataSource: DataSource;
  const dataSourceConfig = getDefaultTypeOrmTestingConfig();

  const mocks = {
    advisor: {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'product@example.com',
      name: 'John Doe',
      password: 'verysecurepassword',
    },
    products: [
      {
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
      },
      {
        name: 'Product 2',
        description: 'Product 2 description',
        price: 50,
      },
    ],
  };

  const deleteMockedAdvisor = async () => {
    await advisorRepository.delete({ id: mocks.advisor.id });
  };

  before(async () => {
    dataSource = new DataSource({ ...dataSourceConfig, entities: [AdvisorEntity, ProductEntity] });
    await dataSource.initialize();
    advisorRepository = dataSource.getRepository(AdvisorEntity);
    productRepository = dataSource.getRepository(ProductEntity);
    await productRepository.delete({});
    await deleteMockedAdvisor();
    await advisorRepository.save(mocks.advisor);
    service = new ProductService(productRepository);
  });

  afterEach(async () => {
    await productRepository.delete({});
  });

  after(async () => {
    await deleteMockedAdvisor();
    await dataSource.destroy();
  });

  it('should create a new product', async () => {
    const product = await service.create(mocks.products[0], mocks.advisor);

    assert.strictEqual(product.name, mocks.products[0].name);
    assert.strictEqual(product.description, mocks.products[0].description);
    assert.strictEqual(product.price, mocks.products[0].price);
    assert.strictEqual(product.advisorId, mocks.advisor.id);
  });

  it('should get a list of all products', async () => {
    await service.create(mocks.products[0], mocks.advisor);
    await service.create(mocks.products[1], mocks.advisor);
    const products = await service.getByAdvisor(mocks.advisor.id);

    assert.strictEqual(products.length, 2);
  });
});
