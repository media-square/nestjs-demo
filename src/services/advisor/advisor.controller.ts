import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdvisorService } from './advisor.service';
import { CurrentUser } from '../auth/auth.decorators';
import type { AdvisorDto } from './advisor.dto';
import type { User } from '../auth/auth.types';

@ApiTags('Advisor')
@Controller('advisor')
export class AdvisorController {
  constructor(private readonly advisorService: AdvisorService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current Advisor' })
  @ApiBearerAuth()
  async getAdvisor(@CurrentUser() user: User): Promise<AdvisorDto> {
    const advisor = await this.advisorService.getById(user.id);

    if (!advisor) throw new NotFoundException(`Advisor with ID ${user.id} not found`);

    return advisor;
  }
}
