import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

import { HealthService } from './health.service';
import { EApiTags } from '../../shared/enum';

@ApiTags(EApiTags.HEALTH_CHECK)
@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  @ApiOperation({
    description: 'Health check endpoint',
    operationId: 'healthCheck',
  })
  @HealthCheck()
  async healthCheck() {
    return this.healthService.healthCheck();
  }
}
