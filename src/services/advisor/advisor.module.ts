import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdvisorEntity } from './advisor.entity';
import { AdvisorController } from './advisor.controller';
import { AdvisorService } from './advisor.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdvisorEntity])],
  providers: [AdvisorService],
  controllers: [AdvisorController],
})
export class AdvisorModule {}
