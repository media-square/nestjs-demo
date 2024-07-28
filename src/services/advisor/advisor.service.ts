import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';

import { AdvisorEntity } from './advisor.entity';
import { AdvisorCreateScheme } from './advisor.dto';
import type { AdvisorCreateDto } from './advisor.dto';

@Injectable()
export class AdvisorService {
  constructor(
    @InjectRepository(AdvisorEntity)
    private advisorRepository: Repository<AdvisorEntity>,
  ) {}

  async getById(id: string): Promise<AdvisorEntity | undefined> {
    return this.advisorRepository.findOneBy({ id });
  }

  async getByEmail(email: string): Promise<AdvisorEntity | undefined> {
    return this.advisorRepository.findOneBy({ email });
  }

  /**
   * Since password is a sensitive information, we should not return it in the response unless intended.
   * @param email email
   * @returns AdvisorEntity | undefined
   */
  async getByEmailWithPassword(email: string): Promise<AdvisorEntity | undefined> {
    const columns = this.advisorRepository.metadata.columns.map((column) => column.propertyName) as FindOptionsSelect<AdvisorEntity>;
    return this.advisorRepository.findOne({ where: { email }, select: columns });
  }

  async create(createAdvisorDto: AdvisorCreateDto): Promise<AdvisorEntity> {
    const parsedAdvisor = AdvisorCreateScheme.parse(createAdvisorDto);
    const advisorEntity = this.advisorRepository.create(parsedAdvisor);
    const advisor = await this.advisorRepository.save(advisorEntity);

    return this.getById(advisor.id);
  }
}
