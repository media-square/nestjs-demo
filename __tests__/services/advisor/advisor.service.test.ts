import * as assert from 'assert';
import { describe, it, before, after, afterEach } from 'node:test';
import { DataSource, Repository } from 'typeorm';

import { AdvisorCreateDto } from '../../../src/services/advisor/advisor.dto';
import { AdvisorEntity } from '../../../src/services/advisor/advisor.entity';
import { AdvisorService } from '../../../src/services/advisor/advisor.service';
import { ProductEntity } from '../../../src/services/product/product.entity';

import { getDefaultTypeOrmTestingConfig } from '../../../src/utils/typeorm.config';

describe('AdvisorService', () => {
  let service: AdvisorService;
  let advisorRepository: Repository<AdvisorEntity>;
  let dataSource: DataSource;
  const dataSourceConfig = getDefaultTypeOrmTestingConfig();

  const mocks = {
    advisor: {
      email: 'advisor@example.com',
      name: 'John Doe',
      password: 'verysecurepassword',
    } as AdvisorCreateDto,
  };

  const deleteMockedAdvisor = async () => {
    await advisorRepository.delete({ email: mocks.advisor.email });
  };

  before(async () => {
    dataSource = new DataSource({ ...dataSourceConfig, entities: [AdvisorEntity, ProductEntity] });
    await dataSource.initialize();
    advisorRepository = dataSource.getRepository(AdvisorEntity);
    service = new AdvisorService(advisorRepository);
  });

  afterEach(async () => {
    await deleteMockedAdvisor();
  });

  after(async () => {
    await dataSource.destroy();
  });

  it('should create a new advisor', async () => {
    const advisor = await service.create(mocks.advisor);

    assert.strictEqual(advisor.email, mocks.advisor.email);
    assert.strictEqual(advisor.name, mocks.advisor.name);
    assert.strictEqual((advisor as any).password, undefined);
  });

  it('should get advisor by id', async () => {
    const advisor = await service.create(mocks.advisor);
    const foundAdvisor = await service.getById(advisor.id);

    assert(foundAdvisor);
    assert.strictEqual(foundAdvisor?.email, mocks.advisor.email);
    assert.strictEqual(foundAdvisor?.name, mocks.advisor.name);
  });

  it('should get advisor by email', async () => {
    await service.create(mocks.advisor);
    const advisor = await service.getByEmail(mocks.advisor.email);

    assert(advisor);
    assert.strictEqual(advisor?.email, mocks.advisor.email);
    assert.strictEqual(advisor?.name, mocks.advisor.name);
  });

  it('should get advisor by email with password', async () => {
    await service.create(mocks.advisor);
    const advisor = await service.getByEmailWithPassword(mocks.advisor.email);

    assert(advisor);
    assert.strictEqual(advisor?.email, mocks.advisor.email);
    assert.strictEqual(advisor?.name, mocks.advisor.name);
    assert.strictEqual(advisor?.password, mocks.advisor.password);
  });
});
