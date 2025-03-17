import { Injectable } from '@nestjs/common';
import {
  HealthCheckResult,
  HealthCheckService,
  HealthIndicator,
  HealthIndicatorFunction,
  HealthIndicatorResult,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

import { EHealthService } from './health.enum';

@Injectable()
export class HealthService extends HealthIndicator {
  constructor(
    private health: HealthCheckService,
    private readonly mongo: MongooseHealthIndicator,
  ) {
    super();
  }

  async healthCheck(): Promise<HealthCheckResult> {
    return this.health.check(this.pingCheck());
  }

  pingCheck(): HealthIndicatorFunction[] {
    return [() => this.isServiceHealthy(EHealthService.MONGODB)];
  }

  async isServiceHealthy(key: EHealthService): Promise<HealthIndicatorResult> {
    try {
      switch (key) {
        case EHealthService.MONGODB: {
          await this.mongo.pingCheck(EHealthService.MONGODB, { timeout: 3000 });
          break;
        }
      }
      return this.getStatus(key, true);
    } catch (err) {
      return this.getStatus(key, false, err);
    }
  }
}
